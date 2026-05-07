import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const client = await clientPromise;
        const db = client.db();
        
        // Find user by ID (could be MongoDB ID or Discord ID if we store it)
        // NextAuth uses MongoDB _id by default.
        let query = {};
        if (ObjectId.isValid(id)) {
            query = { _id: new ObjectId(id) };
        } else {
            // Fallback: search by a custom discordId if you implement it, 
            // but NextAuth uses its own internal ID.
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const user = await db.collection("users").findOne(query, {
            projection: { email: 0, emailVerified: 0 } // Privacy: don't leak email
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Also fetch their nodes
        const nodes = await db.collection("nodes").find({ 
            ownerId: user._id.toString(),
            status: "approved"
        }).toArray();

        return NextResponse.json({ user, nodes });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
