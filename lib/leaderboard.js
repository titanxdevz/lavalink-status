import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function getLeaderboard(limit = 50) {
    try {
        const client = await clientPromise;
        const db = client.db();

        const rows = await db
            .collection("nodes")
            .aggregate([
                { $match: { status: "approved" } },
                { $group: { _id: "$ownerId", nodeCount: { $sum: 1 } } },
                { $sort: { nodeCount: -1, _id: 1 } },
                { $limit: limit },
            ])
            .toArray();

        const ids = rows.map((row) => row._id).filter(Boolean);
        const objectIds = ids
            .map((id) => {
                try {
                    return new ObjectId(id);
                } catch {
                    return null;
                }
            })
            .filter(Boolean);

        const users = objectIds.length
            ? await db
                  .collection("users")
                  .find({ _id: { $in: objectIds } })
                  .toArray()
            : [];

        const byId = new Map(users.map((user) => [user._id.toString(), user]));

        return rows.map((row) => {
            const user = byId.get(String(row._id));
            return {
                userId: String(row._id),
                name: user?.name || "Unknown operator",
                image: user?.image || null,
                nodeCount: row.nodeCount,
                role: user?.role || "user",
            };
        });
    } catch (error) {
        console.error("Failed to build leaderboard:", error?.message || error);
        return [];
    }
}
