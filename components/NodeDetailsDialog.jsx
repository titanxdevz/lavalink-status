"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Activity,
    AlertTriangle,
    Check,
    Clock,
    Code2,
    Copy,
    Cpu,
    Filter,
    Globe,
    HardDrive,
    Loader2,
    Pencil,
    Puzzle,
    Save,
    Server,
    Trash2,
    Users,
    Wrench,
    X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useNodes } from "@/contexts/NodesContext";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Badge, Field, inputClasses } from "@/components/site/ui";
import { formatUptime, parseLoad, parsePlayers } from "@/hooks/useLandingNodes";

function SectionHeader({ icon: Icon, title, count }) {
    return (
        <div className="flex items-center gap-2 border-b border-line pb-2.5">
            <Icon size={13} className="text-signal" />
            <h3 className="font-data text-[10px] uppercase tracking-[0.16em] text-white">
                {title}
            </h3>
            {typeof count === "number" && (
                <span className="ml-auto font-data text-[10px] text-dim tabular-nums">
                    {count}
                </span>
            )}
        </div>
    );
}

function formatBuild(node) {
    const version = node.info?.version;
    if (version?.major !== undefined) {
        return `${version.major}.${version.minor ?? 0}.${version.patch ?? 0}`;
    }
    return version?.semver || "Unknown";
}

export function NodeDetailsDialog({ node, open, onOpenChange }) {
    const { data: session } = useSession();
    const { updateNode, deleteNode } = useNodes();

    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");
    const [editData, setEditData] = useState(null);

    if (!node) return null;

    const online = Boolean(node.isConnected);
    const isOwner = Boolean(session?.user?.id && session.user.id === node.ownerId);
    const endpoint = `${node.secure ? "wss" : "ws"}://${node.host}:${node.port}`;
    const load = parseLoad(node.systemLoad);
    const players = parsePlayers(node.connections);

    const startEdit = () => {
        setError("");
        setEditData({
            identifier: node.identifier || "",
            host: node.host || "",
            port: node.port || "",
            password: node.password || "",
            secure: Boolean(node.secure),
            restVersion: node.restVersion || "v4",
            website: node.website || "",
            discord: node.discord || "",
        });
        setIsEditing(true);
    };

    const save = async () => {
        setIsSaving(true);
        setError("");
        try {
            await updateNode({ _id: node._id, ...editData });
            setIsEditing(false);
        } catch (err) {
            setError(err.message || "Could not save the node.");
        } finally {
            setIsSaving(false);
        }
    };

    const remove = async () => {
        if (!window.confirm(`Permanently remove “${node.identifier}” from the directory?`)) {
            return;
        }
        setIsDeleting(true);
        setError("");
        try {
            await deleteNode(node.host, node.port, node._id);
            onOpenChange(false);
        } catch (err) {
            setError(err.message || "Could not delete the node.");
        } finally {
            setIsDeleting(false);
        }
    };

    const copyJson = async () => {
        const json = JSON.stringify(
            {
                identifier: node.identifier,
                password: node.password || "youshallnotpass",
                host: node.host,
                port: node.port,
                secure: Boolean(node.secure),
            },
            null,
            2
        );

        try {
            await navigator.clipboard.writeText(json);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            setError("Clipboard access was blocked. Copy the values manually.");
        }
    };

    const telemetry = [
        { label: "Memory", value: node.memory || "—", icon: HardDrive },
        { label: "Players", value: players, icon: Users },
        { label: "Load", value: online ? `${load.toFixed(1)}%` : "—", icon: Activity },
        { label: "Uptime", value: formatUptime(node.uptimeMillis), icon: Clock },
        { label: "Cores", value: node.cpuCores || "—", icon: Cpu },
    ];

    const buildInfo = [
        { label: "Lavalink", value: formatBuild(node) },
        { label: "Java", value: node.info?.jvm?.split(" ")[0] },
        {
            label: "Build date",
            value: node.info?.buildTime
                ? new Date(node.info.buildTime).toLocaleDateString()
                : null,
        },
        { label: "Lavaplayer", value: node.info?.lavaplayer },
    ].filter((item) => item.value);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[92vh] w-[95vw] max-w-4xl gap-0 overflow-y-auto border-line bg-ink-900 p-0 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.95)] [&>button]:hidden">
                <DialogTitle className="sr-only">
                    Node details for {node.identifier}
                </DialogTitle>

                <div className="sticky top-0 z-20 border-b border-line bg-ink-900/95 backdrop-blur">
                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-data text-[9px] uppercase tracking-[0.16em] ${
                                        online
                                            ? "border-ok/30 bg-ok/10 text-ok"
                                            : "border-bad/30 bg-bad/10 text-bad"
                                    }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 ${
                                            online ? "bg-ok" : "bg-bad"
                                        }`}
                                    />
                                    {online ? "Online" : "Offline"}
                                </span>
                                <Badge tone={node.secure ? "ok" : "dim"}>
                                    {node.secure ? "TLS / WSS" : "Plain WS"}
                                </Badge>
                                <Badge tone="dim">{node.restVersion || "v4"}</Badge>
                            </div>

                            <h2 className="mt-3 truncate font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                {node.identifier || "Unnamed node"}
                            </h2>

                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-data text-[10px] uppercase tracking-[0.14em] text-dim">
                                <span>
                                    Operator:{" "}
                                    {node.ownerId ? (
                                        <Link
                                            href={`/profile/${node.ownerId}`}
                                            className="text-white transition-colors hover:text-signal"
                                        >
                                            {node.authorId || "Unknown"}
                                        </Link>
                                    ) : (
                                        <span className="text-white">
                                            {node.authorId || "Community"}
                                        </span>
                                    )}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Globe size={11} />
                                    {node.region || "Global"}
                                </span>
                            </div>

                            {(node.website || node.discord) && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {node.website && (
                                        <a
                                            href={node.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex h-8 items-center gap-1.5 border border-line bg-ink-950 px-2.5 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-signal/50 hover:text-white"
                                        >
                                            <Globe size={12} />
                                            Website
                                        </a>
                                    )}
                                    {node.discord && (
                                        <a
                                            href={node.discord}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex h-8 items-center gap-1.5 border border-line bg-ink-950 px-2.5 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-signal/50 hover:text-white"
                                        >
                                            <Server size={12} />
                                            Discord
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            {isOwner && !isEditing && (
                                <>
                                    <button
                                        type="button"
                                        onClick={startEdit}
                                        className="inline-flex h-9 items-center gap-1.5 border border-line bg-ink-950 px-3 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-signal/50 hover:text-white"
                                    >
                                        <Pencil size={12} />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={remove}
                                        disabled={isDeleting}
                                        className="inline-flex h-9 items-center gap-1.5 border border-bad/40 bg-bad/10 px-3 font-data text-[10px] uppercase tracking-[0.14em] text-bad transition-colors hover:bg-bad/20 disabled:opacity-60"
                                    >
                                        {isDeleting ? (
                                            <Loader2 size={12} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={12} />
                                        )}
                                        Delete
                                    </button>
                                </>
                            )}

                            <button
                                type="button"
                                onClick={() => onOpenChange(false)}
                                className="grid h-9 w-9 place-items-center border border-line bg-ink-950 text-dim transition-colors hover:text-white"
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-8 p-5 sm:p-6">
                    {error && (
                        <p
                            role="alert"
                            className="border border-bad/40 bg-bad/10 px-3 py-2 text-sm text-bad"
                        >
                            {error}
                        </p>
                    )}

                    {isEditing && editData ? (
                        <div className="space-y-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Identifier"
                                    htmlFor="detail-identifier"
                                    className="sm:col-span-2"
                                >
                                    <input
                                        id="detail-identifier"
                                        value={editData.identifier}
                                        onChange={(event) =>
                                            setEditData((previous) => ({
                                                ...previous,
                                                identifier: event.target.value,
                                            }))
                                        }
                                        className={inputClasses()}
                                    />
                                </Field>

                                <Field label="Host" htmlFor="detail-host">
                                    <input
                                        id="detail-host"
                                        value={editData.host}
                                        onChange={(event) =>
                                            setEditData((previous) => ({
                                                ...previous,
                                                host: event.target.value,
                                            }))
                                        }
                                        className={inputClasses()}
                                    />
                                </Field>

                                <Field label="Port" htmlFor="detail-port">
                                    <input
                                        id="detail-port"
                                        type="number"
                                        min="1"
                                        max="65535"
                                        value={editData.port}
                                        onChange={(event) =>
                                            setEditData((previous) => ({
                                                ...previous,
                                                port: event.target.value,
                                            }))
                                        }
                                        className={inputClasses()}
                                    />
                                </Field>

                                <Field
                                    label="Auth key"
                                    htmlFor="detail-password"
                                    className="sm:col-span-2"
                                >
                                    <input
                                        id="detail-password"
                                        value={editData.password}
                                        onChange={(event) =>
                                            setEditData((previous) => ({
                                                ...previous,
                                                password: event.target.value,
                                            }))
                                        }
                                        className={inputClasses()}
                                    />
                                </Field>

                                <Field label="REST version" htmlFor="detail-version">
                                    <select
                                        id="detail-version"
                                        value={editData.restVersion}
                                        onChange={(event) =>
                                            setEditData((previous) => ({
                                                ...previous,
                                                restVersion: event.target.value,
                                            }))
                                        }
                                        className={inputClasses("appearance-none")}
                                    >
                                        <option value="v4">Lavalink v4</option>
                                        <option value="v3">Lavalink v3</option>
                                    </select>
                                </Field>

                                <Field label="Transport" htmlFor="detail-secure">
                                    <button
                                        id="detail-secure"
                                        type="button"
                                        aria-pressed={editData.secure}
                                        onClick={() =>
                                            setEditData((previous) => ({
                                                ...previous,
                                                secure: !previous.secure,
                                            }))
                                        }
                                        className={`flex h-11 w-full items-center justify-between border px-3 font-data text-[10px] uppercase tracking-[0.14em] transition-colors ${
                                            editData.secure
                                                ? "border-ok/50 bg-ok/10 text-ok"
                                                : "border-line bg-ink-950 text-dim hover:text-white"
                                        }`}
                                    >
                                        {editData.secure ? "TLS / WSS" : "Plain WS"}
                                        {editData.secure && <Check size={13} />}
                                    </button>
                                </Field>

                                <Field label="Website" htmlFor="detail-website">
                                    <input
                                        id="detail-website"
                                        type="url"
                                        value={editData.website}
                                        onChange={(event) =>
                                            setEditData((previous) => ({
                                                ...previous,
                                                website: event.target.value,
                                            }))
                                        }
                                        placeholder="https://example.com"
                                        className={inputClasses()}
                                    />
                                </Field>

                                <Field label="Discord invite" htmlFor="detail-discord">
                                    <input
                                        id="detail-discord"
                                        type="url"
                                        value={editData.discord}
                                        onChange={(event) =>
                                            setEditData((previous) => ({
                                                ...previous,
                                                discord: event.target.value,
                                            }))
                                        }
                                        placeholder="https://discord.gg/..."
                                        className={inputClasses()}
                                    />
                                </Field>
                            </div>

                            <div className="flex items-start gap-3 border border-warn/30 bg-warn/10 p-3.5">
                                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-warn" />
                                <p className="text-xs leading-relaxed text-warn">
                                    Changing the host, port, or transport may require the node to
                                    be re-verified by an administrator.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 border-t border-line pt-5">
                                <button
                                    type="button"
                                    onClick={save}
                                    disabled={isSaving}
                                    className="inline-flex h-11 items-center gap-2 border border-signal bg-signal px-5 font-data text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-signal-soft disabled:opacity-60"
                                >
                                    {isSaving ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <Save size={14} />
                                    )}
                                    Save changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="inline-flex h-11 items-center gap-2 border border-line bg-ink-950 px-5 font-data text-[11px] uppercase tracking-[0.14em] text-dim transition-colors hover:text-white"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <SectionHeader icon={Server} title="Endpoint" />
                                <div className="mt-3 grid gap-px border border-line bg-line sm:grid-cols-2">
                                    <div className="bg-ink-950 px-4 py-3">
                                        <p className="font-data text-[9px] uppercase tracking-[0.16em] text-dim">
                                            Host
                                        </p>
                                        <p className="mt-1 break-all font-data text-sm text-white">
                                            {node.host}
                                        </p>
                                    </div>
                                    <div className="bg-ink-950 px-4 py-3">
                                        <p className="font-data text-[9px] uppercase tracking-[0.16em] text-dim">
                                            Port
                                        </p>
                                        <p className="mt-1 font-data text-sm text-white tabular-nums">
                                            {node.port}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between gap-3 border-b border-line pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <Code2 size={13} className="text-signal" />
                                        <h3 className="font-data text-[10px] uppercase tracking-[0.16em] text-white">
                                            Connection block
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={copyJson}
                                        className={`inline-flex h-8 items-center gap-1.5 border px-2.5 font-data text-[10px] uppercase tracking-[0.14em] transition-colors ${
                                            copied
                                                ? "border-ok/40 bg-ok/10 text-ok"
                                                : "border-line bg-ink-950 text-dim hover:border-signal/50 hover:text-white"
                                        }`}
                                    >
                                        {copied ? <Check size={12} /> : <Copy size={12} />}
                                        {copied ? "Copied" : "Copy JSON"}
                                    </button>
                                </div>

                                <div className="mt-3 border border-line bg-ink-950 p-4">
                                    <pre className="overflow-x-auto font-data text-xs leading-relaxed text-dim">
                                        <code>
                                            {`{\n  "identifier": "${node.identifier}",\n  "password": `}
                                            <span className="text-signal">
                                                &quot;{node.password || "youshallnotpass"}&quot;
                                            </span>
                                            {`,\n  "host": "${node.host}",\n  "port": ${node.port},\n  "secure": ${Boolean(
                                                node.secure
                                            )}\n}`}
                                        </code>
                                    </pre>
                                </div>

                                <p className="mt-2 font-data text-[10px] uppercase tracking-[0.14em] text-dim">
                                    {endpoint}
                                </p>
                            </div>

                            {online ? (
                                <>
                                    <div>
                                        <SectionHeader icon={Activity} title="Live telemetry" />
                                        <dl className="mt-3 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-5">
                                            {telemetry.map((stat) => (
                                                <div
                                                    key={stat.label}
                                                    className="bg-ink-950 px-3 py-3"
                                                >
                                                    <dt className="flex items-center gap-1.5 font-data text-[9px] uppercase tracking-[0.14em] text-dim">
                                                        <stat.icon size={10} />
                                                        {stat.label}
                                                    </dt>
                                                    <dd className="mt-1 truncate font-display text-base font-semibold text-white tabular-nums">
                                                        {stat.value}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </div>

                                    {buildInfo.length > 0 && (
                                        <div>
                                            <SectionHeader icon={Wrench} title="Build" />
                                            <dl className="mt-3 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                                                {buildInfo.map((item) => (
                                                    <div
                                                        key={item.label}
                                                        className="bg-ink-950 px-3 py-3"
                                                    >
                                                        <dt className="font-data text-[9px] uppercase tracking-[0.14em] text-dim">
                                                            {item.label}
                                                        </dt>
                                                        <dd className="mt-1 truncate font-data text-xs text-white">
                                                            {item.value}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        </div>
                                    )}

                                    {node.info?.sourceManagers?.length > 0 && (
                                        <div>
                                            <SectionHeader
                                                icon={Globe}
                                                title="Sources"
                                                count={node.info.sourceManagers.length}
                                            />
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {node.info.sourceManagers.map((source) => (
                                                    <span
                                                        key={source}
                                                        className="border border-line bg-ink-950 px-2.5 py-1 font-data text-[10px] uppercase tracking-[0.14em] text-dim"
                                                    >
                                                        {source}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid gap-6 lg:grid-cols-2">
                                        {node.info?.plugins?.length > 0 && (
                                            <div>
                                                <SectionHeader
                                                    icon={Puzzle}
                                                    title="Plugins"
                                                    count={node.info.plugins.length}
                                                />
                                                <ul className="mt-3 divide-y divide-line border border-line bg-ink-950">
                                                    {node.info.plugins.map((plugin, index) => (
                                                        <li
                                                            key={`${plugin.name}-${index}`}
                                                            className="flex items-center justify-between gap-3 px-3 py-2.5"
                                                        >
                                                            <span className="truncate font-data text-xs text-white">
                                                                {plugin.name}
                                                            </span>
                                                            <span className="shrink-0 font-data text-[10px] text-dim">
                                                                {plugin.version}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {node.info?.filters?.length > 0 && (
                                            <div>
                                                <SectionHeader
                                                    icon={Filter}
                                                    title="Filters"
                                                    count={node.info.filters.length}
                                                />
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {node.info.filters.map((filter) => (
                                                        <span
                                                            key={filter}
                                                            className="border border-line bg-ink-950 px-2.5 py-1 font-data text-[10px] uppercase tracking-[0.14em] text-dim"
                                                        >
                                                            {filter}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-3 border border-bad/30 bg-bad/10 px-6 py-10 text-center">
                                    <Server size={26} className="text-bad" />
                                    <h3 className="font-display text-lg font-semibold text-white">
                                        Node unreachable
                                    </h3>
                                    <p className="max-w-md text-sm leading-relaxed text-dim">
                                        Telemetry is unavailable while the node fails its health
                                        probe. The connection block above still reflects the
                                        submitted details.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
