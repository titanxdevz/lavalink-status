"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Activity,
    ArrowDown,
    ArrowRight,
    ArrowUpRight,
    Layers,
    Lock,
    ShieldCheck,
    Terminal,
    Users,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NodeDetailsDialog } from "@/components/NodeDetailsDialog";
import { PromotionCard } from "@/components/PromotionCard";
import { NetworkConsole } from "@/components/landing/NetworkConsole";
import { NodeDirectory } from "@/components/landing/NodeDirectory";
import { IntegrationSection } from "@/components/landing/IntegrationSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { NodeIndexSection } from "@/components/site/NodeIndexSection";
import { parseLoad, useLandingNodes } from "@/hooks/useLandingNodes";

const CAPABILITIES = [
    { icon: ShieldCheck, label: "TLS transport" },
    { icon: Activity, label: "Live health checks" },
    { icon: Layers, label: "v3 + v4" },
    { icon: Users, label: "Community hosted" },
];

export function HomePageClient({ nodeIndex = [] }) {
    const landing = useLandingNodes();
    const { nodes, stats, loading, lastFetch, refresh } = landing;

    const [selectedNode, setSelectedNode] = useState(null);
    const [promotion, setPromotion] = useState(null);

    useEffect(() => {
        let cancelled = false;

        fetch("/api/promotions")
            .then((response) => response.json())
            .then((data) => {
                if (cancelled || !Array.isArray(data)) return;
                setPromotion(data.find((item) => item.type === "ad") || null);
            })
            .catch(() => {
                // Promotions are optional; the page still works without them.
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const scrollToDirectory = () => {
        document.getElementById("directory")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const sampleNode = useMemo(
        () => nodes.find((node) => node.isConnected) || nodes[0],
        [nodes]
    );

    const loadSeries = useMemo(
        () =>
            nodes
                .filter((node) => node.isConnected)
                .slice(0, 16)
                .map((node) => parseLoad(node.systemLoad)),
        [nodes]
    );

    const chartValues = loadSeries.length
        ? loadSeries
        : Array.from({ length: 16 }, () => 6);

    return (
        <div className="min-h-screen bg-ink-950 font-display text-white selection:bg-signal selection:text-ink-950">
            <a
                href="#directory"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-signal focus:bg-ink-950 focus:px-4 focus:py-2 focus:font-data focus:text-xs focus:text-white"
            >
                Skip to directory
            </a>

            <Navbar />

            <main>
                {/* Hero */}
                <section className="relative overflow-hidden border-b border-line">
                    <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 mask-fade-b" />
                    <div className="pointer-events-none absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-signal/10 blur-[120px]" />

                    <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-14 sm:pb-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pt-24">
                        <div className="lg:col-span-6 xl:col-span-5">
                            <p className="font-data text-[10px] uppercase tracking-[0.24em] text-signal">
                                Community Lavalink directory
                            </p>

                            <h1 className="mt-5 max-w-xl text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                                Free Lavalink nodes,{" "}
                                <span className="text-signal">verified live.</span>
                            </h1>

                            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-dim sm:text-lg">
                                A community-run directory for Discord music bots. Inspect
                                real-time health, copy a connection string, and connect in
                                minutes.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={scrollToDirectory}
                                    className="inline-flex h-11 items-center justify-center gap-2 border border-signal bg-signal px-5 font-data text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-signal-soft"
                                >
                                    Browse nodes
                                    <ArrowDown size={14} />
                                </button>
                                <Link
                                    href="/submit"
                                    className="inline-flex h-11 items-center justify-center gap-2 border border-line bg-ink-900 px-5 font-data text-[11px] uppercase tracking-[0.14em] text-white transition-colors hover:border-signal/50 hover:text-signal"
                                >
                                    Add your node
                                    <ArrowUpRight size={14} />
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-6 xl:col-span-7">
                            <NetworkConsole
                                stats={stats}
                                nodes={nodes}
                                loading={loading}
                                lastFetch={lastFetch}
                                onRefresh={refresh}
                                onSelect={setSelectedNode}
                            />
                        </div>
                    </div>
                </section>

                {/* Capability strip */}
                <div className="border-b border-line bg-ink-900">
                    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-line sm:grid-cols-4">
                        {CAPABILITIES.map((item) => (
                            <div key={item.label} className="flex items-center gap-2 bg-ink-900 px-4 py-3">
                                <item.icon size={13} className="text-signal" />
                                <span className="font-data text-[9px] uppercase tracking-[0.16em] text-dim">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Directory */}
                <NodeDirectory data={landing} onSelect={setSelectedNode} />

                {/* Server-rendered crawlable index */}
                <NodeIndexSection nodes={nodeIndex} />

                {/* Promotion */}
                {promotion && (
                    <section className="border-b border-line bg-ink-950">
                        <div className="mx-auto max-w-7xl px-6 py-8">
                            <PromotionCard promotion={promotion} />
                        </div>
                    </section>
                )}

                {/* Why this grid */}
                <section className="border-b border-line bg-ink-950">
                    <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
                        <div className="max-w-2xl">
                            <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                Built for people who run bots, not servers.
                            </h2>
                            <p className="mt-3 text-pretty text-base leading-relaxed text-dim">
                                The directory does the boring part: probing nodes, normalizing
                                telemetry, and keeping connection details in one place.
                            </p>
                        </div>

                        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12">
                            <div className="relative overflow-hidden border border-line bg-ink-900 p-6 md:col-span-7">
                                <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
                                <div className="relative">
                                    <div className="flex items-center gap-2 font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                                        <Activity size={13} className="text-signal" />
                                        Live telemetry
                                    </div>
                                    <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-white">
                                        Load is measured, not guessed.
                                    </h3>
                                    <p className="mt-2 max-w-md text-sm leading-relaxed text-dim">
                                        Every card is backed by a REST probe. Players, heap
                                        memory, CPU load, and uptime are read from the node
                                        itself.
                                    </p>

                                    <div className="mt-8 flex h-24 items-end gap-1" aria-hidden="true">
                                        {chartValues.map((value, index) => (
                                            <div
                                                key={index}
                                                className="relative h-full flex-1 bg-ink-800"
                                            >
                                                <div
                                                    className="absolute inset-x-0 bottom-0 bg-signal/70"
                                                    style={{
                                                        height: `${Math.max(
                                                            6,
                                                            Math.min(100, value)
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-3 flex items-center justify-between font-data text-[9px] uppercase tracking-[0.14em] text-dim">
                                        <span>Current load across online nodes</span>
                                        <span>{stats.online} online</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative overflow-hidden border border-line bg-ink-900 p-6 md:col-span-5">
                                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ok/10 blur-3xl" />
                                <div className="relative">
                                    <div className="flex items-center gap-2 font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                                        <Lock size={13} className="text-ok" />
                                        Transport
                                    </div>
                                    <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-white">
                                        TLS where it matters.
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-dim">
                                        Prefer WSS/HTTPS on public networks. The directory
                                        flags TLS nodes separately so you can filter them out.
                                    </p>

                                    <div className="mt-8 flex items-baseline gap-2">
                                        <span className="font-display text-4xl font-semibold text-white tabular-nums">
                                            {stats.secure}
                                        </span>
                                        <span className="font-data text-[11px] uppercase tracking-[0.14em] text-dim">
                                            / {stats.total} nodes
                                        </span>
                                    </div>
                                    <div className="mt-4 h-1.5 w-full overflow-hidden bg-ink-800">
                                        <div
                                            className="h-full bg-ok"
                                            style={{
                                                width: `${
                                                    stats.total
                                                        ? (stats.secure / stats.total) * 100
                                                        : 0
                                                }%`,
                                            }}
                                        />
                                    </div>

                                    <Link
                                        href="/ssl"
                                        className="mt-6 inline-flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.14em] text-ok transition-colors hover:text-white"
                                    >
                                        Browse TLS nodes
                                        <ArrowRight size={12} />
                                    </Link>
                                </div>
                            </div>

                            <div className="border border-line bg-ink-900 p-6 md:col-span-5">
                                <div className="flex items-center gap-2 font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                                    <Layers size={13} className="text-signal" />
                                    Protocol
                                </div>
                                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-white">
                                    v3 and v4, side by side.
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-dim">
                                    The REST version is part of every connection block, so
                                    older wrappers still work.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {(stats.versions.length ? stats.versions : ["v3", "v4"]).map(
                                        (version) => (
                                            <span
                                                key={version}
                                                className="border border-line bg-ink-950 px-3 py-1 font-data text-[10px] uppercase tracking-[0.14em] text-white"
                                            >
                                                {version}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="border border-line bg-ink-900 p-6 md:col-span-7">
                                <div className="flex items-center gap-2 font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                                    <Terminal size={13} className="text-signal" />
                                    Connection
                                </div>
                                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-white">
                                    One endpoint, one auth key.
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-dim">
                                    Open any node to copy a JSON block with the identifier,
                                    password, host, port, and secure flag.
                                </p>
                                <div className="mt-6 border border-line bg-ink-950 p-3 font-data text-[11px] leading-relaxed">
                                    <div className="text-dim">// live sample</div>
                                    <div className="mt-1 truncate text-white">
                                        {sampleNode
                                            ? `${
                                                  sampleNode.secure ? "wss" : "ws"
                                              }://${sampleNode.host}:${sampleNode.port}`
                                            : "wss://node.example.com:443"}
                                    </div>
                                </div>
                            </div>

                            <div className="border border-line bg-ink-900 p-6 md:col-span-12">
                                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="max-w-xl">
                                        <div className="flex items-center gap-2 font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                                            <Users size={13} className="text-signal" />
                                            Community
                                        </div>
                                        <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-white">
                                            Run by operators.
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-dim">
                                            Nodes are contributed by volunteers and sponsors
                                            across {stats.regions || "several"} regions.
                                        </p>
                                    </div>

                                    <div className="flex items-baseline gap-8">
                                        {[
                                            { label: "operators", value: stats.operators },
                                            { label: "regions", value: stats.regions },
                                            { label: "nodes", value: stats.total },
                                        ].map((item) => (
                                            <div key={item.label}>
                                                <div className="font-display text-3xl font-semibold text-white tabular-nums">
                                                    {item.value}
                                                </div>
                                                <div className="mt-1 font-data text-[9px] uppercase tracking-[0.14em] text-dim">
                                                    {item.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <IntegrationSection />
                <FaqSection />

                {/* CTA */}
                <section className="border-b border-line">
                    <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
                        <div className="relative overflow-hidden border border-line bg-ink-900 p-8 sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-12">
                            <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
                            <div className="relative max-w-xl">
                                <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                    Your node could be here.
                                </h2>
                                <p className="mt-3 text-pretty text-base leading-relaxed text-dim">
                                    List a public Lavalink node and help keep the grid useful
                                    for everyone. Submissions are reviewed before they go live.
                                </p>
                            </div>

                            <div className="relative mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0">
                                <Link
                                    href="/submit"
                                    className="inline-flex h-11 items-center justify-center gap-2 border border-signal bg-signal px-5 font-data text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-signal-soft"
                                >
                                    Add your node
                                    <ArrowRight size={14} />
                                </Link>
                                <a
                                    href="https://discord.vexanode.cloud"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex h-11 items-center justify-center gap-2 border border-line bg-ink-950 px-5 font-data text-[11px] uppercase tracking-[0.14em] text-white transition-colors hover:border-signal/50 hover:text-signal"
                                >
                                    Join Discord
                                    <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <NodeDetailsDialog
                node={selectedNode}
                open={Boolean(selectedNode)}
                onOpenChange={(open) => !open && setSelectedNode(null)}
            />
        </div>
    );
}
