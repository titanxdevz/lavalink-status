import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        const adminPassword = request.headers.get("x-admin-password");
        const isAdmin = (session?.user?.role === 'admin') || (adminPassword === process.env.ADMIN_PASSWORD);
        
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized access protocol denied." }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();
        
        // Fetch all users
        const users = await db.collection("users").find({}).toArray();
        
        // Fetch all nodes to count per user
        const nodes = await db.collection("nodes").find({}).toArray();
        
        // Fetch all accounts to link Discord IDs
        const accounts = await db.collection("accounts").find({ provider: "discord" }).toArray();

        const usersWithStats = users.map(user => {
            const userNodes = nodes.filter(n => n.ownerId === user._id.toString() || n.ownerId === accounts.find(a => a.userId.toString() === user._id.toString())?.providerAccountId);
            const discordAccount = accounts.find(a => a.userId.toString() === user._id.toString());
            
            return {
                ...user,
                nodeCount: userNodes.length,
                discordId: discordAccount?.providerAccountId || null,
                _id: user._id.toString()
            };
        });

        return NextResponse.json(usersWithStats);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const session = await getServerSession(authOptions);
        const adminPassword = request.headers.get("x-admin-password");
        const isAdmin = (session?.user?.role === 'admin') || (adminPassword === process.env.ADMIN_PASSWORD);
        
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId, isBanned } = await request.json();
        const client = await clientPromise;
        const db = client.db();

        await db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $set: { isBanned: !!isBanned } }
        );

        return NextResponse.json({ success: true, message: isBanned ? "USER_BANNED" : "USER_UNBANNED" });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
