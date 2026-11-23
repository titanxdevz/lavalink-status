import { PUBLIC_PATHS, SITE } from "@/lib/site";
import { getLeaderboard } from "@/lib/leaderboard";

export const dynamic = "force-dynamic";

export default async function sitemap() {
    const now = new Date();
    const leaders = await getLeaderboard(100);

    const pages = PUBLIC_PATHS.map((entry) => ({
        url: `${SITE.url}${entry.path === "/" ? "" : entry.path}`,
        lastModified: now,
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
    }));

    const profiles = leaders.map((leader) => ({
        url: `${SITE.url}/profile/${leader.userId}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.5,
    }));

    return [...pages, ...profiles];
}
