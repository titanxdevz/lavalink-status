import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function PATCH(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { bio, links } = await request.json();
        const client = await clientPromise;
        const db = client.db();

        const updateData = {};
        if (bio !== undefined) updateData.bio = bio;
        if (links !== undefined) updateData.links = links;

        await db.collection("users").updateOne(
            { _id: new ObjectId(session.user.id) },
            { $set: updateData }
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
