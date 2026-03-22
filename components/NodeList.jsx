"use client";
import { useState } from "react";
import { NodeCard } from "@/components/NodeCard";
import { NodeDetailsDialog } from "@/components/NodeDetailsDialog";
import { RefreshCw, Loader2, ArrowLeft, Terminal } from "lucide-react";
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
        if (!lastFetch) return "NEVER";
        const s = Math.floor((Date.now() - lastFetch) / 1000);
        if (s < 60) return `${s}S AGO`;
        const m = Math.floor(s / 60);
        if (m < 60) return `${m}M AGO`;
        return `${Math.floor(m / 60)}H AGO`;
    };

    const handleClick = (node) => {
        setSelectedNode(node);
        setDialogOpen(true);
    };

    return (
        <>
            <NodeDetailsDialog node={selectedNode} open={dialogOpen} onOpenChange={setDialogOpen} />

            <main className="min-h-screen bg-[#000000] text-[#f4f4f5] font-mono selection:bg-blue-500 selection:text-white pt-24 pb-40 relative overflow-x-hidden">

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
                    @keyframes slideRight {
                        from { opacity: 0; transform: translateX(-40px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    .animate-reveal { animation: revealUp 0.6s cubic-bezier(0, 0, 0.2, 1) forwards; opacity: 0; }
                    .animate-slide { animation: slideRight 0.6s cubic-bezier(0, 0, 0.2, 1) forwards; opacity: 0; }
                `}</style>

                <div className="container mx-auto px-6 max-w-7xl relative z-10">

                    <Link
                        href="/"
                        className="animate-slide inline-flex items-center gap-3 text-[#a1a1aa] font-black uppercase tracking-widest hover:text-white transition-colors mb-12 group bg-[#09090b] border-2 border-[#27272a] hover:border-white px-4 py-2"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        BACK TO GRID
                    </Link>

                    <div className="animate-reveal flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 mb-16 pb-12 border-b-2 border-[#27272a]">
                        <div className="max-w-3xl">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                                <div className="w-16 h-16 bg-blue-500 text-black flex items-center justify-center border-2 border-transparent shadow-[4px_4px_0px_0px_#f4f4f5]">
                                    {icon}
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-white">
                                    {title}
                                </h1>
                            </div>
                            <p className="text-[#a1a1aa] text-xl font-medium leading-relaxed uppercase tracking-wide">
                                {description}
                            </p>
                        </div>

                        <button
                            onClick={() => fetchNodes(true)}
                            disabled={loading}
                            className={`flex items-center gap-3 px-8 py-5 border-2 font-black tracking-widest uppercase transition-all shadow-[4px_4px_0px_0px] ${loading
                                    ? 'bg-[#27272a] border-[#52525b] text-[#a1a1aa] shadow-[#52525b]'
                                    : 'bg-[#09090b] border-[#27272a] text-white hover:border-blue-500 hover:text-blue-500 shadow-[#27272a] hover:shadow-blue-500 hover:-translate-y-1 hover:-translate-x-1'
                                }`}
                        >
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                            {loading ? "SYNCING..." : "SYNC GRID"}
                        </button>
                    </div>

                    <div className="animate-reveal flex flex-wrap items-center gap-6 mb-20" style={{ animationDelay: '100ms' }}>
                        <div className="flex items-center gap-4 border-2 border-[#27272a] bg-[#09090b] px-6 py-4 flex-1 sm:flex-none">
                            <div className="w-3 h-3 bg-emerald-500" />
                            <span className="text-sm font-black uppercase tracking-widest text-[#a1a1aa]">ONLINE</span>
                            <span className="text-2xl font-black text-white tabular-nums">{loading ? "—" : online.length}</span>
                        </div>
                        <div className="flex items-center gap-4 border-2 border-[#27272a] bg-[#09090b] px-6 py-4 flex-1 sm:flex-none">
                            <div className="w-3 h-3 bg-red-500" />
                            <span className="text-sm font-black uppercase tracking-widest text-[#a1a1aa]">OFFLINE</span>
                            <span className="text-2xl font-black text-white tabular-nums">{loading ? "—" : offline.length}</span>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-4 ml-auto w-full sm:w-auto border-2 border-transparent border-t-[#27272a] sm:border-none">
                            <Terminal size={16} className="text-[#52525b]" />
                            <span className="text-sm font-black uppercase tracking-widest text-[#52525b]">
                                LAST SYNC: {formatAge()}
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-6 border-2 border-[#27272a] bg-[#09090b] animate-pulse">
                            <Loader2 size={48} className="animate-spin text-blue-500" />
                            <span className="text-white font-black tracking-widest uppercase text-xl">ESTABLISHING CONNECTION...</span>
                        </div>
                    ) : (
                        <div className="space-y-32">
                            {online.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-16 h-2 bg-emerald-500" />
                                        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
                                            VERIFIED ONLINE
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {online.map((n, i) => (
                                            <div key={`on-${n.identifier}`} className="animate-reveal" style={{ animationDelay: `${(i % 10) * 50}ms` }}>
                                                <NodeCard node={n} onClick={handleClick} />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {offline.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-16 h-2 bg-red-500" />
                                        <h2 className="text-3xl font-black uppercase tracking-tighter text-[#a1a1aa]">
                                            UNREACHABLE
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-60 hover:opacity-100 transition-opacity">
                                        {offline.map((n, i) => (
                                            <div key={`off-${n.identifier}`} className="animate-reveal" style={{ animationDelay: `${(i % 10) * 50}ms` }}>
                                                <NodeCard node={n} onClick={handleClick} minimal={true} />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {filtered.length === 0 && (
                                <div className="text-center py-40 bg-[#09090b] border-2 border-dashed border-[#52525b] flex flex-col items-center justify-center gap-6">
                                    <Terminal size={48} className="text-[#52525b]" />
                                    <p className="text-[#a1a1aa] font-black uppercase tracking-widest text-xl">NO NODES MATCHING CRITERIA.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}