import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import dns from 'node:dns';

// Force prioritize IPv4 over IPv6 to fix connectivity issues on localhost
dns.setDefaultResultOrder('ipv4first');

async function getNodesCollection() {
    const client = await clientPromise;
    const db = client.db("lavalink-list");
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

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    try {
        const collection = await getNodesCollection();
        const query = showAll ? {} : { status: 'approved' };
        const localNodes = await collection.find(query).toArray();

        const nodePromises = localNodes.map(async (node) => {
            const protocol = node.secure ? "https" : "http";
            const baseUrl = `${protocol}://${node.host}:${node.port}`;
            const version = node.restVersion || 'v4';
            const statsUrl = `${baseUrl}/${version}/stats`;
            const infoUrl = `${baseUrl}/${version}/info`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // reduced timeout to 8s

            try {
                const fetchOptions = {
                    headers: { Authorization: node.password },
                    signal: controller.signal
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
                    info: info || {},
                };

            } catch (error) {
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
                    info: null,
                };
            }
        });

        const results = await Promise.all(nodePromises);
        return NextResponse.json(results);

    } catch (error) {
        console.error("Error processing nodes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { identifier, host, port, password, secure, restVersion, authorId, website, discord } = body;

        if (!identifier || !host || !port || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const collection = await getNodesCollection();
        const newNode = {
            identifier,
            host,
            port: parseInt(port),
            password,
            secure: !!secure,
            restVersion: restVersion || "v4",
            authorId: authorId || "Anonymous",
            website: website || null,
            discord: discord || null,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        const result = await collection.insertOne(newNode);
        
        return NextResponse.json({ 
            message: "Node submitted for approval", 
            node: { ...newNode, _id: result.insertedId.toString() } 
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        const { _id, host, port, ...updates } = body;

        if (!_id && (!host || !port)) {
            return NextResponse.json({ error: "Missing required identifier" }, { status: 400 });
        }

        const collection = await getNodesCollection();
        let query = {};
        if (_id) {
            query = { _id: new ObjectId(_id) };
        } else {
            query = { host: host, port: parseInt(port) };
        }

        if (updates.port !== undefined) {
             updates.port = parseInt(updates.port);
        }

        const result = await collection.updateOne(query, { $set: updates });

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Node not found" }, { status: 404 });
        }

        return NextResponse.json({ message: `Node updated successfully` });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const host = searchParams.get('host');
        const port = searchParams.get('port');

        if (!host || !port) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const collection = await getNodesCollection();
        const result = await collection.deleteOne({ 
            host: host, 
            port: parseInt(port) 
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Node not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Node deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

