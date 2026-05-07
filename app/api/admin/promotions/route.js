import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function checkAuth(request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role === 'admin') return true;
    
    const adminPassword = request.headers.get("x-admin-password");
    return adminPassword === process.env.ADMIN_PASSWORD;
}

export async function POST(request) {
    try {
        if (!await checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const data = await request.json();
        const client = await clientPromise;
        const db = client.db();
        
        const res = await db.collection("promotions").insertOne({
            ...data,
            isActive: true,
            createdAt: new Date()
        });
        
        return NextResponse.json({ success: true, id: res.insertedId });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        if (!await checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const { id, ...updateData } = await request.json();
        const client = await clientPromise;
        const db = client.db();
        
        await db.collection("promotions").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        if (!await checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const { id } = await request.json();
        const client = await clientPromise;
        const db = client.db();
        
        await db.collection("promotions").deleteOne({ _id: new ObjectId(id) });
        
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
