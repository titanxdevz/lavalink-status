import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import dns from 'node:dns';
import { notifyNodeSubmission, notifyNodeStatusChange, notifyNodeDeletion } from '@/lib/discord';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// Raw TCP probes and the DNS override below require the Node.js runtime.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Force prioritize IPv4 over IPv6 to fix connectivity issues on localhost
dns.setDefaultResultOrder('ipv4first');

// The landing page can mount several times in one session and the client already
// refreshes every two minutes. A short-lived cache absorbs bursts of traffic
// without serving stale health data for long.
const CACHE_TTL_MS = 15 * 1000;
const responseCache = new Map();
const inFlightProbes = new Map();

function readCache(key) {
    const entry = responseCache.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
        responseCache.delete(key);
        return null;
    }
    return entry.data;
}

function writeCache(key, data) {
    responseCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

function invalidateCache() {
    responseCache.clear();
    inFlightProbes.clear();
}

// Fields a regular owner (or an admin) is allowed to edit. Everything else
// (ownerId, status, createdAt, ...) must go through its dedicated path.
const EDITABLE_FIELDS = [
    'identifier',
    'host',
    'port',
    'password',
    'secure',
    'restVersion',
    'website',
    'discord',
    'authorId',
];

const VALID_STATUSES = new Set(['pending', 'approved', 'rejected']);

function parsePort(value) {
    const port = Number.parseInt(value, 10);
    return Number.isInteger(port) && port > 0 && port <= 65535 ? port : null;
}

async function getNodesCollection() {
    const client = await clientPromise;
    const db = client.db();
    return db.collection("nodes");
}

// Helper to format bytes
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Helper to format duration
function formatDuration(ms) {
    if (!ms) return '0s';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.join(' ') || '0s';
}

async function fetchWithRetry(url, options, maxRetries = 1) {
    let lastError;
    for (let i = 0; i <= maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            return response;
        } catch (error) {
            lastError = error;
            if (i < maxRetries) {
                // Wait 500ms before retry
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }
    throw lastError;
}

async function probeNode(node) {
    const protocol = node.secure ? "https" : "http";
    const baseUrl = `${protocol}://${node.host}:${node.port}`;
    const version = node.restVersion || 'v4';
    const statsUrl = `${baseUrl}/${version}/stats`;
    const infoUrl = `${baseUrl}/${version}/info`;
    const startedAt = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
        const fetchOptions = {
            headers: { Authorization: node.password },
            signal: controller.signal,
            cache: 'no-store',
        };

        const [statsRes, infoRes] = await Promise.all([
            fetchWithRetry(statsUrl, fetchOptions),
            fetchWithRetry(infoUrl, fetchOptions)
        ]).finally(() => clearTimeout(timeoutId));

        if (!statsRes.ok) throw new Error(`Stats failed: ${statsRes.status}`);

        const stats = await statsRes.json();
        const info = infoRes.ok ? await infoRes.json() : null;

        const systemLoad = (stats.cpu?.systemLoad * 100 || 0).toFixed(2);

        return {
            ...node,
            _id: node._id.toString(), // Convert ObjectId to string for front-end
            isConnected: true,
            memory: formatBytes(stats.memory?.used || 0),
            cpu: `${systemLoad}%`,
            connections: `${stats.playingPlayers || 0}/${stats.players || 0}`,
            systemLoad: `${systemLoad}%`,
            cpuCores: stats.cpu?.cores || 0,
            uptime: formatDuration(stats.uptime || 0),
            uptimeMillis: stats.uptime || 0,
            latencyMs: Date.now() - startedAt,
            info: info || {},
        };
    } catch {
        clearTimeout(timeoutId);
        return {
            ...node,
            _id: node._id.toString(), // Convert ObjectId to string for front-end
            isConnected: false,
            memory: "0 B",
            cpu: "0%",
            connections: "0/0",
            systemLoad: "0%",
            cpuCores: 0,
            uptime: "0s",
            uptimeMillis: 0,
            latencyMs: null,
            info: null,
        };
    }
}

async function loadNodes(showAll) {
    const collection = await getNodesCollection();
    const query = showAll ? {} : { status: 'approved' };
    const localNodes = await collection.find(query).toArray();
    return Promise.all(localNodes.map(probeNode));
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';
    const cacheKey = showAll ? 'all' : 'approved';

    const cached = readCache(cacheKey);
    if (cached) {
        return NextResponse.json(cached, {
            headers: { 'Cache-Control': 'no-store' },
        });
    }

    try {
        // Collapse concurrent misses into a single probe pass.
        let pending = inFlightProbes.get(cacheKey);
        if (!pending) {
            pending = loadNodes(showAll).finally(() => inFlightProbes.delete(cacheKey));
            inFlightProbes.set(cacheKey, pending);
        }

        const results = await pending;
        writeCache(cacheKey, results);

        return NextResponse.json(results, {
            headers: { 'Cache-Control': 'no-store' },
        });
    } catch (error) {
        console.error("Error processing nodes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) });

        if (user?.isBanned) {
            return NextResponse.json({ error: "Access denied. Your account is currently suspended from infrastructure deployment." }, { status: 403 });
        }

        const body = await request.json();
        const { identifier, host, port, password, secure, restVersion, authorId, website, discord } = body;

        const parsedPort = parsePort(port);
        if (!identifier || !host || !parsedPort || !password) {
            return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
        }

        const collection = await getNodesCollection();
        const newNode = {
            identifier,
            host,
            port: parsedPort,
            password,
            secure: !!secure,
            restVersion: restVersion || "v4",
            authorId: authorId || session.user.name || "Anonymous",
            ownerId: session.user.id, // Save the owner's Discord ID
            website: website || null,
            discord: discord || null,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        const result = await collection.insertOne(newNode);
        invalidateCache();

        // Send Discord notification for new submission
        const nodeWithId = { ...newNode, _id: result.insertedId.toString() };
        await notifyNodeSubmission(nodeWithId);

        return NextResponse.json({
            message: "Node submitted for approval",
            node: nodeWithId
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();
        const { _id, reason, ...payload } = body;

        let query;
        if (_id) {
            if (!ObjectId.isValid(_id)) {
                return NextResponse.json({ error: "Invalid node id" }, { status: 400 });
            }
            query = { _id: new ObjectId(_id) };
        } else if (payload.host && payload.port !== undefined) {
            const lookupPort = parsePort(payload.port);
            if (!lookupPort) {
                return NextResponse.json({ error: "Invalid port" }, { status: 400 });
            }
            query = { host: payload.host, port: lookupPort };
        } else {
            return NextResponse.json({ error: "Missing required identifier" }, { status: 400 });
        }

        const collection = await getNodesCollection();
        const currentNode = await collection.findOne(query);
        if (!currentNode) {
            return NextResponse.json({ error: "Node not found" }, { status: 404 });
        }

        const adminPass = request.headers.get("X-Admin-Password");
        const isAdmin = Boolean(adminPass && process.env.ADMIN_PASSWORD && adminPass === process.env.ADMIN_PASSWORD);
        const isOwner = Boolean(session && session.user.id === currentNode.ownerId);
        const wantsStatusChange = payload.status !== undefined;

        // Preserve existing behaviour: a request that only changes status is
        // accepted for the admin flow, while other edits need ownership.
        if (!isAdmin && !isOwner && !wantsStatusChange) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (wantsStatusChange && !VALID_STATUSES.has(payload.status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const updates = {};
        for (const field of EDITABLE_FIELDS) {
            if (payload[field] !== undefined) {
                updates[field] = payload[field];
            }
        }

        // When the node is addressed by host/port, those fields identify the
        // record rather than describing a change.
        if (!_id) {
            delete updates.host;
            delete updates.port;
        }

        if (updates.port !== undefined) {
            const nextPort = parsePort(updates.port);
            if (!nextPort) {
                return NextResponse.json({ error: "Invalid port" }, { status: 400 });
            }
            updates.port = nextPort;
        }

        if (updates.secure !== undefined) {
            updates.secure = !!updates.secure;
        }

        if (wantsStatusChange) {
            updates.status = payload.status;
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: "No changes provided" }, { status: 400 });
        }

        const oldStatus = currentNode.status;
        const newStatus = updates.status;

        const result = await collection.updateOne(query, { $set: updates });

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Node not found" }, { status: 404 });
        }

        invalidateCache();

        if (oldStatus !== newStatus && (newStatus === 'approved' || newStatus === 'rejected')) {
            const updatedNode = { ...currentNode, ...updates, _id: currentNode._id.toString() };
            await notifyNodeStatusChange(updatedNode, oldStatus, newStatus, reason || null);
        }

        return NextResponse.json({ message: `Node updated successfully` });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(request.url);
        const host = searchParams.get('host');
        const port = searchParams.get('port');
        const id = searchParams.get('id');

        let query;
        if (id) {
            if (!ObjectId.isValid(id)) {
                return NextResponse.json({ error: "Invalid node id" }, { status: 400 });
            }
            query = { _id: new ObjectId(id) };
        } else if (host && port) {
            const parsedPort = parsePort(port);
            if (!parsedPort) {
                return NextResponse.json({ error: "Invalid port" }, { status: 400 });
            }
            query = { host: host, port: parsedPort };
        } else {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const collection = await getNodesCollection();
        const nodeToDelete = await collection.findOne(query);
        if (!nodeToDelete) {
            return NextResponse.json({ error: "Node not found" }, { status: 404 });
        }

        const adminPass = request.headers.get("X-Admin-Password");
        const isAdmin = Boolean(adminPass && process.env.ADMIN_PASSWORD && adminPass === process.env.ADMIN_PASSWORD);
        const isOwner = Boolean(session && session.user.id === nodeToDelete.ownerId);

        if (!isAdmin && !isOwner) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const result = await collection.deleteOne(query);

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Node not found" }, { status: 404 });
        }

        invalidateCache();

        const nodeForNotification = { ...nodeToDelete, _id: nodeToDelete._id.toString() };
        await notifyNodeDeletion(nodeForNotification);

        return NextResponse.json({ message: "Node deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
