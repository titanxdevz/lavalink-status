"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNodes } from "@/contexts/NodesContext";
import { 
    Check, X, Trash2, Shield, Server, 
    Globe, MessageSquare, Loader2, AlertCircle, RefreshCw
} from "lucide-react";

export default function AdminPage() {
    const { updateNodeStatus, deleteNode } = useNodes();
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);

    const fetchAllNodes = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/nodes?all=true");
            if (!res.ok) throw new Error("Failed to fetch nodes");
            const data = await res.json();
            setNodes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });

            if (res.ok) {
                setAuthenticated(true);
                fetchAllNodes();
            } else {
                alert("Invalid password");
            }
        } catch (err) {
            alert("Login failed: " + err.message);
        }
    };

    const handleApprove = async (node) => {
        if (!confirm(`Approve node ${node.identifier}?`)) return;
        try {
            await updateNodeStatus(node.host, node.port, "approved");
            fetchAllNodes();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (node) => {
        if (!confirm(`Delete node ${node.identifier}?`)) return;
        try {
            await deleteNode(node.host, node.port);
            fetchAllNodes();
        } catch (err) {
            alert(err.message);
        }
    };

    if (!authenticated) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-background-primary)" }}>
                <form onSubmit={handleLogin} style={{ padding: 40, border: "1px solid var(--color-border-secondary)", display: "flex", flexDirection: "column", gap: 20 }}>
                    <h1 style={{ fontSize: 20, fontWeight: 800 }}>Admin Login</h1>
                    <input 
                        type="password" placeholder="Enter Admin Password" 
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: "10px 15px", background: "none", border: "1px solid var(--color-border-secondary)", color: "inherit" }}
                    />
                    <button type="submit" style={{ padding: "10px", background: "var(--color-text-primary)", color: "var(--color-background-primary)", border: "none", fontWeight: 700 }}>
                        Login
                    </button>
                </form>
            </div>
        );
    }

    const pending = nodes.filter(n => n.status === "pending");
    const approved = nodes.filter(n => n.status === "approved");

    return (
        <div style={{ minHeight: "100vh", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}>
            <Navbar />
            
            <main style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
                    <div>
                        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-.03em" }}>Admin Panel</h1>
                        <p style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>Manage node submissions and directory status.</p>
                    </div>
                    <button onClick={fetchAllNodes} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px solid var(--color-border-secondary)", color: "inherit", padding: "8px 16px", cursor: "pointer" }}>
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div style={{ padding: "100px 0", textAlign: "center" }}><Loader2 className="animate-spin mx-auto" /></div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 60 }}>
                        
                        {/* Pending Submissions */}
                        <section>
                            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#eab308", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                                <AlertCircle size={15} /> Pending Submissions ({pending.length})
                            </h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {pending.length === 0 ? (
                                    <div style={{ padding: 40, border: "1px dashed var(--color-border-tertiary)", textAlign: "center", color: "#666" }}>No pending requests</div>
                                ) : (
                                    pending.map(node => (
                                        <AdminNodeCard key={node.host + node.port} node={node} onApprove={() => handleApprove(node)} onDelete={() => handleDelete(node)} />
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Approved Nodes */}
                        <section>
                            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#16a34a", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                                <Check size={15} /> Approved Nodes ({approved.length})
                            </h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {approved.map(node => (
                                    <AdminNodeCard key={node.host + node.port} node={node} onDelete={() => handleDelete(node)} approved />
                                ))}
                            </div>
                        </section>

                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

function AdminNodeCard({ node, onApprove, onDelete, approved }) {
    return (
        <div style={{ 
            padding: "16px 20px", border: "1px solid var(--color-border-secondary)", 
            background: "rgba(255,255,255,0.02)",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1, minWidth: 300 }}>
                <div style={{ width: 40, height: 40, background: "var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Server size={18} style={{ opacity: 0.5 }} />
                </div>
                <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{node.identifier}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>
                        {node.host}:{node.port}
                    </div>
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#666" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Shield size={10} /> {node.secure ? "SSL" : "No SSL"}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Globe size={10} /> {node.restVersion}</span>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase" }}>Author</div>
                    <div style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{node.authorId}</div>
                </div>
                
                <div style={{ display: "flex", gap: 8 }}>
                    {!approved && (
                        <button 
                            onClick={onApprove}
                            style={{ 
                                padding: "8px 16px", background: "#16a34a", color: "white", 
                                border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer",
                                display: "flex", alignItems: "center", gap: 6
                            }}
                        >
                            <Check size={14} /> Approve
                        </button>
                    )}
                    <button 
                        onClick={onDelete}
                        style={{ 
                            padding: "8px 16px", background: "#ef444415", color: "#ef4444", 
                            border: "1px solid #ef444433", fontSize: 12, fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 6
                        }}
                    >
                        <Trash2 size={14} /> Remove
                    </button>
                </div>
            </div>
        </div>
    );
}
