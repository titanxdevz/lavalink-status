import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "#07090c",
                    color: "#ffffff",
                    padding: "72px",
                    position: "relative",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: -180,
                        left: -140,
                        width: 520,
                        height: 520,
                        borderRadius: 9999,
                        background: "rgba(110,168,254,0.18)",
                        filter: "blur(120px)",
                    }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(110,168,254,0.4)",
                            background: "rgba(110,168,254,0.1)",
                            color: "#6ea8fe",
                            fontSize: 20,
                            fontWeight: 700,
                            letterSpacing: 2,
                        }}
                    >
                        LL
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.5 }}>
                            Lavalink Grid
                        </div>
                        <div style={{ fontSize: 14, color: "#8b95a3", letterSpacing: 3 }}>
                            COMMUNITY DIRECTORY
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
                    <div
                        style={{
                            fontSize: 16,
                            letterSpacing: 4,
                            color: "#6ea8fe",
                            textTransform: "uppercase",
                        }}
                    >
                        Free public nodes
                    </div>
                    <div
                        style={{
                            marginTop: 22,
                            display: "flex",
                            flexDirection: "column",
                            fontSize: 76,
                            lineHeight: 1.02,
                            fontWeight: 700,
                            letterSpacing: -3,
                            maxWidth: 940,
                        }}
                    >
                        <div>Free Lavalink nodes,</div>
                        <div>verified live.</div>
                    </div>
                    <div
                        style={{
                            marginTop: 24,
                            fontSize: 26,
                            lineHeight: 1.4,
                            color: "#8b95a3",
                            maxWidth: 820,
                        }}
                    >
                        Real health checks, TLS and plain WS endpoints, and copy-ready
                        connection blocks for Discord music bots.
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTop: "1px solid #1e2630",
                        paddingTop: 26,
                        position: "relative",
                    }}
                >
                    <div style={{ display: "flex", gap: 12 }}>
                        {["TLS / WSS", "Lavalink v3 + v4", "Live telemetry"].map((label) => (
                            <div
                                key={label}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid #1e2630",
                                    background: "#0b0e12",
                                    padding: "10px 18px",
                                    fontSize: 18,
                                    color: "#c7ced8",
                                }}
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                    <div style={{ fontSize: 20, color: "#8b95a3" }}>
                        lavalink.vexanode.cloud
                    </div>
                </div>
            </div>
        ),
        size
    );
}
