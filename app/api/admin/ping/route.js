import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { host, port, password, secure, restVersion } = await request.json();
        const protocol = secure ? "https" : "http";
        const version = restVersion || 'v4';
        const baseUrl = `${protocol}://${host}:${port}/${version}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
            const fetchOptions = {
                method: 'GET',
                headers: { 'Authorization': password },
                signal: controller.signal
            };

            const [infoRes, statsRes] = await Promise.all([
                fetch(`${baseUrl}/info`, fetchOptions),
                fetch(`${baseUrl}/stats`, fetchOptions)
            ]);

            clearTimeout(timeoutId);

            const info = infoRes.ok ? await infoRes.json() : null;
            const stats = statsRes.ok ? await statsRes.json() : null;

            return NextResponse.json({ 
                ok: infoRes.ok && statsRes.ok, 
                status: infoRes.status,
                data: { info, stats }
            });
        } catch (err) {
            clearTimeout(timeoutId);
            return NextResponse.json({ ok: false, error: err.message }, { status: 504 });
        }
    } catch (err) {
        return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }
}
