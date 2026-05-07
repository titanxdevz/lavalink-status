import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();
        
        const promotions = await db.collection("promotions").find({ isActive: true }).toArray();
        
        return NextResponse.json(promotions);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
