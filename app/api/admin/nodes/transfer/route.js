import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
    try {
        // Simple security check for Admin role or Password
        // For now, we'll check session role since we have NextAuth
        const session = await getServerSession(authOptions);
        
        // Basic role check (assuming user.role is set in DB for admins)
        // If not set, you can manually set it in MongoDB for your account.
        const isAdmin = session?.user?.role === 'admin';
        
        if (!isAdmin) {
            // Check for legacy ADMIN_PASSWORD in headers if session fails
            const adminPassword = request.headers.get("x-admin-password");
            if (adminPassword !== process.env.ADMIN_PASSWORD) {
                return NextResponse.json({ error: "Unauthorized access protocol denied." }, { status: 401 });
            }
        }

        const { nodeId, newOwnerId } = await request.json();
        const client = await clientPromise;
        const db = client.db();

        let targetUserId = newOwnerId;

        // 1. Try to see if it's a valid MongoDB ID first
        let isMongoId = false;
        try { 
            new ObjectId(newOwnerId); 
            isMongoId = true;
        } catch(e) {}

        if (!isMongoId) {
            // 2. Treat as Discord ID - find user via accounts collection
            const account = await db.collection("accounts").findOne({ 
                provider: "discord", 
                providerAccountId: newOwnerId 
            });
            if (account) {
                targetUserId = account.userId.toString();
            } else {
                return NextResponse.json({ error: "No operator found with that Discord ID." }, { status: 404 });
            }
        }

        // Update node owner
        const result = await db.collection("nodes").updateOne(
            { _id: new ObjectId(nodeId) },
            { $set: { ownerId: targetUserId } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Target node not found in grid." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Node ownership protocol transferred to operator " + targetUserId });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
