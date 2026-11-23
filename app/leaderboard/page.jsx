import Link from "next/link";
import { Award, Crown, Medal, Server, Trophy, User, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/site/JsonLd";
import {
    ActionLink,
    Badge,
    Breadcrumbs,
    EmptyState,
    PageHeader,
    Section,
    SectionHeader,
} from "@/components/site/ui";
import { getLeaderboard } from "@/lib/leaderboard";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, itemListJsonLd, webPageJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

const title = "Lavalink operator leaderboard";
const description =
    "The operators contributing the most public Lavalink nodes to the grid, ranked by approved node count.";

export const metadata = {
    title,
    description,
    alternates: { canonical: "/leaderboard" },
    openGraph: { title, description, url: "/leaderboard", type: "website" },
    twitter: { card: "summary_large_image", title, description },
};

function Avatar({ user, size = "md" }) {
    const dimensions = size === "lg" ? "h-20 w-20" : "h-11 w-11";

    return (
        <span
            className={`grid ${dimensions} shrink-0 place-items-center overflow-hidden border border-line bg-ink-950 text-dim`}
        >
            {user.image ? (
                <img
                    src={user.image}
                    alt=""
                    width={size === "lg" ? 80 : 44}
                    height={size === "lg" ? 80 : 44}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            ) : (
                <User size={size === "lg" ? 28 : 18} />
            )}
        </span>
    );
}

function PodiumCard({ user, rank }) {
    const accents = {
        1: { border: "border-warn/60", text: "text-warn", icon: Crown, label: "Rank 01" },
        2: { border: "border-line", text: "text-dim", icon: Medal, label: "Rank 02" },
        3: { border: "border-line", text: "text-dim", icon: Medal, label: "Rank 03" },
    };
    const accent = accents[rank];
    const Icon = accent.icon;

    return (
        <Link
            href={`/profile/${user.userId}`}
            className={`group relative flex flex-col items-center border ${accent.border} bg-ink-900 p-6 text-center transition-colors hover:border-signal/60 ${
                rank === 1 ? "sm:-mt-4" : ""
            }`}
        >
            <div className="flex items-center gap-2 font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                <Icon size={13} className={accent.text} />
                {accent.label}
            </div>

            <div className="mt-5">
                <Avatar user={user} size="lg" />
            </div>

            <h2 className="mt-4 max-w-[220px] truncate font-display text-lg font-semibold text-white transition-colors group-hover:text-signal">
                {user.name}
            </h2>

            <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-white tabular-nums">
                    {user.nodeCount}
                </span>
                <span className="font-data text-[9px] uppercase tracking-[0.14em] text-dim">
                    nodes
                </span>
            </div>

            <div className="mt-5 w-full border-t border-line pt-4">
                <Badge tone={user.role === "admin" ? "warn" : "dim"}>
                    {user.role === "admin" ? "Admin" : "Operator"}
                </Badge>
            </div>
        </Link>
    );
}

export default async function LeaderboardPage() {
    const leaders = await getLeaderboard();
    const podium = leaders.slice(0, 3);
    const rest = leaders.slice(3);
    const totalNodes = leaders.reduce((sum, user) => sum + user.nodeCount, 0);

    return (
        <div className="min-h-screen bg-ink-950 font-display text-white selection:bg-signal selection:text-ink-950">
            <Navbar />

            <main>
                <PageHeader
                    breadcrumbs={
                        <Breadcrumbs
                            items={[{ label: "Home", href: "/" }, { label: "Leaderboard" }]}
                        />
                    }
                    eyebrow="Contribution index"
                    title="Top Lavalink operators"
                    description="Operators ranked by the number of approved public nodes they contribute to the grid. Every node is probed before it counts."
                    icon={Trophy}
                    meta={[
                        { label: "Operators", value: leaders.length },
                        { label: "Listed nodes", value: totalNodes },
                        { label: "Ranking", value: "Nodes" },
                        { label: "Updated", value: "Live" },
                    ]}
                />

                <Section>
                    {leaders.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title="No ranked operators yet."
                            description="Once approved nodes are listed, their owners appear here automatically."
                            action={<ActionLink href="/submit">Submit the first node</ActionLink>}
                        />
                    ) : (
                        <>
                            <SectionHeader
                                eyebrow="Podium"
                                title="The top three."
                                description="A quick look at the operators carrying the largest share of the public grid."
                            />

                            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                {[podium[1], podium[0], podium[2]].map((user, index) =>
                                    user ? (
                                        <PodiumCard
                                            key={user.userId}
                                            user={user}
                                            rank={index === 0 ? 2 : index === 1 ? 1 : 3}
                                        />
                                    ) : null
                                )}
                            </div>
                        </>
                    )}
                </Section>

                {rest.length > 0 && (
                    <Section tone="raised">
                        <SectionHeader
                            eyebrow="Full ranking"
                            title="Every contributing operator."
                            description="Ranks four and below, ordered by approved node count."
                            actions={
                                <Badge tone="signal">
                                    <Award size={11} />
                                    {rest.length} more
                                </Badge>
                            }
                        />

                        <div className="mt-8 overflow-x-auto border border-line">
                            <table className="w-full min-w-[620px] border-collapse text-left">
                                <caption className="sr-only">
                                    Lavalink operators ranked by approved node count
                                </caption>
                                <thead>
                                    <tr className="border-b border-line bg-ink-950">
                                        <th
                                            scope="col"
                                            className="px-4 py-3 font-data text-[9px] font-medium uppercase tracking-[0.16em] text-dim"
                                        >
                                            Rank
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 font-data text-[9px] font-medium uppercase tracking-[0.16em] text-dim"
                                        >
                                            Operator
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-right font-data text-[9px] font-medium uppercase tracking-[0.16em] text-dim"
                                        >
                                            Approved nodes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rest.map((user, index) => (
                                        <tr
                                            key={user.userId}
                                            className="border-b border-line/70 last:border-0 hover:bg-ink-950/60"
                                        >
                                            <td className="px-4 py-3 font-data text-sm text-dim tabular-nums">
                                                {String(index + 4).padStart(2, "0")}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/profile/${user.userId}`}
                                                    className="flex items-center gap-3"
                                                >
                                                    <Avatar user={user} />
                                                    <span className="min-w-0">
                                                        <span className="block truncate font-display text-sm font-medium text-white">
                                                            {user.name}
                                                        </span>
                                                        <span className="mt-0.5 block font-data text-[9px] uppercase tracking-[0.14em] text-dim">
                                                            {user.role === "admin"
                                                                ? "Administrator"
                                                                : "Community operator"}
                                                        </span>
                                                    </span>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="inline-flex items-center gap-2 border border-line bg-ink-950 px-2.5 py-1 font-data text-[11px] text-white tabular-nums">
                                                    <Server size={12} className="text-signal" />
                                                    {user.nodeCount}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Section>
                )}

                <Section>
                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            {
                                title: "How ranking works",
                                body: "Only approved nodes count. Pending and rejected submissions are excluded from the index.",
                            },
                            {
                                title: "Ties",
                                body: "Operators with the same node count are ordered by operator id so the table stays stable between refreshes.",
                            },
                            {
                                title: "Contribute",
                                body: "Add another public node, or help by reporting broken endpoints so the grid stays accurate.",
                            },
                        ].map((item) => (
                            <div key={item.title} className="border border-line bg-ink-900 p-6">
                                <h3 className="font-display text-lg font-semibold text-white">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-dim">{item.body}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            </main>

            <Footer />

            <JsonLd
                data={[
                    webPageJsonLd({
                        title,
                        description,
                        path: "/leaderboard",
                        type: "CollectionPage",
                    }),
                    breadcrumbJsonLd([
                        { label: "Home", href: "/" },
                        { label: "Leaderboard", href: "/leaderboard" },
                    ]),
                    itemListJsonLd({
                        name: `Lavalink operator leaderboard — ${SITE.name}`,
                        description,
                        itemType: "Person",
                        items: leaders.map((user) => ({
                            name: user.name,
                            description: `${user.nodeCount} approved public Lavalink node${
                                user.nodeCount === 1 ? "" : "s"
                            }.`,
                            url: `/profile/${user.userId}`,
                        })),
                    }),
                ]}
            />
        </div>
    );
}
