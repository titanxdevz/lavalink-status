import Link from "next/link";
import { ExternalLink, ShieldCheck, Wifi } from "lucide-react";
import { SectionHeader, Section } from "./ui";

function endpoint(node) {
    const protocol = node.secure ? "wss" : "ws";
    if (!node.host) return "—";
    return `${protocol}://${node.host}${node.port ? `:${node.port}` : ""}`;
}

/**
 * Server-rendered registry index. This exists so search engines and AI crawlers
 * get real node names, regions, transports, and operators in the initial HTML
 * even before the interactive directory finishes its live probes.
 */
export function NodeIndexSection({
    nodes = [],
    title = "Full node registry",
    description = "A plain-text index of every approved node in the directory. The live cards above include current load, memory, and uptime.",
    secure = null,
    id = "node-index",
}) {
    const label = secure === true ? "SSL" : secure === false ? "Non-SSL" : "all";

    return (
        <Section id={id} tone="raised">
            <SectionHeader
                eyebrow="Crawlable index"
                title={title}
                description={description}
                actions={
                    <Link
                        href="/api/nodes"
                        className="inline-flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:text-signal"
                    >
                        JSON API
                        <ExternalLink size={12} />
                    </Link>
                }
            />

            {nodes.length === 0 ? (
                <p className="mt-8 border border-dashed border-line px-4 py-6 font-data text-[11px] uppercase tracking-[0.14em] text-dim">
                    No approved {label === "all" ? "" : `${label} `}nodes are indexed yet. Live
                    status may still be loading above.
                </p>
            ) : (
                <div className="mt-8 overflow-x-auto border border-line">
                    <table className="w-full min-w-[720px] border-collapse text-left">
                        <caption className="sr-only">
                            Approved {label === "all" ? "" : `${label} `}Lavalink nodes
                        </caption>
                        <thead>
                            <tr className="border-b border-line bg-ink-950">
                                {["Node", "Transport", "Region", "Endpoint", "Operator"].map((heading) => (
                                    <th
                                        key={heading}
                                        scope="col"
                                        className="px-4 py-3 font-data text-[9px] font-medium uppercase tracking-[0.16em] text-dim"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {nodes.map((node) => (
                                <tr
                                    key={node.id}
                                    className="border-b border-line/70 last:border-0 hover:bg-ink-950/60"
                                >
                                    <td className="px-4 py-3">
                                        <span className="font-display text-sm font-medium text-white">
                                            {node.identifier}
                                        </span>
                                        <span className="ml-2 font-data text-[9px] uppercase tracking-[0.14em] text-dim">
                                            {node.restVersion}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.12em] text-dim">
                                            {node.secure ? (
                                                <ShieldCheck size={12} className="text-ok" />
                                            ) : (
                                                <Wifi size={12} className="text-dim" />
                                            )}
                                            {node.secure ? "TLS" : "WS"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-data text-[10px] uppercase tracking-[0.12em] text-dim">
                                        {node.region || "Global"}
                                    </td>
                                    <td className="px-4 py-3 font-data text-[11px] text-dim">
                                        {endpoint(node)}
                                    </td>
                                    <td className="px-4 py-3 font-data text-[10px] uppercase tracking-[0.12em] text-dim">
                                        {node.ownerId ? (
                                            <Link
                                                href={`/profile/${node.ownerId}`}
                                                className="transition-colors hover:text-signal"
                                            >
                                                {node.author || "Community"}
                                            </Link>
                                        ) : (
                                            node.author || "Community"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Section>
    );
}
