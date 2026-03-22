"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNodes } from "@/contexts/NodesContext";
import {
    Check, X, Trash2, Shield, Server,
    Globe, MessageSquare, Loader2, AlertCircle, RefreshCw, Terminal, Hash, Lock, Edit2, Save
} from "lucide-react";

export default function AdminPage() {
    const { updateNodeStatus, deleteNode } = useNodes();
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [editingNode, setEditingNode] = useState(null);

    const handleUpdateNode = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/nodes", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingNode)
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update node");
            }
            setEditingNode(null);
            fetchAllNodes();
        } catch (err) {
            alert(err.message);
        }
    };

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
            <div className="min-h-screen bg-[#000000] text-[#f4f4f5] font-mono selection:bg-blue-500 selection:text-white flex items-center justify-center relative overflow-hidden">
                <div className="fixed inset-0 pointer-events-none z-0 flex flex-wrap opacity-10">
                    {[...Array(200)].map((_, i) => (
                        <div key={i} className="w-8 h-8 border-[0.5px] border-[#333333]"></div>
                    ))}
                </div>

                <style>{`
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0, 0, 0.2, 1) forwards; }
                `}</style>

                <form onSubmit={handleLogin} className="relative z-10 w-full max-w-md bg-[#09090b] border-2 border-[#27272a] p-8 md:p-12 shadow-[12px_12px_0px_0px_#3b82f6] animate-slide-up">
                    <div className="flex items-center gap-4 border-b-2 border-[#27272a] pb-6 mb-8">
                        <div className="w-12 h-12 bg-blue-500 text-black flex items-center justify-center border-2 border-transparent shadow-[4px_4px_0px_0px_#f4f4f5]">
                            <Shield size={24} />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">SYS_ADMIN</h1>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div>
                            <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Authentication Key</label>
                            <div className="flex items-center gap-4 bg-[#000000] border-2 border-[#27272a] px-4 py-4 focus-within:border-blue-500 focus-within:shadow-[6px_6px_0px_0px_#3b82f6] transition-all">
                                <Lock size={20} className="text-[#52525b]" />
                                <input
                                    type="password"
                                    placeholder="ENTER DIRECTIVE..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-transparent border-none outline-none text-white w-full font-black uppercase tracking-widest placeholder-[#52525b]"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-5 bg-blue-500 border-2 border-blue-500 text-black font-black text-xl tracking-widest uppercase transition-all shadow-[6px_6px_0px_0px_#f4f4f5] hover:bg-white hover:border-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_#f4f4f5] flex items-center justify-center gap-3"
                    >
                        EXECUTE_LOGIN
                    </button>
                </form>
            </div>
        );
    }

    const pending = nodes.filter(n => n.status === "pending");
    const approved = nodes.filter(n => n.status === "approved");

    return (
        <div className="min-h-screen bg-[#000000] text-[#f4f4f5] font-mono selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none z-0 flex flex-wrap opacity-10">
                {[...Array(200)].map((_, i) => (
                    <div key={i} className="w-8 h-8 border-[0.5px] border-[#333333]"></div>
                ))}
            </div>

            <style>{`
                @keyframes revealUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-reveal { animation: revealUp 0.6s cubic-bezier(0, 0, 0.2, 1) forwards; opacity: 0; }
            `}</style>

            <Navbar />

            {editingNode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/90 backdrop-blur-sm p-4">
                    <div className="bg-[#09090b] border-2 border-blue-500 p-8 shadow-[12px_12px_0px_0px_#3b82f6] max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setEditingNode(null)} className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center border-l-2 border-b-2 border-blue-500 bg-[#000000] text-white hover:bg-red-500 hover:border-red-500 transition-colors">
                            <X size={24} />
                        </button>
                        
                        <div className="flex items-center gap-4 border-b-2 border-[#27272a] pb-6 mb-8 mt-2">
                            <Edit2 className="text-blue-500" size={32} />
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">EDIT_NODE</h2>
                        </div>

                        <form onSubmit={handleUpdateNode} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-2">Identifier</label>
                                    <input type="text" value={editingNode.identifier || ''} onChange={(e) => setEditingNode({...editingNode, identifier: e.target.value})} className="w-full bg-[#000000] border-2 border-[#27272a] px-4 py-3 text-white font-black uppercase focus:border-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-2">Host</label>
                                    <input type="text" value={editingNode.host || ''} onChange={(e) => setEditingNode({...editingNode, host: e.target.value})} className="w-full bg-[#000000] border-2 border-[#27272a] px-4 py-3 text-white font-black uppercase focus:border-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-2">Port</label>
                                    <input type="number" value={editingNode.port || ''} onChange={(e) => setEditingNode({...editingNode, port: e.target.value})} className="w-full bg-[#000000] border-2 border-[#27272a] px-4 py-3 text-white font-black uppercase focus:border-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-2">Password</label>
                                    <input type="text" value={editingNode.password || ''} onChange={(e) => setEditingNode({...editingNode, password: e.target.value})} className="w-full bg-[#000000] border-2 border-[#27272a] px-4 py-3 text-white font-black focus:border-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-2">Author ID</label>
                                    <input type="text" value={editingNode.authorId || ''} onChange={(e) => setEditingNode({...editingNode, authorId: e.target.value})} className="w-full bg-[#000000] border-2 border-[#27272a] px-4 py-3 text-white font-black uppercase focus:border-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-2">Status</label>
                                    <select value={editingNode.status || 'pending'} onChange={(e) => setEditingNode({...editingNode, status: e.target.value})} className="w-full bg-[#000000] border-2 border-[#27272a] px-4 py-3 text-white font-black uppercase focus:border-blue-500 outline-none cursor-pointer">
                                        <option value="pending">PENDING</option>
                                        <option value="approved">APPROVED</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-2">REST Version</label>
                                    <select value={editingNode.restVersion || 'v4'} onChange={(e) => setEditingNode({...editingNode, restVersion: e.target.value})} className="w-full bg-[#000000] border-2 border-[#27272a] px-4 py-3 text-white font-black uppercase focus:border-blue-500 outline-none cursor-pointer">
                                        <option value="v3">LAVALINK_v3</option>
                                        <option value="v4">LAVALINK_v4</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-4 mt-8 bg-[#000000] border-2 border-[#27272a] px-4 py-3">
                                    <input type="checkbox" checked={editingNode.secure || false} onChange={(e) => setEditingNode({...editingNode, secure: e.target.checked})} className="w-5 h-5 border-2 border-[#27272a] cursor-pointer" />
                                    <label className="text-sm font-black text-white uppercase tracking-widest cursor-pointer" onClick={() => setEditingNode({...editingNode, secure: !editingNode.secure})}>SECURE (SSL/HTTPS)</label>
                                </div>
                            </div>
                            
                            <button type="submit" className="w-full py-5 bg-blue-500 border-2 border-blue-500 text-black font-black text-xl tracking-widest uppercase transition-all shadow-[6px_6px_0px_0px_#f4f4f5] hover:bg-white hover:border-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_#f4f4f5] flex items-center justify-center gap-3 mt-8">
                                <Save size={24} /> SAVE_CHANGES
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <main className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-40">
                <div className="animate-reveal flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-[#27272a] pb-12 mb-16">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-blue-500 text-black flex items-center justify-center border-2 border-transparent shadow-[4px_4px_0px_0px_#f4f4f5]">
                                <Terminal size={28} />
                            </div>
                            <h1 className="text-5xl font-black uppercase tracking-tighter text-white">COMMAND_CENTER</h1>
                        </div>
                        <p className="text-[#a1a1aa] text-lg font-black tracking-widest uppercase">Grid oversight and node verification protocol.</p>
                    </div>
                    <button
                        onClick={fetchAllNodes}
                        disabled={loading}
                        className="flex items-center gap-3 bg-[#09090b] border-2 border-[#27272a] text-[#a1a1aa] hover:border-white hover:text-white px-6 py-4 font-black uppercase tracking-widest transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#3b82f6]"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin text-blue-500" : ""} />
                        SYNC_DATA
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6 border-2 border-[#27272a] bg-[#09090b] animate-pulse">
                        <Loader2 size={48} className="animate-spin text-blue-500" />
                        <span className="text-white font-black tracking-widest uppercase text-xl">RETRIEVING DB...</span>
                    </div>
                ) : (
                    <div className="space-y-24">
                        <section className="animate-reveal" style={{ animationDelay: '100ms' }}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-2 bg-amber-500 text-black">
                                    <AlertCircle size={20} />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-4">
                                    PENDING_VERIFICATION
                                    <span className="bg-[#27272a] px-3 py-1 text-sm">{pending.length}</span>
                                </h2>
                            </div>

                            <div className="flex flex-col gap-6">
                                {pending.length === 0 ? (
                                    <div className="bg-[#09090b] border-2 border-dashed border-[#52525b] p-12 text-center text-[#a1a1aa] font-black tracking-widest uppercase text-lg">
                                        QUEUE EMPTY.
                                    </div>
                                ) : (
                                    pending.map(node => (
                                        <AdminNodeCard key={node.host + node.port} node={node} onApprove={() => handleApprove(node)} onDelete={() => handleDelete(node)} onEdit={() => setEditingNode(node)} />
                                    ))
                                )}
                            </div>
                        </section>

                        <section className="animate-reveal" style={{ animationDelay: '200ms' }}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-2 bg-emerald-500 text-black">
                                    <Check size={20} />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-4">
                                    ACTIVE_GRID
                                    <span className="bg-[#27272a] px-3 py-1 text-sm">{approved.length}</span>
                                </h2>
                            </div>

                            <div className="flex flex-col gap-6">
                                {approved.length === 0 ? (
                                    <div className="bg-[#09090b] border-2 border-dashed border-[#52525b] p-12 text-center text-[#a1a1aa] font-black tracking-widest uppercase text-lg">
                                        NO ACTIVE NODES.
                                    </div>
                                ) : (
                                    approved.map(node => (
                                        <AdminNodeCard key={node.host + node.port} node={node} onDelete={() => handleDelete(node)} onEdit={() => setEditingNode(node)} approved />
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

function AdminNodeCard({ node, onApprove, onDelete, onEdit, approved }) {
    return (
        <div className="bg-[#09090b] border-2 border-[#27272a] p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 hover:border-[#52525b] transition-colors shadow-[4px_4px_0px_0px_#27272a]">

            <div className="flex items-start gap-6 flex-1 w-full lg:w-auto">
                <div className="w-14 h-14 bg-[#000000] border-2 border-[#27272a] flex items-center justify-center shrink-0">
                    <Server size={24} className="text-[#a1a1aa]" />
                </div>
                <div className="flex flex-col gap-3 min-w-0">
                    <div className="text-xl font-black text-white uppercase tracking-tighter truncate">{node.identifier}</div>
                    <div className="flex items-center gap-3 text-xs font-black text-[#52525b] uppercase tracking-widest">
                        <Hash size={14} />
                        <span className="truncate">{node.host}:{node.port}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                        <span className={`px-2 py-1 border-2 ${node.secure ? 'border-emerald-500 text-emerald-500' : 'border-[#52525b] text-[#52525b]'}`}>
                            {node.secure ? "SECURE_WSS" : "INSECURE_WS"}
                        </span>
                        <span className="px-2 py-1 border-2 border-blue-500 text-blue-500">
                            {node.restVersion}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 w-full lg:w-auto border-t-2 lg:border-t-0 border-[#27272a] pt-6 lg:pt-0">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <div className="text-[10px] text-[#52525b] font-black uppercase tracking-widest">OPERATOR</div>
                    <div className="text-sm text-white font-black uppercase truncate max-w-[200px]">{node.authorId}</div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto shrink-0">
                    {!approved && (
                        <button
                            onClick={onApprove}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 border-2 border-emerald-500 text-black font-black uppercase tracking-widest transition-all hover:bg-white hover:border-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#10b981]"
                        >
                            <Check size={18} /> APPROVE
                        </button>
                    )}
                    <button
                        onClick={onEdit}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#09090b] border-2 border-[#52525b] text-white font-black uppercase tracking-widest transition-all hover:bg-white hover:text-black hover:border-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#f4f4f5]"
                    >
                        <Edit2 size={18} /> EDIT
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#000000] border-2 border-red-500 text-red-500 font-black uppercase tracking-widest transition-all hover:bg-red-500 hover:text-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#ef4444]"
                    >
                        <Trash2 size={18} /> PURGE
                    </button>
                </div>
            </div>
        </div>
    );
}