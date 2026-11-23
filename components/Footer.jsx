import Link from "next/link";
import { ArrowUpRight, MessageSquare } from "lucide-react";

const DIRECTORY_LINKS = [
    { href: "/", label: "Node directory" },
    { href: "/ssl", label: "SSL nodes" },
    { href: "/non-ssl", label: "Non-SSL nodes" },
    { href: "/leaderboard", label: "Leaderboard" },
];

const COMMUNITY_LINKS = [
    { href: "/submit", label: "Add a node" },
    { href: "https://discord.vexanode.cloud", label: "Discord", external: true },
];

const DATA_LINKS = [
    { href: "/api/nodes", label: "JSON API" },
    { href: "/sitemap.xml", label: "Sitemap" },
    { href: "/llms.txt", label: "llms.txt" },
    { href: "/robots.txt", label: "Robots" },
];

const LEGAL_LINKS = [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
];

export function Footer() {
    return (
        <footer className="border-t border-line bg-ink-950">
            <div className="mx-auto max-w-7xl px-6 py-14">
                <div className="grid gap-10 md:grid-cols-12">
                    <div className="md:col-span-4">
                        <Link href="/" className="flex items-center gap-3">
                            <span className="grid h-9 w-9 place-items-center border border-signal/40 bg-signal/10 font-data text-xs font-semibold tracking-[0.08em] text-signal">
                                LL
                            </span>
                            <span className="font-display text-base font-semibold tracking-tight text-white">
                                Lavalink <span className="text-dim">Grid</span>
                            </span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-dim">
                            A community-run directory of public Lavalink nodes for Discord
                            music bots. Live health, copyable endpoints, no account required
                            to connect.
                        </p>
                        <div className="mt-5 inline-flex items-center gap-2 font-data text-[10px] uppercase tracking-[0.14em] text-dim">
                            <span className="h-1.5 w-1.5 bg-ok motion-safe:animate-pulse-soft" />
                            Grid operational
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="font-data text-[10px] uppercase tracking-[0.18em] text-dim">
                            Directory
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {DIRECTORY_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/80 transition-colors hover:text-signal"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="font-data text-[10px] uppercase tracking-[0.18em] text-dim">
                            Community
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {COMMUNITY_LINKS.map((link) => (
                                <li key={link.href}>
                                    {link.external ? (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-white/80 transition-colors hover:text-signal"
                                        >
                                            <MessageSquare size={13} />
                                            {link.label}
                                            <ArrowUpRight size={11} />
                                        </a>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white/80 transition-colors hover:text-signal"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="font-data text-[10px] uppercase tracking-[0.18em] text-dim">
                            Data
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {DATA_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/80 transition-colors hover:text-signal"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="font-data text-[10px] uppercase tracking-[0.18em] text-dim">
                            Legal
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {LEGAL_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/80 transition-colors hover:text-signal"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-data text-[10px] uppercase tracking-[0.14em] text-dim">
                        © {new Date().getFullYear()} Lavalink Grid. Community operated.
                    </p>
                    <p className="font-data text-[10px] uppercase tracking-[0.14em] text-dim">
                        Built for Discord music bots.
                    </p>
                </div>
            </div>
        </footer>
    );
}
