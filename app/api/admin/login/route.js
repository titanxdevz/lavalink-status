import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request) {
    try {
        const body = await request.json();
        const { password } = body;

        const configPath = path.join(process.cwd(), "config.json");
        const configFile = await fs.readFile(configPath, "utf-8");
        const config = JSON.parse(configFile);

        if (password === config.adminPassword) {
            return NextResponse.json({ success: true, message: "Login successful!" });
        } else {
            return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
        }
    } catch (err) {
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
