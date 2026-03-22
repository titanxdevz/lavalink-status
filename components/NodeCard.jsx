"use client";
import {
    Server, Cpu, HardDrive, Activity, Clock,
    Wifi, Tag, Coffee, Music, Plug, Disc, Hourglass,
    ChevronRight, ExternalLink
} from "lucide-react";

export function NodeCard({ node, onClick, minimal = false }) {
    const online = node.isConnected;

    return (
        <div
            onClick={onClick ? () => onClick(node) : undefined}
            className={`
                relative group overflow-hidden transition-all duration-300
                bg-white/[0.02] border border-white/[0.08] hover:border-white/20
                hover:bg-white/[0.04] p-6 cursor-pointer
                ${minimal ? 'h-32' : 'h-auto'}
            `}
        >
            {/* Status accent line */}
            <div className={`absolute top-0 left-0 bottom-0 w-[2px] transition-all duration-300 ${online ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-red-500 opacity-50'}`} />

            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                           <span className={`text-[10px] font-bold uppercase tracking-widest ${online ? 'text-emerald-500' : 'text-red-500'}`}>
                                {online ? 'Active' : 'Offline'}
                           </span>
                        </div>
                        <h3 className="font-bold text-lg tracking-tight group-hover:text-blue-400 transition-colors line-clamp-1">
                            {node.identifier}
                        </h3>
                    </div>
                    <div className="text-[10px] text-white/30 font-medium bg-white/5 px-2 py-1 rounded">
                        {node.restVersion || 'v4'}
                    </div>
                </div>

                {!minimal && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <StatItem 
                                icon={Activity} 
                                label="Load" 
                                value={node.systemLoad} 
                                color="text-red-400" 
                            />
                            <StatItem 
                                icon={Wifi} 
                                label="Players" 
                                value={node.connections?.split('/')[0] || 0} 
                                color="text-blue-400" 
                            />
                        </div>

                        {/* Footer Info */}
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold">
                                    {node.authorId?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-tighter text-white/30 font-bold">Provider</span>
                                    <span className="text-xs font-semibold">{node.authorId || 'Unknown'}</span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                    </>
                )}

                {minimal && (
                    <div className="mt-auto flex items-center justify-between text-white/20">
                         <span className="text-xs font-mono">{node.host}</span>
                         <ChevronRight size={14} />
                    </div>
                )}
            </div>
        </div>
    );
}

function StatItem({ icon: Icon, label, value, color }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
                <Icon size={12} className="text-white/20" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">{label}</span>
            </div>
            <span className={`text-sm font-bold tabular-nums ${color}`}>{value}</span>
        </div>
    );
}