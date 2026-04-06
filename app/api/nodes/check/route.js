import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { host, port, password, secure, restVersion } = body;

        if (!host || !port || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const protocol = secure ? "https" : "http";
        const baseUrl = `${protocol}://${host}:${port}`;
        const version = restVersion || 'v4';
        const statsUrl = `${baseUrl}/${version}/stats`;
        const infoUrl = `${baseUrl}/${version}/info`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const fetchOptions = {
                headers: { Authorization: password },
                signal: controller.signal
            };

            const [statsRes, infoRes] = await Promise.all([
                fetch(statsUrl, fetchOptions),
                fetch(infoUrl, fetchOptions)
            ]).finally(() => clearTimeout(timeoutId));

            if (!statsRes.ok) {
                const errorText = await statsRes.text();
                return NextResponse.json({ 
                    connected: false, 
                    error: `Stats failed: ${statsRes.status}`,
                    details: errorText.substring(0, 100)
                });
            }

            const stats = await statsRes.json();
            const info = infoRes.ok ? await infoRes.json() : null;

            return NextResponse.json({
                connected: true,
                stats,
                info
            });

        } catch (error) {
            clearTimeout(timeoutId);
            return NextResponse.json({ 
                connected: false, 
                error: error.name === 'AbortError' ? "Connection timed out" : error.message 
            });
        }
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
