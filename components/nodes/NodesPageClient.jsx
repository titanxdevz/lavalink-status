"use client";

import { useState } from "react";
import { Check, RefreshCw, Server, Shield, ShieldCheck, Wifi, Zap, Globe2, KeyRound } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NodeDetailsDialog } from "@/components/NodeDetailsDialog";
import { NodeDirectory } from "@/components/landing/NodeDirectory";
import { NodeIndexSection } from "@/components/site/NodeIndexSection";
import {
    ActionLink,
    Breadcrumbs,
    PageHeader,
    Section,
    SectionHeader,
} from "@/components/site/ui";
import { useLandingNodes } from "@/hooks/useLandingNodes";

const ICONS = { shield: Shield, server: Server };

const SECURE_POINTS = [
    {
        icon: ShieldCheck,
        title: "Encrypted by default",
        body: "TLS protects the REST auth key and the WebSocket control channel between your bot and the node.",
    },
    {
        icon: Globe2,
        title: "Port 443 friendly",
        body: "WSS over 443 passes strict corporate firewalls and most ISP filtering that blocks arbitrary ports.",
    },
    {
        icon: KeyRound,
        title: "CA-verified endpoints",
        body: "Secure nodes terminate TLS with a publicly trusted certificate, so modern runtimes validate them out of the box.",
    },
];

const PLAIN_POINTS = [
    {
        icon: Zap,
        title: "Lowest handshake overhead",
        body: "Plain WS skips the TLS negotiation, which is useful for local testing and trusted private networks.",
    },
    {
        icon: Wifi,
        title: "Simple migration path",
        body: "Most wrappers switch between ws:// and wss:// with a single flag, so you can move to TLS later without rewriting.",
    },
    {
        icon: Globe2,
        title: "Useful behind a proxy",
        body: "Non-TLS nodes are common when a reverse proxy already terminates encryption in front of Lavalink.",
    },
];

function TransportGuide({ secure }) {
    const points = secure ? SECURE_POINTS : PLAIN_POINTS;

    return (
        <Section tone="raised">
            <SectionHeader
                eyebrow={secure ? "TLS notes" : "Plain WS notes"}
                title={secure ? "Why bots use TLS nodes." : "When plain WS is enough."}
                description={
                    secure
                        ? "Secure Lavalink nodes encrypt control traffic and are the safe default for public bots."
                        : "Non-TLS nodes trade a little privacy for lower overhead. Use them only where the network is trusted."
                }
            />

            <div className="mt-10 grid gap-4 md:grid-cols-3">
                {points.map((point) => (
                    <div key={point.title} className="border border-line bg-ink-950 p-6">
                        <span className="grid h-9 w-9 place-items-center border border-signal/30 bg-signal/10 text-signal">
                            <point.icon size={16} />
                        </span>
                        <h3 className="mt-4 font-display text-lg font-semibold text-white">
                            {point.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-dim">{point.body}</p>
                    </div>
                ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-12">
                <div className="border border-line bg-ink-950 p-6 lg:col-span-7">
                    <p className="font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                        Minimal Shoukaku config
                    </p>
                    <pre className="mt-4 overflow-x-auto font-data text-xs leading-relaxed text-dim">
                        <code>{`const nodes = [{
  name: 'my-node',
  url: 'node.example.com:${secure ? "443" : "2333"}',
  auth: 'youshallnotpass',
  secure: ${secure ? "true" : "false"},
}];`}</code>
                    </pre>
                </div>
                <div className="border border-line bg-ink-950 p-6 lg:col-span-5">
                    <p className="font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                        Checklist
                    </p>
                    <ul className="mt-4 space-y-3">
                        {[
                            "Copy the endpoint from the node card.",
                            "Keep the auth key out of public repos.",
                            secure ? "Use wss:// or secure: true." : "Use ws:// or secure: false.",
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-2.5">
                                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center border border-ok/40 bg-ok/10 text-ok">
                                    <Check size={10} />
                                </span>
                                <span className="text-sm leading-relaxed text-dim">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Section>
    );
}

export function NodesPageClient({
    secure,
    eyebrow,
    title,
    description,
    icon,
    nodeIndex = [],
    indexTitle,
    indexDescription,
}) {
    const data = useLandingNodes({ secure });
    const [selectedNode, setSelectedNode] = useState(null);
    const { stats, loading, refresh } = data;

    return (
        <div className="min-h-screen bg-ink-950 font-display text-white selection:bg-signal selection:text-ink-950">
            <Navbar />

            <main>
                <PageHeader
                    breadcrumbs={
                        <Breadcrumbs
                            items={[
                                { label: "Home", href: "/" },
                                { label: secure ? "SSL nodes" : "Non-SSL nodes" },
                            ]}
                        />
                    }
                    eyebrow={eyebrow}
                    title={title}
                    description={description}
                    icon={icon}
                    meta={[
                        { label: "Nodes", value: stats.total },
                        { label: "Online", value: stats.online },
                        { label: "Players", value: stats.players },
                        { label: "Regions", value: stats.regions },
                    ]}
                    actions={
                        <>
                            <button
                                type="button"
                                onClick={refresh}
                                disabled={loading}
                                className="inline-flex h-11 items-center justify-center gap-2 border border-signal bg-signal px-5 font-data text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-signal-soft disabled:opacity-60"
                            >
                                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                                Refresh status
                            </button>
                            <ActionLink href="/submit" variant="secondary">
                                Add your node
                            </ActionLink>
                        </>
                    }
                />

                <NodeDirectory
                    data={data}
                    onSelect={setSelectedNode}
                    eyebrow="Live directory"
                    heading={
                        secure ? "Verified TLS nodes." : "Plain WebSocket nodes."
                    }
                    description={
                        secure
                            ? "Every endpoint below advertises a secure WSS/HTTPS transport. Open a node for live telemetry and a copy-ready connection block."
                            : "Every endpoint below uses plain WS/HTTP. Open a node for live telemetry and a copy-ready connection block."
                    }
                    showTransport={false}
                    sectionId="nodes"
                />

                <NodeIndexSection
                    nodes={nodeIndex}
                    secure={secure}
                    title={indexTitle}
                    description={indexDescription}
                />

                <TransportGuide secure={secure} />

                <Section>
                    <div className="flex flex-col gap-6 border border-line bg-ink-900 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                        <div className="max-w-xl">
                            <p className="font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                                Not sure which transport to pick?
                            </p>
                            <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                                Compare both directories.
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-dim">
                                The main directory mixes TLS and plain nodes, with a filter for
                                each. Start there if you want the widest choice.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <ActionLink href="/">Browse all nodes</ActionLink>
                            <ActionLink
                                href={secure ? "/non-ssl" : "/ssl"}
                                variant="secondary"
                            >
                                {secure ? "View non-SSL nodes" : "View SSL nodes"}
                            </ActionLink>
                        </div>
                    </div>
                </Section>
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
