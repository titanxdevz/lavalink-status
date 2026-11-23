"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

const SNIPPETS = [
    {
        id: "shoukaku",
        label: "Shoukaku",
        file: "index.js",
        code: `const nodes = [
  {
    name: 'vexanode',
    url: 'node.example.com:443',
    auth: 'youshallnotpass',
    secure: true,
  },
];

const shoukaku = new Shoukaku(
  new Connectors.DiscordJS(client),
  nodes
);`,
    },
    {
        id: "wavelink",
        label: "Wavelink",
        file: "bot.py",
        code: `node = wavelink.Node(
    uri="https://node.example.com:443",
    password="youshallnotpass",
)

await wavelink.Pool.connect(
    nodes=[node],
    client=bot,
)`,
    },
    {
        id: "jda",
        label: "JDA",
        file: "Bot.java",
        code: `lavalink.addNode(
    "vexanode",
    URI.create("wss://node.example.com:443"),
    "youshallnotpass"
);`,
    },
];

export function IntegrationSection() {
    const [activeId, setActiveId] = useState(SNIPPETS[0].id);
    const [copied, setCopied] = useState(false);

    const active = SNIPPETS.find((snippet) => snippet.id === activeId) || SNIPPETS[0];

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(active.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // Clipboard access can be blocked; the snippet stays selectable.
        }
    };

    return (
        <section className="border-b border-line bg-ink-950">
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:py-24 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-5">
                    <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Connect in one config block.
                    </h2>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-dim">
                        Every node exposes a standard Lavalink REST and WebSocket endpoint. Pick a
                        wrapper, copy the block, and replace the host.
                    </p>

                    <ul className="mt-8 space-y-3">
                        {[
                            "Drop-in for Shoukaku, Wavelink, and JDA.",
                            "TLS and non-TLS endpoints on the same directory.",
                            "Copy the exact connection block from any node.",
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-3">
                                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center border border-signal/40 bg-signal/10 text-signal">
                                    <Check size={10} />
                                </span>
                                <span className="text-sm leading-relaxed text-dim">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="lg:col-span-7">
                    <div className="border border-line bg-ink-900">
                        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5">
                            <div className="flex min-w-0 items-center gap-3">
                                <Terminal size={13} className="shrink-0 text-dim" />
                                <span className="truncate font-data text-[10px] uppercase tracking-[0.14em] text-dim">
                                    {active.file}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="inline-flex h-8 shrink-0 items-center gap-1.5 border border-line bg-ink-950 px-2.5 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-signal/50 hover:text-white"
                            >
                                {copied ? (
                                    <Check size={12} className="text-ok" />
                                ) : (
                                    <Copy size={12} />
                                )}
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>

                        <div
                            className="flex overflow-x-auto border-b border-line"
                            role="tablist"
                            aria-label="Lavalink wrapper"
                        >
                            {SNIPPETS.map((snippet) => {
                                const selected = snippet.id === activeId;
                                return (
                                    <button
                                        key={snippet.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={selected}
                                        aria-controls={`snippet-${snippet.id}`}
                                        id={`tab-${snippet.id}`}
                                        onClick={() => setActiveId(snippet.id)}
                                        className={`shrink-0 border-r border-line px-4 py-2.5 font-data text-[10px] uppercase tracking-[0.14em] transition-colors ${
                                            selected
                                                ? "bg-ink-950 text-white"
                                                : "text-dim hover:text-white"
                                        }`}
                                    >
                                        {snippet.label}
                                    </button>
                                );
                            })}
                        </div>

                        <pre
                            id={`snippet-${active.id}`}
                            role="tabpanel"
                            aria-labelledby={`tab-${active.id}`}
                            className="overflow-x-auto p-5 font-data text-xs leading-relaxed text-dim"
                        >
                            <code>{active.code}</code>
                        </pre>
                    </div>

                    <p className="mt-3 font-data text-[10px] uppercase tracking-[0.14em] text-dim">
                        Example host. Replace it with any live node from the directory.
                    </p>
                </div>
            </div>
        </section>
    );
}
