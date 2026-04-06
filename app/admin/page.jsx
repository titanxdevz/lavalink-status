"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNodes } from "@/contexts/NodesContext";
import { 
    Check, X, Trash2, Shield, Server, 
    Globe, MessageSquare, Loader2, AlertCircle, RefreshCw,
    Activity, Play, Search, Filter, Hammer, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
    const { updateNodeStatus, deleteNode } = useNodes();
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [search, setSearch] = useState("");

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

    const checkNodeConnectivity = async (node) => {
        try {
            const res = await fetch("/api/nodes/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    host: node.host,
                    port: node.port,
                    password: node.password,
                    secure: node.secure,
                    restVersion: node.restVersion
                })
            });
            return await res.json();
        } catch (err) {
            return { connected: false, error: err.message };
        }
    };

    const handleCheckAll = async () => {
        setChecking(true);
        const results = [];
        for (const node of nodes) {
            const status = await checkNodeConnectivity(node);
            results.push({ ...node, checkResult: status });
            // Update local state incrementally to show progress if needed, but for now just wait
        }
        setNodes(results);
        setChecking(false);
    };

    if (!authenticated) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
                
                <div className="glass-card max-w-sm w-full p-8 rounded-3xl relative z-10 border-white/10">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                            <Hammer className="text-white/60" size={32} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">Admin Gate</h1>
                        <p className="text-white/40 text-sm">Protected management area</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Access Password</label>
                            <input 
                                type="password" placeholder="••••••••" 
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm outline-none focus:border-white/20 transition-all"
                            />
                        </div>
                        <Button type="submit" className="w-full h-12 bg-white text-black font-black hover:bg-white/90 rounded-xl">
                            Verify Identity
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    const filteredNodes = nodes.filter(n => 
        n.identifier?.toLowerCase().includes(search.toLowerCase()) ||
        n.host?.toLowerCase().includes(search.toLowerCase())
    );

    const pending = filteredNodes.filter(n => n.status === "pending");
    const approved = filteredNodes.filter(n => n.status === "approved");

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans relative">
             <Navbar />
            
             <main className="container mx-auto px-6 py-12 max-w-6xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">
                            Director Panel
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter leading-none">Management Center</h1>
                        <p className="text-white/40 mt-3 max-w-md">Overview of all submitted nodes and health status of the directory network.</p>
                    </div>

                    <div className="flex items-center gap-3">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                            <input 
                                type="text" placeholder="Filter nodes..." 
                                value={search} onChange={(e) => setSearch(e.target.value)}
                                className="h-10 bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 text-xs outline-none focus:border-white/20 transition-all w-48 md:w-64"
                            />
                        </div>
                        <Button 
                            variant="secondary" onClick={handleCheckAll} disabled={checking}
                            className="h-10 gap-2 font-bold bg-white/5 hover:bg-white/10 border border-white/10"
                        >
                            {checking ? <Loader2 size={14} className="animate-spin" /> : <Activity size={14} />}
                            {checking ? "Testing..." : "Global Health Check"}
                        </Button>
                        <Button 
                            variant="secondary" onClick={fetchAllNodes} disabled={loading}
                            className="h-10 gap-2 font-bold bg-white text-black hover:bg-white/90 border-none"
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                        <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Loading node data...</p>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Total Nodes", value: nodes.length, icon: Server, color: "blue" },
                                { label: "Pending Review", value: nodes.filter(n => n.status === 'pending').length, icon: AlertCircle, color: "yellow" },
                                { label: "Live Nodes", value: nodes.filter(n => n.isConnected).length, icon: Activity, color: "green" },
                                { label: "Avg Load", value: "12%", icon: Info, color: "purple" }
                            ].map((s, i) => (
                                <div key={i} className="glass-card p-5 rounded-2xl border-white/5 relative overflow-hidden group">
                                    <div className={`absolute top-0 left-0 w-1 h-full bg-${s.color}-500/40`} />
                                    <s.icon size={14} className="text-white/20 mb-3" />
                                    <div className="text-2xl font-black">{s.value}</div>
                                    <div className="text-[10px] uppercase font-bold text-white/30 tracking-wider font-mono">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Pending Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-yellow-500/80">Pending Submissions</h2>
                                <div className="h-px bg-yellow-500/20 flex-1" />
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3">
                                {pending.length === 0 ? (
                                    <div className="glass-card p-12 text-center rounded-2xl border-dashed border-white/10">
                                        <p className="text-white/20 font-bold uppercase tracking-widest text-xs">Inbox is empty</p>
                                    </div>
                                ) : (
                                    pending.map(node => (
                                        <AdminNodeListItem key={node.host + node.port} node={node} onApprove={() => handleApprove(node)} onDelete={() => handleDelete(node)} />
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Approved Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-green-500/80">Active Directory</h2>
                                <div className="h-px bg-green-500/20 flex-1" />
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3">
                                {approved.map(node => (
                                    <AdminNodeListItem key={node.host + node.port} node={node} onDelete={() => handleDelete(node)} approved />
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

function AdminNodeListItem({ node, onApprove, onDelete, approved }) {
    const [checking, setChecking] = useState(false);
    const [checkResult, setCheckResult] = useState(node.checkResult || null);

    const testConnection = async () => {
        setChecking(true);
        try {
            const res = await fetch("/api/nodes/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    host: node.host,
                    port: node.port,
                    password: node.password,
                    secure: node.secure,
                    restVersion: node.restVersion
                })
            });
            const data = await res.json();
            setCheckResult(data);
        } catch (err) {
            setCheckResult({ connected: false, error: err.message });
        } finally {
            setChecking(false);
        }
    };

    return (
        <div className="glass-card group p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.04] transition-all border-white/5">
            <div className="flex items-center gap-5 flex-1 min-w-0">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/5 group-hover:border-white/10 transition-colors">
                    <Server size={20} className="text-white/40" />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg tracking-tight truncate">{node.identifier}</span>
                        {node.secure && <Shield size={12} className="text-blue-500" />}
                        {checkResult && (
                            <Badge variant="outline" className={checkResult.connected ? "bg-green-500/10 text-green-500 border-green-500/20 px-1.5" : "bg-red-500/10 text-red-500 border-red-500/20 px-1.5"}>
                                {checkResult.connected ? "LIVE" : "DEAD"}
                            </Badge>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/30 font-mono">
                        <span className="flex items-center gap-1.5"><Globe size={10} /> {node.host}:{node.port}</span>
                        <span className="flex items-center gap-1.5"><MessageSquare size={10} /> {node.authorId}</span>
                        <span className="flex items-center gap-1.5 text-[10px] bg-white/5 px-2 rounded uppercase font-bold">{node.restVersion}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
                {!checkResult && (
                    <Button 
                        variant="ghost" onClick={testConnection} disabled={checking}
                        className="h-9 px-4 text-xs font-bold gap-2 text-white/40 hover:text-white"
                    >
                         {checking ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                         Test
                    </Button>
                )}
                
                {checkResult?.connected && (
                    <div className="flex gap-4 items-center mr-4 text-[10px] font-mono text-green-500/60 uppercase font-black">
                        <div>CPU: {checkResult.stats?.cpu?.systemLoad?.toFixed(1)}%</div>
                        <div>PLAYERS: {checkResult.stats?.players}</div>
                    </div>
                )}

                <div className="h-8 w-px bg-white/5 mx-2 hidden md:block" />

                {!approved && (
                    <Button 
                        onClick={onApprove}
                        className="h-9 bg-green-500 text-white hover:bg-green-600 font-bold px-5 text-xs gap-2 rounded-lg"
                    >
                        <Check size={14} /> Approve
                    </Button>
                )}
                <Button 
                    onClick={onDelete}
                    variant="ghost"
                    className="h-9 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold px-4 text-xs gap-2 rounded-lg border border-red-500/20"
                >
                    <Trash2 size={14} /> Remove
                </Button>
            </div>
        </div>
    );
}
