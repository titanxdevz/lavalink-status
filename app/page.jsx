"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNodes } from "@/contexts/NodesContext";
import {
    Check, X, Trash2, Shield, Server,
    Loader2, AlertCircle, RefreshCw, Terminal, Hash, Lock,
    Edit2, Save, LogOut, Search, ChevronDown, ChevronUp,
    Eye, EyeOff, Ban, CheckSquare, Square, Zap, Clock
} from "lucide-react";

// ─── Toast System ────────────────────────────────────────────────────────────

function useToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info") => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return { toasts, toast: addToast, removeToast };
}

function ToastContainer({ toasts, removeToast }) {
    if (!toasts.length) return null;
    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className={`pointer-events-auto flex items-center gap-4 px-5 py-4 border-2 font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px] animate-slide-in-right
                        ${t.type === "success" ? "bg-emerald-950 border-emerald-500 text-emerald-400 shadow-emerald-500/50" :
                          t.type === "error"   ? "bg-red-950 border-red-500 text-red-400 shadow-red-500/50" :
                          t.type === "warn"    ? "bg-amber-950 border-amber-500 text-amber-400 shadow-amber-500/50" :
                                                 "bg-[#09090b] border-blue-500 text-blue-400 shadow-blue-500/50"}`}
                >
                    <span className="flex-1">{t.message}</span>
                    <button onClick={() => removeToast(t.id)} className="opacity-60 hover:opacity-100 transition-opacity">
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmModal({ open, title, message, confirmLabel, confirmClass, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#09090b] border-2 border-[#27272a] p-8 max-w-md w-full shadow-[8px_8px_0px_0px_#27272a]">
                <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-3">{title}</h3>
                <p className="text-[#a1a1aa] font-black uppercase tracking-widest text-xs mb-8">{message}</p>
                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-3 font-black uppercase tracking-widest text-sm transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 ${confirmClass}`}
                    >
                        {confirmLabel}
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-[#000] border-2 border-[#27272a] text-[#a1a1aa] font-black uppercase tracking-widest text-sm hover:border-white hover:text-white transition-all"
                    >
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
    const { updateNodeStatus, deleteNode } = useNodes();
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [editingNode, setEditingNode] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [lastSynced, setLastSynced] = useState(null);
    const [actionLoading, setActionLoading] = useState({});
    const [confirm, setConfirm] = useState(null); // { title, message, confirmLabel, confirmClass, onConfirm }
    const { toasts, toast, removeToast } = useToast();
    const autoRefreshRef = useRef(null);

    // ── Session persistence ──
    useEffect(() => {
        const stored = sessionStorage.getItem("admin_auth");
        if (stored === "1") {
            setAuthenticated(true);
        }
    }, []);

    // ── Auto-refresh every 30s ──
    useEffect(() => {
        if (!authenticated) return;
        fetchAllNodes();
        autoRefreshRef.current = setInterval(() => {
            fetchAllNodes(true);
        }, 30000);
        return () => clearInterval(autoRefreshRef.current);
    }, [authenticated]);

    const fetchAllNodes = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await fetch("/api/nodes?all=true");
            if (!res.ok) throw new Error("Failed to fetch nodes");
            const data = await res.json();
            setNodes(data);
            setLastSynced(new Date());
            setError("");
        } catch (err) {
            setError(err.message);
            if (!silent) toast("Failed to fetch nodes", "error");
        } finally {
            if (!silent) setLoading(false);
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
                sessionStorage.setItem("admin_auth", "1");
                setAuthenticated(true);
            } else {
                toast("Invalid authentication key", "error");
            }
        } catch (err) {
            toast("Login failed: " + err.message, "error");
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("admin_auth");
        setAuthenticated(false);
        setNodes([]);
        setSelectedIds(new Set());
        clearInterval(autoRefreshRef.current);
    };

    const setNodeLoading = (id, val) => {
        setActionLoading(prev => ({ ...prev, [id]: val }));
    };

    const handleApprove = async (node) => {
        const nodeId = node._id || node.host + node.port;
        setNodeLoading(nodeId, "approve");
        try {
            await updateNodeStatus(node.host, node.port, "approved");
            toast(`${node.identifier} approved`, "success");
            fetchAllNodes(true);
        } catch (err) {
            toast(err.message, "error");
        } finally {
            setNodeLoading(nodeId, null);
        }
    };

    const handleReject = async (node) => {
        const nodeId = node._id || node.host + node.port;
        setNodeLoading(nodeId, "reject");
        try {
            await updateNodeStatus(node.host, node.port, "rejected");
            toast(`${node.identifier} rejected`, "warn");
            fetchAllNodes(true);
        } catch (err) {
            toast(err.message, "error");
        } finally {
            setNodeLoading(nodeId, null);
        }
    };

    const handleDelete = (node) => {
        setConfirm({
            title: "PURGE_NODE",
            message: `This will permanently delete ${node.identifier}. This cannot be undone.`,
            confirmLabel: "PURGE",
            confirmClass: "bg-red-500 border-2 border-red-500 text-black hover:bg-white hover:border-white",
            onConfirm: async () => {
                setConfirm(null);
                const nodeId = node._id || node.host + node.port;
                setNodeLoading(nodeId, "delete");
                try {
                    await deleteNode(node.host, node.port);
                    toast(`${node.identifier} purged`, "error");
                    setSelectedIds(prev => { const s = new Set(prev); s.delete(nodeId); return s; });
                    fetchAllNodes(true);
                } catch (err) {
                    toast(err.message, "error");
                } finally {
                    setNodeLoading(nodeId, null);
                }
            }
        });
    };

    const handleBulkApprove = () => {
        setConfirm({
            title: "BULK_APPROVE",
            message: `Approve ${selectedIds.size} selected node(s)?`,
            confirmLabel: "APPROVE ALL",
            confirmClass: "bg-emerald-500 border-2 border-emerald-500 text-black hover:bg-white hover:border-white",
            onConfirm: async () => {
                setConfirm(null);
                const targets = nodes.filter(n => selectedIds.has(n._id || n.host + n.port));
                await Promise.allSettled(targets.map(n => updateNodeStatus(n.host, n.port, "approved")));
                toast(`${targets.length} node(s) approved`, "success");
                setSelectedIds(new Set());
                fetchAllNodes(true);
            }
        });
    };

    const handleBulkDelete = () => {
        setConfirm({
            title: "BULK_PURGE",
            message: `Permanently delete ${selectedIds.size} selected node(s)?`,
            confirmLabel: "PURGE ALL",
            confirmClass: "bg-red-500 border-2 border-red-500 text-black hover:bg-white hover:border-white",
            onConfirm: async () => {
                setConfirm(null);
                const targets = nodes.filter(n => selectedIds.has(n._id || n.host + n.port));
                await Promise.allSettled(targets.map(n => deleteNode(n.host, n.port)));
                toast(`${targets.length} node(s) purged`, "error");
                setSelectedIds(new Set());
                fetchAllNodes(true);
            }
        });
    };

    const handleUpdateNode = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...editingNode, port: parseInt(editingNode.port, 10) };
            const res = await fetch("/api/nodes", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update node");
            }
            toast(`${editingNode.identifier} updated`, "success");
            setEditingNode(null);
            fetchAllNodes(true);
        } catch (err) {
            toast(err.message, "error");
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => {
            const s = new Set(prev);
            s.has(id) ? s.delete(id) : s.add(id);
            return s;
        });
    };

    const filteredNodes = nodes.filter(n => {
        const q = searchQuery.toLowerCase();
        return (
            n.identifier?.toLowerCase().includes(q) ||
            n.host?.toLowerCase().includes(q) ||
            n.authorId?.toLowerCase().includes(q)
        );
    });

    const pending  = filteredNodes.filter(n => n.status === "pending");
    const approved = filteredNodes.filter(n => n.status === "approved");
    const rejected = filteredNodes.filter(n => n.status === "rejected");

    // ── Login screen ──
    if (!authenticated) {
        return (
            <div className="min-h-screen bg-[#000000] text-[#f4f4f5] font-mono selection:bg-blue-500 selection:text-white flex items-center justify-center relative overflow-hidden">
                <ToastContainer toasts={toasts} removeToast={removeToast} />

                <div className="fixed inset-0 pointer-events-none z-0" style={{
                    backgroundImage: "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
                    backgroundSize: "32px 32px"
                }} />

                <style>{`
                    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0, 0, 0.2, 1) forwards; }
                    @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
                    .animate-slide-in-right { animation: slideInRight 0.3s cubic-bezier(0, 0, 0.2, 1) forwards; }
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

    return (
        <div className="min-h-screen bg-[#000000] text-[#f4f4f5] font-mono selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <ConfirmModal
                open={!!confirm}
                title={confirm?.title}
                message={confirm?.message}
                confirmLabel={confirm?.confirmLabel}
                confirmClass={confirm?.confirmClass}
                onConfirm={confirm?.onConfirm}
                onCancel={() => setConfirm(null)}
            />

            <div className="fixed inset-0 pointer-events-none z-0" style={{
                backgroundImage: "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
                backgroundSize: "32px 32px"
            }} />

            <style>{`
                @keyframes revealUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                .animate-reveal { animation: revealUp 0.6s cubic-bezier(0, 0, 0.2, 1) forwards; opacity: 0; }
                @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
                .animate-slide-in-right { animation: slideInRight 0.3s cubic-bezier(0, 0, 0.2, 1) forwards; }
                @keyframes zoomIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
                .animate-zoom-in { animation: zoomIn 0.2s cubic-bezier(0, 0, 0.2, 1) forwards; }
            `}</style>

            <Navbar />

            {/* Edit Node Modal */}
            {editingNode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/90 backdrop-blur-sm p-4">
                    <div className="bg-[#09090b] border-2 border-blue-500 p-8 shadow-[12px_12px_0px_0px_#3b82f6] max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-zoom-in">
                        <button
                            onClick={() => setEditingNode(null)}
                            className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center border-l-2 border-b-2 border-blue-500 bg-[#000000] text-white hover:bg-red-500 hover:border-red-500 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-4 border-b-2 border-[#27272a] pb-6 mb-8 mt-2">
                            <Edit2 className="text-blue-500" size={32} />
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">EDIT_NODE</h2>
                        </div>

                        <form onSubmit={handleUpdateNode} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { label: "Identifier", field: "identifier", type: "text", upper: true },
                                    { label: "Host", field: "host", type: "text", upper: true },
                                    { label: "Port", field: "port", type: "number", upper: false },
                                    { label: "Author ID", field: "authorId", type: "text", upper: true },
                                ].map(({ label, field, type, upper }) => (
                                    <div key={field}>
                                        <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-2">{label}</label>
                                        <input
                                            type={type}
                                            value={editingNode[field] || ""}
                                            onChange={(e) => setEditingNode({ ...editingNode, [field]: type === "number" ? e.target.value : e.target.value })}
                                            className={`w-full bg-[#000000] border-2 border-[#27272a] px-4 py-3 text-white font-black focus:border-blue-500 outline-none ${upper ? "uppercase" : ""}`}
                                            required
                                        />
                                    </div>
                                ))}

                                {/* Password with show/hide */}
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-2">Password</label>
                                    <PasswordField
                                        value={editingNode.password || ""}
                                        onChange={(v) => setEditingNode({ ...editingNode, password: v })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-2">Status</label>
                                    <select
                                        value={editingNode.status || "pending"}
                                        onChange={(e) => setEditingNode({ ...editingNode, status: e.target.value })}
                                        className="w-full bg-[#000000] border-2 border-[#27272a] px-4 py-3 text-white font-black uppercase focus:border-blue-500 outline-none cursor-pointer"
                                    >
                                        <option value="pending">PENDING</option>
                                        <option value="approved">APPROVED</option>
                                        <option value="rejected">REJECTED</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-2">REST Version</label>
                                    <select
                                        value={editingNode.restVersion || "v4"}
                                        onChange={(e) => setEditingNode({ ...editingNode, restVersion: e.target.value })}
                                        className="w-full bg-[#000000] border-2 border-[#27272a] px-4 py-3 text-white font-black uppercase focus:border-blue-500 outline-none cursor-pointer"
                                    >
                                        <option value="v3">LAVALINK_v3</option>
                                        <option value="v4">LAVALINK_v4</option>
                                    </select>
                                </div>

                                <div
                                    className="flex items-center gap-4 mt-2 bg-[#000000] border-2 border-[#27272a] px-4 py-3 cursor-pointer hover:border-blue-500 transition-colors"
                                    onClick={() => setEditingNode({ ...editingNode, secure: !editingNode.secure })}
                                >
                                    <input
                                        type="checkbox"
                                        checked={editingNode.secure || false}
                                        onChange={(e) => setEditingNode({ ...editingNode, secure: e.target.checked })}
                                        className="w-5 h-5 border-2 border-[#27272a] cursor-pointer accent-blue-500"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <label className="text-sm font-black text-white uppercase tracking-widest cursor-pointer">SECURE (SSL/WSS)</label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 bg-blue-500 border-2 border-blue-500 text-black font-black text-xl tracking-widest uppercase transition-all shadow-[6px_6px_0px_0px_#f4f4f5] hover:bg-white hover:border-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_#f4f4f5] flex items-center justify-center gap-3 mt-8"
                            >
                                <Save size={24} /> SAVE_CHANGES
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <main className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-40">
                {/* Header */}
                <div className="animate-reveal flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-[#27272a] pb-12 mb-12">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-blue-500 text-black flex items-center justify-center border-2 border-transparent shadow-[4px_4px_0px_0px_#f4f4f5]">
                                <Terminal size={28} />
                            </div>
                            <h1 className="text-5xl font-black uppercase tracking-tighter text-white">COMMAND_CENTER</h1>
                        </div>
                        <p className="text-[#a1a1aa] text-lg font-black tracking-widest uppercase">Grid oversight and node verification protocol.</p>
                        {lastSynced && (
                            <div className="flex items-center gap-2 mt-3 text-[#52525b] text-xs font-black uppercase tracking-widest">
                                <Clock size={12} />
                                LAST SYNC: {lastSynced.toLocaleTimeString()}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchAllNodes}
                            disabled={loading}
                            className="flex items-center gap-3 bg-[#09090b] border-2 border-[#27272a] text-[#a1a1aa] hover:border-white hover:text-white px-6 py-4 font-black uppercase tracking-widest transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#3b82f6]"
                        >
                            <RefreshCw size={18} className={loading ? "animate-spin text-blue-500" : ""} />
                            SYNC_DATA
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 bg-[#000] border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black px-6 py-4 font-black uppercase tracking-widest transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#ef4444]"
                        >
                            <LogOut size={18} />
                            LOGOUT
                        </button>
                    </div>
                </div>

                {/* Search + Bulk Actions */}
                <div className="animate-reveal mb-10 flex flex-col sm:flex-row gap-4" style={{ animationDelay: "50ms" }}>
                    <div className="flex items-center gap-3 flex-1 bg-[#09090b] border-2 border-[#27272a] px-4 py-3 focus-within:border-blue-500 transition-colors">
                        <Search size={16} className="text-[#52525b] shrink-0" />
                        <input
                            type="text"
                            placeholder="SEARCH NODES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent outline-none text-white font-black uppercase tracking-widest placeholder-[#52525b] w-full text-sm"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="text-[#52525b] hover:text-white transition-colors">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {selectedIds.size > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-[#a1a1aa] uppercase tracking-widest px-3 py-3 border-2 border-[#27272a] bg-[#09090b]">
                                {selectedIds.size} SELECTED
                            </span>
                            <button
                                onClick={handleBulkApprove}
                                className="flex items-center gap-2 px-4 py-3 bg-emerald-500 border-2 border-emerald-500 text-black font-black uppercase tracking-widest text-xs hover:bg-white hover:border-white transition-all"
                            >
                                <Zap size={14} /> APPROVE ALL
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="flex items-center gap-2 px-4 py-3 bg-[#000] border-2 border-red-500 text-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-black transition-all"
                            >
                                <Trash2 size={14} /> PURGE ALL
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6 border-2 border-[#27272a] bg-[#09090b]">
                        <Loader2 size={48} className="animate-spin text-blue-500" />
                        <span className="text-white font-black tracking-widest uppercase text-xl">RETRIEVING DB...</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 border-2 border-red-500 bg-red-950/20">
                        <AlertCircle size={40} className="text-red-500" />
                        <span className="text-red-400 font-black tracking-widest uppercase">{error}</span>
                    </div>
                ) : (
                    <div className="space-y-20">
                        <NodeSection
                            title="PENDING_VERIFICATION"
                            count={pending.length}
                            nodes={pending}
                            accentClass="bg-amber-500"
                            icon={<AlertCircle size={20} />}
                            delay="100ms"
                            selectedIds={selectedIds}
                            toggleSelect={toggleSelect}
                            actionLoading={actionLoading}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onDelete={handleDelete}
                            onEdit={setEditingNode}
                            emptyMsg="QUEUE EMPTY."
                            showApprove
                            showReject
                        />
                        <NodeSection
                            title="ACTIVE_GRID"
                            count={approved.length}
                            nodes={approved}
                            accentClass="bg-emerald-500"
                            icon={<Check size={20} />}
                            delay="200ms"
                            selectedIds={selectedIds}
                            toggleSelect={toggleSelect}
                            actionLoading={actionLoading}
                            onDelete={handleDelete}
                            onEdit={setEditingNode}
                            emptyMsg="NO ACTIVE NODES."
                        />
                        <NodeSection
                            title="REJECTED_NODES"
                            count={rejected.length}
                            nodes={rejected}
                            accentClass="bg-red-500"
                            icon={<Ban size={20} />}
                            delay="300ms"
                            selectedIds={selectedIds}
                            toggleSelect={toggleSelect}
                            actionLoading={actionLoading}
                            onApprove={handleApprove}
                            onDelete={handleDelete}
                            onEdit={setEditingNode}
                            emptyMsg="NO REJECTED NODES."
                            showApprove
                        />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

// ─── Node Section ─────────────────────────────────────────────────────────────

function NodeSection({ title, count, nodes, accentClass, icon, delay, selectedIds, toggleSelect, actionLoading, onApprove, onReject, onDelete, onEdit, emptyMsg, showApprove, showReject }) {
    return (
        <section className="animate-reveal" style={{ animationDelay: delay }}>
            <div className="flex items-center gap-4 mb-8">
                <div className={`p-2 ${accentClass} text-black`}>{icon}</div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-4">
                    {title}
                    <span className="bg-[#27272a] px-3 py-1 text-sm">{count}</span>
                </h2>
            </div>
            <div className="flex flex-col gap-6">
                {nodes.length === 0 ? (
                    <div className="bg-[#09090b] border-2 border-dashed border-[#52525b] p-12 text-center text-[#a1a1aa] font-black tracking-widest uppercase text-lg">
                        {emptyMsg}
                    </div>
                ) : nodes.map(node => {
                    const nodeId = node._id || node.host + node.port;
                    return (
                        <AdminNodeCard
                            key={nodeId}
                            node={node}
                            selected={selectedIds.has(nodeId)}
                            onToggleSelect={() => toggleSelect(nodeId)}
                            loading={actionLoading[nodeId]}
                            onApprove={showApprove ? () => onApprove(node) : undefined}
                            onReject={showReject ? () => onReject(node) : undefined}
                            onDelete={() => onDelete(node)}
                            onEdit={() => onEdit(node)}
                        />
                    );
                })}
            </div>
        </section>
    );
}

// ─── Node Card ────────────────────────────────────────────────────────────────

function AdminNodeCard({ node, selected, onToggleSelect, loading, onApprove, onReject, onDelete, onEdit }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`bg-[#09090b] border-2 transition-colors shadow-[4px_4px_0px_0px_#27272a] ${selected ? "border-blue-500" : "border-[#27272a] hover:border-[#52525b]"}`}>
            <div className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                {/* Checkbox + Info */}
                <div className="flex items-start gap-4 flex-1 w-full lg:w-auto">
                    <button
                        onClick={onToggleSelect}
                        className="mt-1 text-[#52525b] hover:text-blue-500 transition-colors shrink-0"
                    >
                        {selected ? <CheckSquare size={20} className="text-blue-500" /> : <Square size={20} />}
                    </button>

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
                            <span className={`px-2 py-1 border-2 ${node.secure ? "border-emerald-500 text-emerald-500" : "border-[#52525b] text-[#52525b]"}`}>
                                {node.secure ? "SECURE_WSS" : "INSECURE_WS"}
                            </span>
                            <span className="px-2 py-1 border-2 border-blue-500 text-blue-500">
                                {node.restVersion}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto border-t-2 lg:border-t-0 border-[#27272a] pt-6 lg:pt-0">
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <div className="text-[10px] text-[#52525b] font-black uppercase tracking-widest">OPERATOR</div>
                        <div className="text-sm text-white font-black uppercase truncate max-w-[200px]">{node.authorId}</div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 flex-wrap">
                        {onApprove && (
                            <button
                                onClick={onApprove}
                                disabled={!!loading}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 border-2 border-emerald-500 text-black font-black uppercase tracking-widest text-sm transition-all hover:bg-white hover:border-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#10b981] disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {loading === "approve" ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} APPROVE
                            </button>
                        )}
                        {onReject && (
                            <button
                                onClick={onReject}
                                disabled={!!loading}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 border-2 border-amber-500 text-black font-black uppercase tracking-widest text-sm transition-all hover:bg-white hover:border-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#f59e0b] disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {loading === "reject" ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />} REJECT
                            </button>
                        )}
                        <button
                            onClick={onEdit}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-[#09090b] border-2 border-[#52525b] text-white font-black uppercase tracking-widest text-sm transition-all hover:bg-white hover:text-black hover:border-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#f4f4f5]"
                        >
                            <Edit2 size={16} /> EDIT
                        </button>
                        <button
                            onClick={onDelete}
                            disabled={!!loading}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-[#000000] border-2 border-red-500 text-red-500 font-black uppercase tracking-widest text-sm transition-all hover:bg-red-500 hover:text-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#ef4444] disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loading === "delete" ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} PURGE
                        </button>
                        <button
                            onClick={() => setExpanded(p => !p)}
                            className="flex items-center justify-center gap-2 px-3 py-3 border-2 border-[#27272a] text-[#52525b] hover:border-white hover:text-white transition-all"
                        >
                            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded detail */}
            {expanded && (
                <div className="border-t-2 border-[#27272a] px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: "HOST", value: node.host },
                        { label: "PORT", value: node.port },
                        { label: "STATUS", value: node.status?.toUpperCase() },
                        { label: "SECURE", value: node.secure ? "YES" : "NO" },
                        { label: "REST VERSION", value: node.restVersion },
                        { label: "AUTHOR ID", value: node.authorId },
                        { label: "CREATED", value: node.createdAt ? new Date(node.createdAt).toLocaleDateString() : "—" },
                        { label: "UPDATED", value: node.updatedAt ? new Date(node.updatedAt).toLocaleDateString() : "—" },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <div className="text-[10px] text-[#52525b] font-black uppercase tracking-widest mb-1">{label}</div>
                            <div className="text-sm text-white font-black uppercase truncate">{value ?? "—"}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Password Field ───────────────────────────────────────────────────────────

function PasswordField({ value, onChange }) {
    const [show, setShow] = useState(false);
    return (
        <div className="flex items-center gap-3 bg-[#000000] border-2 border-[#27272a] px-4 py-3 focus-within:border-blue-500 transition-colors">
            <input
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent outline-none text-white font-black w-full"
                required
            />
            <button
                type="button"
                onClick={() => setShow(p => !p)}
                className="text-[#52525b] hover:text-white transition-colors shrink-0"
            >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );
}
