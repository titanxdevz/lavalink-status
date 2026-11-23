"use client";

import { useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { parseLoad, parsePlayers } from "@/hooks/useLandingNodes";
import { LiveAge } from "./LiveAge";

function formatMemory(stats) {
    if (!stats.total) return "—";
    if (stats.memoryGb >= 1) return `${stats.memoryGb.toFixed(1)} GB`;
    return `${Math.round(stats.memoryMb)} MB`;
}

export function NetworkConsole({ stats, nodes, loading, lastFetch, onRefresh, onSelect }) {
    const firstLoad = loading && !lastFetch;

    const topNodes = useMemo(() => {
        const online = nodes.filter((node) => node.isConnected);
        const pool = online.length ? online : nodes;
        return [...pool]
            .sort((a, b) => parseLoad(b.systemLoad) - parseLoad(a.systemLoad))
            .slice(0, 4);
    }, [nodes]);

    const onlineRatio = stats.total ? (stats.online / stats.total) * 100 : 0;

    return (
        <div className="relative overflow-hidden border border-line bg-ink-900">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/70 to-transparent" />

            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
                <span className="font-data text-[10px] uppercase tracking-[0.2em] text-dim">
                    Grid status
                </span>
                <span className="inline-flex items-center gap-2 font-data text-[10px] uppercase tracking-[0.16em] text-ok">
                    <span className="h-1.5 w-1.5 bg-ok motion-safe:animate-pulse-soft" />
                    Live
                </span>
            </div>

            <div className="p-5 sm:p-6">
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <div className="font-display text-5xl font-semibold tracking-tight text-white tabular-nums sm:text-6xl">
                            {firstLoad ? "—" : stats.online}
                            <span className="ml-1 font-data text-lg font-normal text-dim">
                                /{firstLoad ? "—" : stats.total}
                            </span>
                        </div>
                        <div className="mt-2 font-data text-[10px] uppercase tracking-[0.18em] text-dim">
                            Nodes online
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-data text-xl font-medium text-white tabular-nums">
                            {firstLoad ? "—" : `${stats.avgLoad.toFixed(1)}%`}
                        </div>
                        <div className="mt-1 font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                            Avg load
                        </div>
                    </div>
                </div>

                <div className="mt-5 h-1 w-full overflow-hidden bg-ink-800">
                    <div
                        className="h-full bg-signal transition-[width] duration-700"
                        style={{ width: `${firstLoad ? 0 : onlineRatio}%` }}
                    />
                </div>

                <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden border border-line bg-line">
                    {[
                        { label: "Players", value: firstLoad ? "—" : stats.players },
                        { label: "Memory", value: firstLoad ? "—" : formatMemory(stats) },
                        { label: "Regions", value: firstLoad ? "—" : stats.regions },
                    ].map((metric) => (
                        <div key={metric.label} className="bg-ink-950 px-3 py-2.5">
                            <dt className="font-data text-[9px] uppercase tracking-[0.16em] text-dim">
                                {metric.label}
                            </dt>
                            <dd className="mt-1 truncate font-display text-base font-semibold text-white tabular-nums">
                                {metric.value}
                            </dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-6">
                    <div className="flex items-center justify-between font-data text-[9px] uppercase tracking-[0.18em] text-dim">
                        <span>Busiest nodes</span>
                        <span>Load</span>
                    </div>

                    <ul className="mt-2 divide-y divide-line border-y border-line">
                        {firstLoad
                            ? [0, 1, 2, 3].map((row) => (
                                  <li key={row} className="flex items-center gap-3 py-2.5">
                                      <span className="h-1.5 w-1.5 bg-ink-700" />
                                      <span className="h-2.5 flex-1 animate-pulse bg-ink-800" />
                                      <span className="h-1 w-16 bg-ink-800" />
                                  </li>
                              ))
                            : topNodes.map((node) => {
                                  const load = parseLoad(node.systemLoad);
                                  return (
                                      <li key={node._id || `${node.host}:${node.port}`}>
                                          <button
                                              type="button"
                                              onClick={() => onSelect?.(node)}
                                              className="group flex w-full items-center gap-3 py-2.5 text-left"
                                          >
                                              <span
                                                  className={`h-1.5 w-1.5 shrink-0 ${
                                                      node.isConnected ? "bg-ok" : "bg-bad"
                                                  }`}
                                              />
                                              <span className="min-w-0 flex-1 truncate font-data text-[11px] text-white group-hover:text-signal">
                                                  {node.identifier || "Unnamed node"}
                                              </span>
                                              <span className="hidden font-data text-[9px] uppercase tracking-[0.12em] text-dim sm:block">
                                                  {node.region || "—"}
                                              </span>
                                              <span className="w-16 shrink-0">
                                                  <span className="block h-1 bg-ink-800">
                                                      <span
                                                          className="block h-full bg-signal/70"
                                                          style={{ width: `${Math.min(100, Math.max(3, load))}%` }}
                                                      />
                                                  </span>
                                              </span>
                                              <span className="w-9 shrink-0 text-right font-data text-[10px] text-dim tabular-nums">
                                                  {node.isConnected ? `${load.toFixed(0)}%` : "off"}
                                              </span>
                                          </button>
                                      </li>
                                  );
                              })}
                    </ul>

                    {!firstLoad && topNodes.length === 0 && (
                        <p className="py-6 text-center font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                            Waiting for the first sync
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-3">
                <LiveAge
                    timestamp={lastFetch}
                    prefix="Updated"
                    className="font-data text-[9px] uppercase tracking-[0.16em] text-dim"
                />
                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:text-white disabled:opacity-50"
                >
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>
        </div>
    );
}
