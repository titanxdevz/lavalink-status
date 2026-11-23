"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Activity,
    ArrowUpRight,
    Check,
    Copy,
    Cpu,
    Globe,
    HardDrive,
    Pencil,
    Server,
    ShieldCheck,
    Trash2,
    Wifi,
} from "lucide-react";
import { formatUptime, parseLoad, parsePlayers } from "@/hooks/useLandingNodes";

function endpointOf(node) {
    if (!node?.host) return "—";
    return `${node.secure ? "wss" : "ws"}://${node.host}${node.port ? `:${node.port}` : ""}`;
}

function healthOf(node) {
    if (!node.isConnected) return { label: "Offline", dot: "bg-bad", text: "text-bad" };
    if (parseLoad(node.systemLoad) > 85)
        return { label: "Heavy load", dot: "bg-warn", text: "text-warn" };
    return { label: "Online", dot: "bg-ok", text: "text-ok" };
}

export function NodeCard({ node, onClick, onEdit, onDelete, minimal = false }) {
    const [copied, setCopied] = useState(false);

    if (!node) return null;

    const online = Boolean(node.isConnected);
    const health = healthOf(node);
    const endpoint = endpointOf(node);
    const players = parsePlayers(node.connections);
    const load = parseLoad(node.systemLoad);
    const editable = Boolean(onEdit && onDelete);

    const handleCopy = async (event) => {
        event.stopPropagation();
        try {
            await navigator.clipboard.writeText(endpoint);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // Clipboard can be blocked; the endpoint stays visible on the card.
        }
    };

    if (minimal) {
        return (
            <div className="relative border border-line bg-ink-900 transition-colors hover:border-signal/50">
                {onClick && (
                    <button
                        type="button"
                        onClick={() => onClick(node)}
                        className="absolute inset-0 z-0"
                        aria-label={`Inspect ${node.identifier || "node"}`}
                    />
                )}
                <div className="pointer-events-none relative z-10 flex items-center justify-between gap-3 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className={`h-1.5 w-1.5 shrink-0 ${health.dot}`} />
                        <div className="min-w-0">
                            <p className="truncate font-display text-sm font-medium text-white">
                                {node.identifier || "Unnamed node"}
                            </p>
                            <p className="truncate font-data text-[10px] text-dim">
                                {node.host}:{node.port}
                            </p>
                        </div>
                    </div>
                    <span className="shrink-0 font-data text-[10px] uppercase tracking-[0.14em] text-dim">
                        {node.secure ? "TLS" : "WS"}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <article
            className={`group relative flex h-full flex-col border bg-ink-900 transition-colors ${
                online ? "border-line hover:border-signal/50" : "border-line/70"
            }`}
        >
            {onClick && (
                <button
                    type="button"
                    onClick={() => onClick(node)}
                    className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal"
                    aria-label={`Inspect ${node.identifier || "node"}`}
                />
            )}

            <div className="pointer-events-none relative z-10 flex h-full flex-col">
                <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
                    <span className="inline-flex items-center gap-2 font-data text-[10px] uppercase tracking-[0.16em]">
                        <span
                            className={`h-1.5 w-1.5 ${health.dot} ${
                                online ? "motion-safe:animate-pulse-soft" : ""
                            }`}
                        />
                        <span className={health.text}>{health.label}</span>
                    </span>

                    <span className="inline-flex items-center gap-2 font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                        <Globe size={11} />
                        {node.region || "Global"}
                    </span>
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="truncate font-display text-base font-semibold tracking-tight text-white transition-colors group-hover:text-signal">
                                {node.identifier || "Unnamed node"}
                            </h3>
                            <p className="mt-1 truncate font-data text-[11px] text-dim">
                                {node.host}:{node.port}
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                            <span
                                className={`border px-2 py-0.5 font-data text-[9px] uppercase tracking-[0.16em] ${
                                    node.secure
                                        ? "border-ok/30 bg-ok/10 text-ok"
                                        : "border-line bg-ink-950 text-dim"
                                }`}
                            >
                                {node.secure ? "TLS" : "WS"}
                            </span>
                            <span className="font-data text-[9px] uppercase tracking-[0.14em] text-dim">
                                {node.restVersion || "v4"}
                            </span>
                        </div>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-4">
                        {[
                            { label: "Players", value: players, icon: Activity },
                            {
                                label: "Load",
                                value: online ? `${load.toFixed(0)}%` : "—",
                                icon: Cpu,
                            },
                            { label: "Memory", value: node.memory || "—", icon: HardDrive },
                            {
                                label: "Uptime",
                                value: formatUptime(node.uptimeMillis),
                                icon: ShieldCheck,
                            },
                        ].map((metric) => (
                            <div key={metric.label} className="bg-ink-950 px-2.5 py-2">
                                <dt className="flex items-center gap-1 font-data text-[9px] uppercase tracking-[0.14em] text-dim">
                                    <metric.icon size={9} />
                                    {metric.label}
                                </dt>
                                <dd className="mt-0.5 truncate font-data text-[11px] font-medium text-white tabular-nums">
                                    {metric.value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                        <span className="min-w-0 truncate font-data text-[10px] uppercase tracking-[0.14em] text-dim">
                            {node.authorId || "Community"}
                        </span>

                        <div className="pointer-events-auto flex shrink-0 items-center gap-1.5">
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="inline-flex h-8 items-center gap-1.5 border border-line bg-ink-950 px-2.5 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-signal/50 hover:text-white focus-visible:border-signal"
                                aria-label={`Copy ${endpoint}`}
                            >
                                {copied ? (
                                    <Check size={12} className="text-ok" />
                                ) : (
                                    <Copy size={12} />
                                )}
                                {copied ? "Copied" : "Copy"}
                            </button>

                            {editable ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onEdit(node);
                                        }}
                                        className="grid h-8 w-8 place-items-center border border-line bg-ink-950 text-dim transition-colors hover:border-signal/50 hover:text-signal"
                                        aria-label={`Edit ${node.identifier || "node"}`}
                                    >
                                        <Pencil size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onDelete(node);
                                        }}
                                        className="grid h-8 w-8 place-items-center border border-line bg-ink-950 text-dim transition-colors hover:border-bad/50 hover:text-bad"
                                        aria-label={`Delete ${node.identifier || "node"}`}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </>
                            ) : node.ownerId ? (
                                <Link
                                    href={`/profile/${node.ownerId}`}
                                    onClick={(event) => event.stopPropagation()}
                                    className="inline-flex h-8 items-center gap-1.5 border border-line bg-ink-950 px-2.5 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-signal/50 hover:text-signal"
                                >
                                    <Server size={11} />
                                    Operator
                                </Link>
                            ) : null}

                            {onClick && (
                                <span className="grid h-8 w-8 place-items-center border border-line bg-ink-950 text-dim transition-colors group-hover:border-signal/50 group-hover:text-signal">
                                    <ArrowUpRight size={13} />
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
