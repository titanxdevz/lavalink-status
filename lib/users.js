import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function getUserSummary(id) {
    try {
        if (!ObjectId.isValid(id)) return null;

        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne(
            { _id: new ObjectId(id) },
            { projection: { name: 1, image: 1, bio: 1, links: 1, role: 1 } }
        );

        if (!user) return null;

        return {
            id,
            name: user.name || "Operator",
            image: user.image || null,
            bio: user.bio || "",
            links: user.links || {},
            role: user.role || "user",
        };
    } catch (error) {
        console.error("Failed to load user summary:", error?.message || error);
        return null;
    }
}
