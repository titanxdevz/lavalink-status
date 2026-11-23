import clientPromise from "@/lib/mongodb";

const PROJECTION = {
    identifier: 1,
    host: 1,
    port: 1,
    region: 1,
    secure: 1,
    restVersion: 1,
    authorId: 1,
    ownerId: 1,
    isPinned: 1,
};

/**
 * Reads approved nodes straight from MongoDB (no external probes) so the
 * directory can be server-rendered into crawlable HTML. Never exposes the
 * node password or any telemetry credentials.
 */
export async function getPublicNodeIndex({ secure } = {}) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const query = { status: "approved" };

        if (secure === true) query.secure = true;
        if (secure === false) query.secure = { $ne: true };

        const rows = await db
            .collection("nodes")
            .find(query, { projection: PROJECTION })
            .sort({ isPinned: -1, identifier: 1 })
            .limit(300)
            .toArray();

        return rows.map((node) => ({
            id: node._id.toString(),
            identifier: node.identifier || "Unnamed node",
            host: node.host || "",
            port: node.port || null,
            region: node.region || null,
            secure: Boolean(node.secure),
            restVersion: node.restVersion || "v4",
            author: node.authorId || null,
            ownerId: node.ownerId || null,
        }));
    } catch (error) {
        console.error("Failed to build public node index:", error?.message || error);
        return [];
    }
}

export function nodeIndexToSeoItems(nodes) {
    return nodes.map((node) => ({
        name: node.identifier,
        description: `Public ${node.secure ? "TLS" : "non-TLS"} Lavalink ${
            node.restVersion
        } node${node.region ? ` in ${node.region}` : ""}.`,
        url: node.ownerId ? `/profile/${node.ownerId}` : "/",
        provider: node.author || "Community",
    }));
}
