"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { formatUptime, parseLoad, parsePlayers } from "@/hooks/useLandingNodes";

export function LandingNodeCard({ node, isOwner = false, onSelect }) {
    const [copied, setCopied] = useState(false);

    const online = Boolean(node.isConnected);
    const load = parseLoad(node.systemLoad);
    const players = parsePlayers(node.connections);
    const endpoint = `${node.secure ? "wss" : "ws"}://${node.host}:${node.port}`;

    const health = !online
        ? { label: "Offline", dot: "bg-bad", text: "text-bad" }
        : load > 85
          ? { label: "Heavy load", dot: "bg-warn", text: "text-warn" }
          : { label: "Online", dot: "bg-ok", text: "text-ok" };

    const metrics = [
        { label: "Players", value: players },
        { label: "Load", value: `${load.toFixed(0)}%` },
        { label: "Memory", value: node.memory || "—" },
        { label: "Uptime", value: formatUptime(node.uptimeMillis) },
    ];

    const handleCopy = async (event) => {
        event.stopPropagation();
        try {
            await navigator.clipboard.writeText(endpoint);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // Clipboard access can be blocked; the endpoint is still visible.
        }
    };

    return (
        <article
            className={`group relative flex h-full flex-col border bg-ink-900 transition-colors ${
                online
                    ? "border-line hover:border-signal/50"
                    : "border-line/70 opacity-80 hover:opacity-100"
            }`}
        >
            <button
                type="button"
                onClick={() => onSelect?.(node)}
                className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal"
                aria-label={`Inspect ${node.identifier || "node"}`}
            />

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
                    <span className="font-data text-[10px] uppercase tracking-[0.16em] text-dim">
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
                        <span
                            className={`shrink-0 border px-2 py-0.5 font-data text-[9px] uppercase tracking-[0.16em] ${
                                node.secure
                                    ? "border-ok/30 bg-ok/10 text-ok"
                                    : "border-line bg-ink-950 text-dim"
                            }`}
                        >
                            {node.secure ? "TLS" : "WS"}
                        </span>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-4">
                        {metrics.map((metric) => (
                            <div key={metric.label} className="bg-ink-950 px-2.5 py-2">
                                <dt className="font-data text-[9px] uppercase tracking-[0.14em] text-dim">
                                    {metric.label}
                                </dt>
                                <dd className="mt-0.5 truncate font-data text-[11px] font-medium text-white tabular-nums">
                                    {metric.value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                        <span className="truncate font-data text-[10px] uppercase tracking-[0.14em] text-dim">
                            {isOwner ? "Your node" : node.authorId || "Community"}
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="pointer-events-auto inline-flex h-8 items-center gap-1.5 border border-line bg-ink-950 px-2.5 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-signal/50 hover:text-white focus-visible:border-signal"
                                aria-label={`Copy ${endpoint}`}
                            >
                                {copied ? (
                                    <Check size={12} className="text-ok" />
                                ) : (
                                    <Copy size={12} />
                                )}
                                {copied ? "Copied" : "Copy"}
                            </button>
                            <span className="inline-flex h-8 w-8 items-center justify-center border border-line bg-ink-950 text-dim transition-colors group-hover:border-signal/50 group-hover:text-signal">
                                <ArrowUpRight size={14} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
