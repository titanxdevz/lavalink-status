"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNodes } from "@/contexts/NodesContext";
import {
    Check, X, Trash2, Shield, Server, User, Users,
    Loader2, AlertCircle, RefreshCw, Terminal, Hash, Lock,
    Edit2, Save, LogOut, Search, ChevronDown, ChevronUp,
    Eye, EyeOff, Ban, CheckSquare, Square, Zap, Clock, Copy, Activity, Megaphone, Tag, Plus
} from "lucide-react";
import { SiteLoader } from "@/components/SiteLoader";
import Link from "next/link";

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
                            t.type === "error" ? "bg-red-950 border-red-500 text-red-400 shadow-red-500/50" :
                                t.type === "warn" ? "bg-amber-950 border-amber-500 text-amber-400 shadow-amber-500/50" :
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

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="hover:text-blue-500 transition-colors">
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
        </button>
    );
}

// ─── Node Status Dialog ───────────────────────────────────────────────────────

function NodeStatusDialog({ nodeData, onClose }) {
    if (!nodeData) return null;
    const { node, data } = nodeData;
    const { info, stats } = data;

    const formatBytes = (bytes) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatDuration = (ms) => {
        if (!ms) return "0S";
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const parts = [];
        if (days > 0) parts.push(`${days}D`);
        if (hours > 0) parts.push(`${hours}H`);
        if (minutes > 0) parts.push(`${minutes}M`);
        if (seconds > 0) parts.push(`${seconds}S`);
        return parts.join(" ") || "0S";
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-[#09090b] border-2 border-[#27272a] w-full max-w-4xl shadow-[12px_12px_0px_0px_#1a1a1a] my-auto animate-in zoom-in-95 duration-200">
                <div className="p-6 md:p-8 border-b-2 border-[#27272a] flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 border-2 border-blue-500 flex items-center justify-center text-black">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">{node.identifier}</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">REALTIME_DIAGNOSTICS_REPORT</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white hover:text-black border-2 border-transparent hover:border-white transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 md:p-8 space-y-10 max-h-[70vh] overflow-y-auto">
                    {/* Hero Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "UPTIME", value: formatDuration(stats?.uptime), color: "text-blue-500" },
                            { label: "PLAYERS", value: `${stats?.playingPlayers || 0}/${stats?.players || 0}`, color: "text-emerald-500" },
                            { label: "MEMORY", value: formatBytes(stats?.memory?.used), color: "text-purple-500" },
                            { label: "CPU_LOAD", value: `${(stats?.cpu?.systemLoad * 100 || 0).toFixed(2)}%`, color: "text-amber-500" },
                        ].map((s, i) => (
                            <div key={i} className="bg-black/40 border-2 border-[#27272a] p-4 flex flex-col gap-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-[#52525b]">{s.label}</span>
                                <span className={`text-lg font-black uppercase tracking-tighter ${s.color}`}>{s.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Information */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#52525b] border-l-4 border-blue-500 pl-3">SYSTEM_INFORMATION</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "LAVALINK_VERSION", value: info?.version?.semver },
                                    { label: "JVM_VERSION", value: info?.jvm },
                                    { label: "OPERATING_SYSTEM", value: info?.os },
                                    { label: "BUILD_TIME", value: info?.version?.buildTime ? new Date(info.version.buildTime).toLocaleString() : "N/A" },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs font-black uppercase tracking-widest py-2 border-b border-[#27272a]/30">
                                        <span className="text-[#52525b]">{item.label}</span>
                                        <span className="text-white text-right ml-4">{item.value || "—"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sources & Plugins */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#52525b] border-l-4 border-emerald-500 pl-3">ENABLED_SOURCES</h3>
                            <div className="flex flex-wrap gap-2">
                                {info?.sourceManagers?.map((source, i) => (
                                    <span key={i} className="px-3 py-1 bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                                        {source}
                                    </span>
                                )) || <span className="text-[#52525b] text-[10px] font-black uppercase tracking-widest">NO_SOURCES_REPORTED</span>}
                            </div>

                            <h3 className="text-xs font-black uppercase tracking-widest text-[#52525b] border-l-4 border-purple-500 pl-3 mt-8">INSTALLED_PLUGINS</h3>
                            <div className="space-y-2">
                                {info?.plugins?.length > 0 ? info.plugins.map((plugin, i) => (
                                    <div key={i} className="p-3 bg-purple-500/5 border-2 border-purple-500/10 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-white uppercase">{plugin.name}</span>
                                            <span className="text-[8px] font-black text-[#52525b] uppercase tracking-widest">VER: {plugin.version}</span>
                                        </div>
                                        <Shield size={14} className="text-purple-500/50" />
                                    </div>
                                )) : <div className="text-[#52525b] text-[10px] font-black uppercase tracking-widest italic">NO_PLUGINS_DETECTED</div>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8 bg-black/40 border-t-2 border-[#27272a] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-blue-500 border-2 border-blue-500 text-black font-black uppercase tracking-widest text-sm hover:bg-white hover:border-white transition-all shadow-[4px_4px_0px_0px_#000]"
                    >
                        CLOSE_REPORT
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmModal({ open, title, message, confirmLabel, confirmClass, onConfirm, onCancel, showInput, inputValue, setInputValue, inputPlaceholder }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#09090b] border-2 border-[#27272a] p-8 max-w-md w-full shadow-[8px_8px_0px_0px_#27272a]">
                <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-3">{title}</h3>
                <p className="text-[#a1a1aa] font-black uppercase tracking-widest text-xs mb-6">{message}</p>

                {showInput && (
                    <div className="mb-6">
                        <label className="block text-[10px] font-black text-[#52525b] uppercase tracking-widest mb-3">Optional Reason</label>
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={inputPlaceholder || "SPECIFY REASON..."}
                            className="w-full bg-[#000] border-2 border-[#27272a] p-4 text-white text-xs font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all min-h-[100px] resize-none"
                        />
                    </div>
                )}

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
    const [confirm, setConfirm] = useState(null); // { title, message, confirmLabel, confirmClass, onConfirm, showInput }
    const [rejectionReason, setRejectionReason] = useState("");
    const [sortBy, setSortBy] = useState("newest"); // newest, oldest, name, host
    const [activeTab, setActiveTab] = useState("nodes"); // nodes, promotions, users
    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState("");
    const [userLoading, setUserLoading] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [newPromo, setNewPromo] = useState({ title: "", content: "", link: "", type: "announcement" });

    const fetchUsers = async () => {
        setUserLoading(true);
        try {
            const res = await fetch("/api/admin/users", {
                headers: { "x-admin-password": sessionStorage.getItem("admin_password") || "" }
            });
            const data = await res.json();
            if (Array.isArray(data)) setUsers(data);
        } catch (e) {
            toast("Failed to fetch user directory", "error");
        } finally {
            setUserLoading(false);
        }
    };

    const handleBanUser = async (userId, currentStatus) => {
        if (!window.confirm(currentStatus ? "UNBAN_USER?" : "BAN_USER?_THIS_WILL_LOCK_THEIR_ACCESS.")) return;
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "x-admin-password": sessionStorage.getItem("admin_password") || ""
                },
                body: JSON.stringify({ userId, isBanned: !currentStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast(data.message, "success");
                fetchUsers();
            }
        } catch (e) {
            toast(e.message, "error");
        }
    };

    useEffect(() => {
        if (activeTab === "users" && authenticated) {
            fetchUsers();
        }
    }, [activeTab, authenticated]);

    const fetchPromotions = useCallback(async () => {
        try {
            const res = await fetch("/api/promotions");
            const data = await res.json();
            setPromotions(data);
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        if (activeTab === "promotions") fetchPromotions();
    }, [activeTab, fetchPromotions]);

    const handleAddPromo = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/promotions", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "x-admin-password": sessionStorage.getItem("admin_password") || ""
                },
                body: JSON.stringify(newPromo)
            });
            const data = await res.json();
            if (data.success) {
                toast("PROMOTION_DEPLOYED");
                setNewPromo({ title: "", content: "", link: "", type: "announcement" });
                fetchPromotions();
            } else {
                toast("DEPLOYMENT_ERROR: " + data.error, "error");
            }
        } catch (e) {
            toast(e.message, "error");
        }
    };

    const handleDeletePromo = async (id) => {
        if (!window.confirm("TERMINATE_PROMOTION?")) return;
        try {
            const res = await fetch("/api/admin/promotions", {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "x-admin-password": sessionStorage.getItem("admin_password") || ""
                },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                toast("PROMOTION_TERMINATED");
                fetchPromotions();
            }
        } catch (e) {
            toast(e.message, "error");
        }
    };
    const [statusNode, setStatusNode] = useState(null); // { node, data }
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
                sessionStorage.setItem("admin_password", password);
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

    const handleReject = (node) => {
        setRejectionReason("");
        setConfirm({
            title: "REJECT_NODE",
            message: `Are you sure you want to reject ${node.identifier}?`,
            confirmLabel: "REJECT",
            confirmClass: "bg-amber-500 border-2 border-amber-500 text-black hover:bg-white hover:border-white",
            showInput: true,
            onConfirm: async () => {
                const nodeId = node._id || node.host + node.port;
                const reason = rejectionReason; // Capture current reason
                setConfirm(null);
                setNodeLoading(nodeId, "reject");
                try {
                    await updateNodeStatus(node.host, node.port, "rejected", reason);
                    toast(`${node.identifier} rejected`, "warn");
                    fetchAllNodes(true);
                } catch (err) {
                    toast(err.message, "error");
                } finally {
                    setNodeLoading(nodeId, null);
                }
            }
        });
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

    const handleBulkReject = () => {
        setRejectionReason("");
        setConfirm({
            title: "BULK_REJECT",
            message: `Reject ${selectedIds.size} selected node(s)?`,
            confirmLabel: "REJECT ALL",
            confirmClass: "bg-amber-500 border-2 border-amber-500 text-black hover:bg-white hover:border-white",
            showInput: true,
            onConfirm: async () => {
                const reason = rejectionReason;
                setConfirm(null);
                const targets = nodes.filter(n => selectedIds.has(n._id || n.host + n.port));
                await Promise.allSettled(targets.map(n => updateNodeStatus(n.host, n.port, "rejected", reason)));
                toast(`${targets.length} node(s) rejected`, "warn");
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

    const sortedNodes = [...nodes].sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortBy === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        if (sortBy === "name") return (a.identifier || "").localeCompare(b.identifier || "");
        if (sortBy === "host") return (a.host || "").localeCompare(b.host || "");
        return 0;
    });

    const filteredNodes = sortedNodes.filter(n => {
        const q = searchQuery.toLowerCase();
        return (
            n.identifier?.toLowerCase().includes(q) ||
            n.host?.toLowerCase().includes(q) ||
            n.authorId?.toLowerCase().includes(q)
        );
    });

    const pending = filteredNodes.filter(n => n.status === "pending");
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
            <SiteLoader isLoading={loading && nodes.length === 0} />
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <ConfirmModal
                open={!!confirm}
                title={confirm?.title}
                message={confirm?.message}
                confirmLabel={confirm?.confirmLabel}
                confirmClass={confirm?.confirmClass}
                onConfirm={confirm?.onConfirm}
                onCancel={() => setConfirm(null)}
                showInput={confirm?.showInput}
                inputValue={rejectionReason}
                setInputValue={setRejectionReason}
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

                {/* Tab Switcher */}
                <div className="flex bg-[#09090b] border-2 border-[#27272a] p-1 mb-12 animate-reveal" style={{ animationDelay: "20ms" }}>
                    {[
                        { id: "nodes", label: "NODE_MANAGEMENT", icon: Server },
                        { id: "users", label: "USER_MANAGEMENT", icon: Users },
                        { id: "promotions", label: "PROMOTIONS_SYSTEM", icon: Megaphone }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? "bg-blue-500 text-black shadow-[4px_4px_0px_0px_#f4f4f5]" : "text-[#52525b] hover:text-white"}`}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "nodes" ? (
                    <>
                        {/* Stats Summary */}
                        {!loading && nodes.length > 0 && (
                            <div className="animate-reveal grid grid-cols-2 md:grid-cols-4 gap-4 mb-12" style={{ animationDelay: "50ms" }}>
                                {[
                                    { label: "TOTAL_NODES", value: nodes.length, color: "blue" },
                                    { label: "PENDING_APPROVAL", value: pending.length, color: "amber" },
                                    { label: "APPROVED_GRID", value: approved.length, color: "emerald" },
                                    { label: "REJECTED_LIST", value: rejected.length, color: "red" },
                                ].map((s, i) => (
                                    <div key={i} className="bg-[#09090b] border-2 border-[#27272a] p-4 md:p-6 shadow-[4px_4px_0px_0px_#1a1a1a]">
                                        <div className={`text-2xl md:text-3xl font-black text-white mb-1`}>{s.value}</div>
                                        <div className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest text-${s.color}-500`}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Search + Bulk Actions */}
                        <div className="animate-reveal mb-10 flex flex-col gap-6" style={{ animationDelay: "100ms" }}>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex items-center gap-3 flex-1 bg-[#09090b] border-2 border-[#27272a] px-4 py-4 focus-within:border-blue-500 transition-all shadow-[4px_4px_0px_0px_#000]">
                                    <Search size={18} className="text-[#52525b] shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="SEARCH BY IDENTIFIER, HOST, OR OPERATOR..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent outline-none text-white font-black uppercase tracking-widest placeholder-[#52525b] w-full text-xs md:text-sm"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery("")} className="text-[#52525b] hover:text-white transition-colors">
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="bg-[#09090b] border-2 border-[#27272a] text-[#a1a1aa] px-4 py-4 font-black uppercase tracking-widest text-xs outline-none focus:border-white transition-all cursor-pointer"
                                    >
                                        <option value="newest">SORT: NEWEST</option>
                                        <option value="oldest">SORT: OLDEST</option>
                                        <option value="name">SORT: NAME</option>
                                        <option value="host">SORT: HOST</option>
                                    </select>
                                    <button
                                        onClick={() => fetchAllNodes()}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-[#09090b] border-2 border-[#27272a] text-[#a1a1aa] hover:border-white hover:text-white px-6 py-4 font-black uppercase tracking-widest text-xs transition-all"
                                    >
                                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                                        <span className="hidden sm:inline">REFRESH</span>
                                    </button>
                                </div>
                            </div>

                            {selectedIds.size > 0 && (
                                <div className="flex flex-wrap items-center gap-4 p-4 bg-blue-500/5 border-2 border-blue-500/20 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                        {selectedIds.size} NODES_SELECTED_FOR_BULK_ACTION
                                    </span>
                                    <div className="flex items-center gap-2 ml-auto">
                                        <button
                                            onClick={handleBulkApprove}
                                            className="px-4 py-2 bg-emerald-500 border-2 border-emerald-500 text-black font-black uppercase tracking-widest text-[10px] hover:bg-white hover:border-white transition-all shadow-[2px_2px_0px_0px_#000]"
                                        >
                                            APPROVE_SELECTION
                                        </button>
                                        <button
                                            onClick={handleBulkReject}
                                            className="px-4 py-2 bg-amber-500 border-2 border-amber-500 text-black font-black uppercase tracking-widest text-[10px] hover:bg-white hover:border-white transition-all shadow-[2px_2px_0px_0px_#000]"
                                        >
                                            REJECT_SELECTION
                                        </button>
                                        <button
                                            onClick={handleBulkDelete}
                                            className="px-4 py-2 bg-red-500 border-2 border-red-500 text-black font-black uppercase tracking-widest text-[10px] hover:bg-white hover:border-white transition-all shadow-[2px_2px_0px_0px_#000]"
                                        >
                                            PURGE_SELECTION
                                        </button>
                                        <button
                                            onClick={() => setSelectedIds(new Set())}
                                            className="px-4 py-2 bg-transparent border-2 border-[#27272a] text-[#a1a1aa] font-black uppercase tracking-widest text-[10px] hover:border-white hover:text-white transition-all"
                                        >
                                            CLEAR
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {loading && nodes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-40 gap-6 border-2 border-[#27272a] bg-[#09090b] shadow-[8px_8px_0px_0px_#000]">
                                <div className="relative">
                                    <Loader2 size={64} className="animate-spin text-blue-500" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white animate-pulse" />
                                    </div>
                                </div>
                                <span className="text-white font-black tracking-widest uppercase text-xl animate-pulse">INIT_DATABASE_SYNC...</span>
                            </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 border-2 border-red-500 bg-red-950/20 shadow-[8px_8px_0px_0px_#000]">
                            <AlertCircle size={40} className="text-red-500" />
                            <span className="text-red-400 font-black tracking-widest uppercase">{error}</span>
                            <button onClick={() => fetchAllNodes()} className="mt-4 px-6 py-2 border-2 border-red-500 text-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-black transition-all">RETRY_CONNECTION</button>
                        </div>
                    ) : (
                        <div className="space-y-24">
                            <NodeSection
                                title="INCOMING_VERIFICATION_QUEUE"
                                count={pending.length}
                                nodes={pending}
                                accentClass="bg-amber-500"
                                icon={<AlertCircle size={20} />}
                                delay="150ms"
                                selectedIds={selectedIds}
                                toggleSelect={toggleSelect}
                                actionLoading={actionLoading}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                onDelete={handleDelete}
                                onEdit={setEditingNode}
                                onOpenStatus={setStatusNode}
                                emptyMsg="VERIFICATION_QUEUE_CLEAR."
                                showApprove
                                showReject
                            />
                            <NodeSection
                                title="ACTIVE_GRID_INFRASTRUCTURE"
                                count={approved.length}
                                nodes={approved}
                                accentClass="bg-emerald-500"
                                icon={<Check size={20} />}
                                delay="250ms"
                                selectedIds={selectedIds}
                                toggleSelect={toggleSelect}
                                actionLoading={actionLoading}
                                onDelete={handleDelete}
                                onEdit={setEditingNode}
                                onOpenStatus={setStatusNode}
                                emptyMsg="NO_ACTIVE_INFRASTRUCTURE_FOUND."
                            />
                            <NodeSection
                                title="REJECTED_ARCHIVE"
                                count={rejected.length}
                                nodes={rejected}
                                accentClass="bg-red-500"
                                icon={<Ban size={20} />}
                                delay="350ms"
                                selectedIds={selectedIds}
                                toggleSelect={toggleSelect}
                                actionLoading={actionLoading}
                                onApprove={handleApprove}
                                onDelete={handleDelete}
                                onEdit={setEditingNode}
                                onOpenStatus={setStatusNode}
                                emptyMsg="REJECTION_ARCHIVE_EMPTY."
                                showApprove
                            />
                        </div>
                    )}
                </>
            ) : activeTab === "users" ? (
                <div className="space-y-12 animate-reveal">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">USERS_REGISTRY</h2>
                            <p className="text-[#a1a1aa] font-black uppercase tracking-widest text-[10px]">MANAGE_OPERATORS_AND_PERMISSIONS</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1 md:min-w-[300px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#52525b]" size={16} />
                                <input
                                    type="text"
                                    placeholder="SEARCH_BY_NAME_OR_ID..."
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className="w-full bg-[#000] border-2 border-[#27272a] pl-12 pr-4 py-3 text-white text-xs font-black uppercase outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {userLoading ? (
                        <div className="py-20 text-center border-2 border-[#27272a] bg-[#09090b]">
                            <Loader2 size={40} className="animate-spin text-blue-500 mx-auto mb-4" />
                            <span className="text-[#52525b] font-black uppercase tracking-widest text-xs">QUERYING_USER_DATABASE...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {users.filter(u => u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u._id.includes(userSearch) || u.discordId?.includes(userSearch)).map(user => (
                                <div key={user._id} className="bg-[#09090b] border-2 border-[#27272a] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-[#52525b] transition-colors shadow-[4px_4px_0px_0px_#1a1a1a]">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-16 h-16 flex items-center justify-center border-2 ${user.isBanned ? 'border-red-500 bg-red-500/10' : 'border-blue-500 bg-blue-500/10'}`}>
                                            {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : <User size={24} className={user.isBanned ? 'text-red-500' : 'text-blue-500'} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-lg font-black text-white uppercase">{user.name || "UNNAMED_OPERATOR"}</span>
                                                {user.isBanned && <span className="bg-red-500 text-black text-[8px] font-black px-2 py-0.5 uppercase">BANNED</span>}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-black text-[#52525b] uppercase tracking-widest">
                                                <div className="flex items-center gap-1"><Hash size={12} /> {user._id}</div>
                                                <div className="flex items-center gap-1"><Server size={12} /> {user.nodeCount} NODES</div>
                                                {user.discordId && <div className="flex items-center gap-1 text-blue-400"><Tag size={12} /> {user.discordId}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <Link 
                                            href={`/profile/${user._id}`}
                                            className="flex-1 md:flex-none px-4 py-2 border-2 border-[#27272a] text-[#a1a1aa] text-[10px] font-black uppercase tracking-widest hover:border-white hover:text-white transition-all text-center"
                                        >
                                            PROFILE
                                        </Link>
                                        <button
                                            onClick={() => handleBanUser(user._id, user.isBanned)}
                                            className={`flex-1 md:flex-none px-4 py-2 border-2 text-[10px] font-black uppercase tracking-widest transition-all ${user.isBanned ? 'border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-black'}`}
                                        >
                                            {user.isBanned ? "REVOKE_BAN" : "EXECUTE_BAN"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {users.length === 0 && (
                                <div className="py-20 text-center border-2 border-dashed border-[#27272a] text-[#52525b] font-black uppercase tracking-widest">
                                    NO_OPERATORS_FOUND_IN_SYSTEM
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                    <div className="space-y-12 animate-reveal">
                        <div className="bg-[#09090b] border-2 border-[#27272a] p-8 shadow-[8px_8px_0px_0px_#1a1a1a]">
                            <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-6 flex items-center gap-3">
                                <Plus size={20} className="text-blue-500" /> DEPLOY_NEW_PROMOTION
                            </h3>
                            <form onSubmit={handleAddPromo} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-[#52525b] uppercase tracking-widest mb-2">Content / Message</label>
                                    <textarea
                                        required
                                        value={newPromo.content}
                                        onChange={(e) => setNewPromo({ ...newPromo, content: e.target.value })}
                                        className="w-full bg-[#000] border-2 border-[#27272a] p-4 text-white text-xs font-black uppercase outline-none focus:border-blue-500 min-h-[100px] resize-none"
                                        placeholder="SYSTEM_MESSAGE_OR_AD_DESCRIPTION..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[#52525b] uppercase tracking-widest mb-2">Title (For Ad Cards)</label>
                                    <input
                                        type="text"
                                        value={newPromo.title}
                                        onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                                        className="w-full bg-[#000] border-2 border-[#27272a] p-4 text-white text-xs font-black uppercase outline-none focus:border-blue-500"
                                        placeholder="PROMO_HEADING..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[#52525b] uppercase tracking-widest mb-2">Link URL</label>
                                    <input
                                        type="url"
                                        value={newPromo.link}
                                        onChange={(e) => setNewPromo({ ...newPromo, link: e.target.value })}
                                        className="w-full bg-[#000] border-2 border-[#27272a] p-4 text-white text-xs font-black uppercase outline-none focus:border-blue-500"
                                        placeholder="HTTPS://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[#52525b] uppercase tracking-widest mb-2">Type</label>
                                    <select
                                        value={newPromo.type}
                                        onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                                        className="w-full bg-[#000] border-2 border-[#27272a] p-4 text-white text-xs font-black uppercase outline-none focus:border-blue-500"
                                    >
                                        <option value="announcement">TOP_ANNOUNCEMENT_BAR</option>
                                        <option value="ad">IN_PAGE_AD_CARD</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-blue-500 border-2 border-blue-500 text-black font-black uppercase tracking-widest text-sm hover:bg-white hover:border-white transition-all shadow-[4px_4px_0px_0px_#f4f4f5]"
                                    >
                                        EXECUTE_DEPLOYMENT
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-6">ACTIVE_REGISTRY</h3>
                            {promotions.length === 0 ? (
                                <div className="py-20 text-center border-2 border-dashed border-[#27272a] text-[#52525b] font-black uppercase tracking-[0.3em]">
                                    NO_ACTIVE_PROMOTIONS_FOUND
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {promotions.map((promo) => (
                                        <div key={promo._id} className="bg-[#09090b] border-2 border-[#27272a] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-white transition-colors">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-12 h-12 flex items-center justify-center border-2 ${promo.type === 'announcement' ? 'border-amber-500 text-amber-500' : 'border-blue-500 text-blue-500'}`}>
                                                    {promo.type === 'announcement' ? <Megaphone size={20} /> : <Tag size={20} />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-xs font-black text-white uppercase">{promo.title || "UNTITLED_PROMO"}</span>
                                                        <span className="text-[8px] font-black px-2 py-0.5 border border-[#27272a] text-[#52525b] uppercase tracking-widest">{promo.type}</span>
                                                    </div>
                                                    <p className="text-[10px] text-[#a1a1aa] uppercase tracking-wide truncate max-w-md">{promo.content}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeletePromo(promo._id)}
                                                className="px-4 py-2 border-2 border-red-500 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all"
                                            >
                                                TERMINATE
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <NodeStatusDialog
                nodeData={statusNode}
                onClose={() => setStatusNode(null)}
            />

            <Footer />
        </div>
    );
}

// ─── Node Section ─────────────────────────────────────────────────────────────

function NodeSection({ title, count, nodes, accentClass, icon, delay, selectedIds, toggleSelect, actionLoading, onApprove, onReject, onDelete, onEdit, onOpenStatus, emptyMsg, showApprove, showReject }) {
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
                            onApprove={onApprove ? () => onApprove(node) : undefined}
                            onReject={onReject ? () => onReject(node) : undefined}
                            onDelete={() => onDelete(node)}
                            onEdit={() => onEdit(node)}
                            onOpenStatus={onOpenStatus}
                        />
                    );
                })}
            </div>
        </section>
    );
}

function AdminNodeCard({ node, selected, onToggleSelect, loading, onApprove, onReject, onDelete, onEdit, onOpenStatus }) {
    const [expanded, setExpanded] = useState(false);
    const [pinging, setPinging] = useState(false);
    const [pingResult, setPingResult] = useState(null);

    const handleStatusCheck = async (e) => {
        e.stopPropagation();
        setPinging(true);
        setPingResult(null);
        try {
            const res = await fetch("/api/admin/ping", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    host: node.host,
                    port: node.port,
                    password: node.password,
                    secure: node.secure,
                    restVersion: node.restVersion
                })
            });
            const data = await res.json();
            if (data.ok) {
                setPingResult("ONLINE");
                onOpenStatus({ node, data: data.data });
            } else {
                setPingResult(`OFFLINE (${data.status || 'ERR'})`);
            }
        } catch (err) {
            setPingResult("UNREACHABLE");
        } finally {
            setPinging(false);
            setTimeout(() => setPingResult(null), 5000);
        }
    };

    return (
        <div className={`bg-[#09090b] border-2 transition-all duration-300 shadow-[4px_4px_0px_0px_#27272a] ${selected ? "border-blue-500 shadow-[6px_6px_0px_0px_#3b82f6] -translate-y-0.5" : "border-[#27272a] hover:border-[#52525b] hover:shadow-[6px_6px_0px_0px_#1a1a1a]"}`}>
            <div className="p-4 md:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Checkbox + Info */}
                <div className="flex items-start gap-4 flex-1 w-full min-w-0">
                    <button
                        onClick={onToggleSelect}
                        className="mt-1 text-[#52525b] hover:text-blue-500 transition-colors shrink-0"
                    >
                        {selected ? <CheckSquare size={20} className="text-blue-500" /> : <Square size={20} />}
                    </button>

                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#000000] border-2 border-[#27272a] flex items-center justify-center shrink-0 relative overflow-hidden group">
                        <Server size={24} className="text-[#a1a1aa] group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="text-lg md:text-xl font-black text-white uppercase tracking-tighter truncate">{node.identifier}</div>
                            {pingResult && (
                                <span className={`text-[10px] font-black px-2 py-0.5 border-2 animate-in zoom-in duration-300 ${pingResult === 'ONLINE' ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-red-500 border-red-500 text-white'}`}>
                                    {pingResult}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-black text-[#52525b] uppercase tracking-widest">
                            <div className="flex items-center gap-2 truncate">
                                <Hash size={14} className="shrink-0" />
                                <span className="truncate">{node.host}:{node.port}</span>
                            </div>
                            <div className="hidden sm:block w-1 h-1 bg-[#27272a]" />
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="shrink-0" />
                                <span>{node.createdAt ? new Date(node.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-2 ${node.secure ? "border-emerald-500/50 text-emerald-500" : "border-[#27272a] text-[#52525b]"}`}>
                                {node.secure ? "SECURE_WSS" : "INSECURE_WS"}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-2 border-blue-500/50 text-blue-500">
                                {node.restVersion}
                            </span>
                            {node.ownerId && (
                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-2 border-purple-500/50 text-purple-500 bg-purple-500/5" title={`Discord ID: ${node.ownerId}`}>
                                    OWNER_LINKED
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto border-t-2 lg:border-t-0 border-[#27272a] pt-4 lg:pt-0">
                    <div className="hidden xl:flex flex-col gap-1 min-w-[120px]">
                        <div className="text-[9px] text-[#52525b] font-black uppercase tracking-widest">OPERATOR</div>
                        {node.ownerId ? (
                            <Link
                                href={`/profile/${node.ownerId}`}
                                className="text-xs text-white font-black uppercase truncate max-w-[120px] hover:text-blue-500 transition-colors cursor-pointer"
                            >
                                {node.authorId}
                            </Link>
                        ) : (
                            <div className="text-xs text-[#52525b] font-black uppercase truncate max-w-[120px]">{node.authorId}</div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
                        {onApprove && (
                            <button
                                onClick={onApprove}
                                disabled={!!loading}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 border-2 border-emerald-500 text-black font-black uppercase tracking-widest text-xs transition-all hover:bg-white hover:border-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#10b981] disabled:opacity-50"
                            >
                                {loading === "approve" ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                <span className="hidden md:inline">APPROVE</span>
                            </button>
                        )}
                        {onReject && (
                            <button
                                onClick={onReject}
                                disabled={!!loading}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 border-2 border-amber-500 text-black font-black uppercase tracking-widest text-xs transition-all hover:bg-white hover:border-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#f59e0b] disabled:opacity-50"
                            >
                                {loading === "reject" ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                                <span className="hidden md:inline">REJECT</span>
                            </button>
                        )}

                        <button
                            onClick={handleStatusCheck}
                            disabled={pinging}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[#09090b] border-2 border-blue-500 text-blue-500 font-black uppercase tracking-widest text-xs transition-all hover:bg-blue-500 hover:text-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#3b82f6] disabled:opacity-50"
                            title="Check full status"
                        >
                            {pinging ? <Loader2 size={14} className="animate-spin" /> : <Activity size={14} />}
                            <span className="hidden md:inline">STATUS</span>
                        </button>

                        <button
                            onClick={onEdit}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[#09090b] border-2 border-[#52525b] text-white font-black uppercase tracking-widest text-xs transition-all hover:bg-white hover:text-black hover:border-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#f4f4f5]"
                        >
                            <Edit2 size={14} />
                            <span className="hidden md:inline">EDIT</span>
                        </button>

                        <button
                            onClick={async () => {
                                const newId = prompt("Enter New Owner MongoDB ID or Discord ID:", node.ownerId || "");
                                if (!newId || newId === node.ownerId) return;

                                try {
                                    const res = await fetch("/api/admin/nodes/transfer", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "x-admin-password": sessionStorage.getItem("admin_password") || ""
                                        },
                                        body: JSON.stringify({ nodeId: node._id, newOwnerId: newId })
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                        alert("Transfer protocol complete. Operator updated.");
                                        window.location.reload();
                                    } else {
                                        alert("PROTOCOL_ERROR: " + data.error);
                                    }
                                } catch (e) {
                                    alert("SYSTEM_CRITICAL: " + e.message);
                                }
                            }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/10 border-2 border-purple-500 text-purple-500 font-black uppercase tracking-widest text-xs transition-all hover:bg-purple-500 hover:text-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#a855f7]"
                            title="Transfer Ownership"
                        >
                            <User size={14} />
                            <span className="hidden md:inline">TRANSFER</span>
                        </button>
                        <button
                            onClick={async () => {
                                try {
                                    const res = await fetch("/api/nodes", {
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "X-Admin-Password": sessionStorage.getItem("admin_password") || ""
                                        },
                                        body: JSON.stringify({ _id: node._id, isPinned: !node.isPinned })
                                    });
                                    if (res.ok) {
                                        window.location.reload();
                                    } else {
                                        const data = await res.json();
                                        alert("PIN_ERROR: " + data.error);
                                    }
                                } catch (e) {
                                    alert(e.message);
                                }
                            }}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 border-2 font-black uppercase tracking-widest text-xs transition-all hover:-translate-y-1 hover:-translate-x-1 ${node.isPinned ? 'bg-amber-500 border-amber-500 text-black shadow-[4px_4px_0px_0px_#000]' : 'bg-[#09090b] border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-black hover:shadow-[4px_4px_0px_0px_#f59e0b]'}`}
                            title={node.isPinned ? "Unpin from top" : "Pin to top"}
                        >
                            <Zap size={14} fill={node.isPinned ? "currentColor" : "none"} />
                            <span className="hidden md:inline">{node.isPinned ? "PINNED" : "PIN"}</span>
                        </button>
                        <button
                            onClick={onDelete}
                            disabled={!!loading}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[#000000] border-2 border-red-500 text-red-500 font-black uppercase tracking-widest text-xs transition-all hover:bg-red-500 hover:text-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#ef4444] disabled:opacity-50"
                        >
                            {loading === "delete" ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            <span className="hidden md:inline">PURGE</span>
                        </button>
                        <button
                            onClick={() => setExpanded(p => !p)}
                            className={`flex items-center justify-center gap-2 px-3 py-3 border-2 border-[#27272a] text-[#52525b] hover:border-white hover:text-white transition-all ${expanded ? 'bg-[#1a1a1a] text-white' : ''}`}
                        >
                            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded detail */}
            {expanded && (
                <div className="border-t-2 border-[#27272a] bg-[#000000]/50 px-6 py-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
                        {[
                            { label: "TARGET_HOST", value: node.host },
                            { label: "TARGET_PORT", value: node.port },
                            { label: "CURRENT_STATUS", value: node.status?.toUpperCase(), color: node.status === 'approved' ? 'text-emerald-500' : node.status === 'pending' ? 'text-amber-500' : 'text-red-500' },
                            { label: "SECURITY_LAYER", value: node.secure ? "SSL_ENABLED" : "SSL_DISABLED" },
                            { label: "CORE_VERSION", value: node.restVersion },
                            { label: "OPERATOR_NAME", value: node.authorId },
                            { label: "OWNER_DISCORD_ID", value: node.ownerId || "NOT_LINKED" },
                            { label: "REGISTRATION_DATE", value: node.createdAt ? new Date(node.createdAt).toLocaleString() : "—" },
                            { label: "LAST_MODIFIED", value: node.updatedAt ? new Date(node.updatedAt).toLocaleString() : "—" },
                            { label: "WEBSITE_URL", value: node.website || "NOT_PROVIDED" },
                            { label: "DISCORD_INVITE", value: node.discord || "NOT_PROVIDED" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="flex flex-col gap-1">
                                <div className="text-[10px] text-[#52525b] font-black uppercase tracking-widest">{label}</div>
                                <div className={`text-xs font-black uppercase truncate ${color || 'text-white'}`}>{value ?? "—"}</div>
                            </div>
                        ))}
                    </div>
                    {node.reason && (
                        <div className="mt-6 p-4 bg-red-500/5 border border-red-500/20">
                            <div className="text-[10px] text-red-500/50 font-black uppercase tracking-widest mb-1">REJECTION_REASON</div>
                            <div className="text-xs text-red-400 font-black uppercase italic tracking-wide">{node.reason}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

            // ─── Password Field ───────────────────────────────────────────────────────────

            function PasswordField({value, onChange}) {
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
