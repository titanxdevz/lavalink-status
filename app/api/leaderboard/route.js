import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();

        // Aggregate nodes by ownerId
        const leaderboard = await db.collection("nodes").aggregate([
            { $match: { status: "approved" } },
            { $group: { 
                _id: "$ownerId", 
                nodeCount: { $sum: 1 } 
            } },
            { $sort: { nodeCount: -1 } },
            { $limit: 20 }
        ]).toArray();

        // Fetch user details for these owners
        const userIds = leaderboard.map(item => item._id).filter(id => id);
        // NextAuth stores IDs as strings or ObjectIds depending on the adapter version
        // Usually string for MongoDBAdapter if it's the newer one, or ObjectId.
        // We'll try both or just find by string since ownerId is stored as string in nodes.
        
        const users = await db.collection("users").find({
            $or: [
                { _id: { $in: userIds.map(id => {
                    try { return new (require('mongodb').ObjectId)(id); } catch(e) { return id; }
                }) } },
                { _id: { $in: userIds } }
            ]
        }).toArray();

        const formattedLeaderboard = leaderboard.map(item => {
            const user = users.find(u => u._id.toString() === item._id);
            return {
                userId: item._id,
                name: user?.name || "Unknown Operator",
                image: user?.image || null,
                nodeCount: item.nodeCount,
                role: user?.role || "user"
            };
        });

        return NextResponse.json(formattedLeaderboard);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
