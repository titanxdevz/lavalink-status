import { ProfileClient } from "@/components/profile/ProfileClient";
import { JsonLd } from "@/components/site/JsonLd";
import { getUserSummary } from "@/lib/users";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const profile = await getUserSummary(id);

    if (!profile) {
        return {
            title: "Operator profile",
            description:
                "A public Lavalink operator profile with their approved nodes and live health.",
            alternates: { canonical: `/profile/${id}` },
            robots: { index: false, follow: true },
        };
    }

    const title = `${profile.name} — Lavalink operator`;
    const description =
        profile.bio?.slice(0, 155) ||
        `${profile.name} contributes public Lavalink nodes to the directory. See their approved nodes, transports, and live health.`;

    return {
        title,
        description,
        alternates: { canonical: `/profile/${id}` },
        openGraph: {
            title,
            description,
            url: `/profile/${id}`,
            type: "profile",
            ...(profile.image ? { images: [{ url: profile.image, alt: profile.name }] } : {}),
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
    };
}

export default async function ProfilePage({ params }) {
    const { id } = await params;
    const profile = await getUserSummary(id);

    return (
        <>
            <JsonLd
                data={[
                    personJsonLd({
                        id,
                        name: profile?.name || "Operator",
                        description:
                            profile?.bio ||
                            "Public Lavalink operator in the community directory.",
                        image: profile?.image,
                        url: `/profile/${id}`,
                    }),
                    breadcrumbJsonLd([
                        { label: "Home", href: "/" },
                        { label: "Operators", href: "/leaderboard" },
                        { label: profile?.name || "Profile", href: `/profile/${id}` },
                    ]),
                ]}
            />
            <ProfileClient userId={id} initialProfile={profile} />
        </>
    );
}
