"use client";
import { useState } from "react";
import { 
    Server, Shield, Globe, MessageSquare, 
    Lock, Hash, User, ExternalLink, ArrowRight, Loader2, Tag, ChevronLeft
} from "lucide-react";
import { useNodes } from "@/contexts/NodesContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function SubmitPage() {
    const { submitNode } = useNodes();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        identifier: "",
        host: "",
        port: "2333",
        password: "youshallnotpass",
        secure: false,
        restVersion: "v4",
        authorId: "",
        website: "",
        discord: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await submitNode(formData);
            setSuccess(true);
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        } catch (err) {
            setError(err.message || "Failed to submit node");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}>
            <Navbar />
            
            <main style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
                <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--color-text-secondary)", textDecoration: "none", marginBottom: 32, fontSize: 13 }}>
                    <ChevronLeft size={16} /> Back to Directory
                </Link>

                <div style={{ marginBottom: 48 }}>
                    <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-.04em", marginBottom: 12 }}>Add your node.</h1>
                    <p style={{ fontSize: 16, color: "var(--color-text-secondary)", maxWidth: 500 }}>
                        Submit your public Lavalink node to help the community. 
                        Submissions go through a manual review process.
                    </p>
                </div>

                {success ? (
                    <div style={{ padding: 60, border: "1px solid var(--color-border-secondary)", background: "rgba(255,255,255,0.02)", textAlign: "center" }}>
                        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#16a34a22", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                            <CheckIcon size={40} />
                        </div>
                        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Submission Received!</h2>
                        <p style={{ color: "#888", marginBottom: 32 }}>Your node is now in the review queue. Redirecting you home...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
                            
                            <section>
                                <h3 style={SECTION_HEADER}>Node Credentials</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <label style={LABEL_STYLE}>Node Identifier</label>
                                        <div style={INPUT_WRAPPER_STYLE}>
                                            <Hash size={14} style={ICON_STYLE} />
                                            <input type="text" name="identifier" required placeholder="Lavalink-EU-1" value={formData.identifier} onChange={handleChange} style={INPUT_STYLE} />
                                        </div>
                                    </div>
                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <label style={LABEL_STYLE}>Host</label>
                                        <div style={INPUT_WRAPPER_STYLE}>
                                            <Server size={14} style={ICON_STYLE} />
                                            <input type="text" name="host" required placeholder="lavalink.server.com" value={formData.host} onChange={handleChange} style={INPUT_STYLE} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={LABEL_STYLE}>Port</label>
                                        <div style={INPUT_WRAPPER_STYLE}>
                                            <input type="number" name="port" required placeholder="2333" value={formData.port} onChange={handleChange} style={INPUT_STYLE} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={LABEL_STYLE}>Password</label>
                                        <div style={INPUT_WRAPPER_STYLE}>
                                            <Lock size={14} style={ICON_STYLE} />
                                            <input type="text" name="password" required placeholder="youshallnotpass" value={formData.password} onChange={handleChange} style={INPUT_STYLE} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 style={SECTION_HEADER}>Connectivity</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                    <div style={{ 
                                        display: "flex", alignItems: "center", gap: 12, 
                                        padding: "16px", border: "1px solid var(--color-border-secondary)",
                                        cursor: "pointer", background: formData.secure ? "rgba(59, 130, 246, 0.05)" : "none"
                                    }} onClick={() => setFormData(p => ({...p, secure: !p.secure}))}>
                                        <Shield size={18} style={{ color: formData.secure ? "#3b82f6" : "#666" }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700 }}>SSL / Secure</div>
                                            <div style={{ fontSize: 11, color: "#666" }}>Use HTTPS/WSS</div>
                                        </div>
                                        <input type="checkbox" name="secure" checked={formData.secure} readOnly style={{ cursor: "pointer" }} />
                                    </div>
                                    <div style={INPUT_WRAPPER_STYLE}>
                                        <Tag size={16} style={ICON_STYLE} />
                                        <select name="restVersion" value={formData.restVersion} onChange={handleChange} style={SELECT_STYLE}>
                                            <option value="v4">Lavalink v4</option>
                                            <option value="v3">Lavalink v3</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 style={SECTION_HEADER}>Owner Details</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <label style={LABEL_STYLE}>Your Name / Studio</label>
                                        <div style={INPUT_WRAPPER_STYLE}>
                                            <User size={14} style={ICON_STYLE} />
                                            <input type="text" name="authorId" required placeholder="Community Studio" value={formData.authorId} onChange={handleChange} style={INPUT_STYLE} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={LABEL_STYLE}>Website (Optional)</label>
                                        <div style={INPUT_WRAPPER_STYLE}>
                                            <Globe size={14} style={ICON_STYLE} />
                                            <input type="url" name="website" placeholder="https://..." value={formData.website} onChange={handleChange} style={INPUT_STYLE} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={LABEL_STYLE}>Discord (Optional)</label>
                                        <div style={INPUT_WRAPPER_STYLE}>
                                            <MessageSquare size={14} style={ICON_STYLE} />
                                            <input type="url" name="discord" placeholder="https://discord.gg/..." value={formData.discord} onChange={handleChange} style={INPUT_STYLE} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>

                        {error && (
                            <div style={{ padding: 16, background: "#ef444411", color: "#ef4444", fontSize: 13, border: "1px solid #ef444433" }}>
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" disabled={loading}
                            style={{
                                padding: "20px", background: "var(--color-text-primary)", color: "var(--color-background-primary)",
                                border: "none", borderRadius: "0px", fontSize: 15, fontWeight: 800,
                                cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1,
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                                transition: "transform .2s, opacity .2s"
                            }}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Submit to Directory <ArrowRight size={18} /></>}
                        </button>
                    </form>
                )}
            </main>

            <Footer />
        </div>
    );
}

function CheckIcon({ size }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

const SECTION_HEADER = {
    fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#555", marginBottom: 16
};

const LABEL_STYLE = {
    display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#888", marginBottom: 8
};

const INPUT_WRAPPER_STYLE = {
    display: "flex", alignItems: "center", gap: 12, padding: "0 16px", 
    border: "1px solid var(--color-border-secondary)", background: "rgba(255,255,255,0.01)", height: 50
};

const ICON_STYLE = { color: "#555", flexShrink: 0 };

const INPUT_STYLE = {
    flex: 1, height: "100%", background: "none", border: "none", color: "inherit", fontSize: 14, outline: "none"
};

const SELECT_STYLE = {
    flex: 1, height: "100%", background: "none", border: "none", color: "inherit", fontSize: 14, outline: "none", appearance: "none"
};
