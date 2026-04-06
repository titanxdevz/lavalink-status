"use client";
import { useState } from "react";
import { NodeCard } from "@/components/NodeCard";
import { NodeDetailsDialog } from "@/components/NodeDetailsDialog";
import { RefreshCw, Loader2, ArrowLeft } from "lucide-react";
import { useNodes } from "@/contexts/NodesContext";
import Link from "next/link";

export function NodeList({ filterSecure, title, description, icon }) {
    const { nodes, loading, fetchNodes, lastFetch } = useNodes();
    const [selectedNode, setSelectedNode] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const filtered = nodes
        .filter(n => n.secure === filterSecure)
        .sort((a, b) => {
            if (a.isConnected !== b.isConnected) return a.isConnected ? -1 : 1;
            return (b.uptimeMillis || 0) - (a.uptimeMillis || 0);
        });

    const online = filtered.filter(n => n.isConnected);
    const offline = filtered.filter(n => !n.isConnected);

    const formatAge = () => {
        if (!lastFetch) return "Never";
        const s = Math.floor((Date.now() - lastFetch) / 1000);
        if (s < 60) return `${s}s ago`;
        const m = Math.floor(s / 60);
        if (m < 60) return `${m}m ago`;
        return `${Math.floor(m / 60)}h ago`;
    };

    const handleClick = (node) => {
        setSelectedNode(node);
        setDialogOpen(true);
    };

    return (
        <>
            <NodeDetailsDialog node={selectedNode} open={dialogOpen} onOpenChange={setDialogOpen} />

            <main className="min-h-screen bg-[#050505] text-white pt-24 pb-40">
                <div className="container mx-auto px-6 max-w-6xl">
                    
                    <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-sm group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                    </Link>

                    <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-16">
                        <div className="max-w-xl">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 flex items-center gap-4">
                                <span className="p-3 bg-white/5 rounded-2xl border border-white/10">{icon}</span>
                                {title}
                            </h1>
                            <p className="text-white/40 text-lg leading-relaxed">
                                {description}
                            </p>
                        </div>

                        <button 
                            onClick={() => fetchNodes(true)} 
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all font-bold text-sm"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                            {loading ? "Refreshing..." : "Refresh Status"}
                        </button>
                    </div>

                    <div className="flex items-center gap-8 mb-12 pb-8 border-b border-white/5 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-white/40 font-medium">Online:</span>
                            <span className="font-bold tabular-nums">{loading ? "—" : online.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-white/40 font-medium">Offline:</span>
                            <span className="font-bold tabular-nums">{loading ? "—" : offline.length}</span>
                        </div>
                        <div className="ml-auto text-white/20 text-xs">
                            Last sync: {formatAge()}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4">
                            <Loader2 size={40} className="animate-spin text-white/10" />
                            <span className="text-white/20 font-medium tracking-widest uppercase text-[10px]">Fetching Live Status</span>
                        </div>
                    ) : (
                        <div className="space-y-20">
                            {online.length > 0 && (
                                <section>
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-8 flex items-center gap-3">
                                        <div className="w-8 h-[1px] bg-emerald-500/30" />
                                        Verified Online Nodes
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                                        {online.map(n => (
                                            <NodeCard key={`on-${n.identifier}`} node={n} onClick={handleClick} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {offline.length > 0 && (
                                <section>
                                     <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-8 flex items-center gap-3">
                                        <div className="w-8 h-[1px] bg-red-500/30" />
                                        Currently Offline
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 opacity-60">
                                        {offline.map(n => (
                                            <NodeCard key={`off-${n.identifier}`} node={n} onClick={handleClick} minimal={true} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {filtered.length === 0 && (
                                <div className="text-center py-40 glass-card rounded-3xl border-dashed">
                                    <p className="text-white/20 font-medium italic">No nodes found in this category.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}