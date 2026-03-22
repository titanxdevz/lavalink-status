"use client";
import { Activity, Wifi, ChevronRight } from "lucide-react";

export function NodeCard({ node, onClick, minimal = false }) {
    const online = node.isConnected;

    return (
        <div
            onClick={onClick ? () => onClick(node) : undefined}
            className={`
                relative group flex flex-col cursor-pointer transition-all font-mono
                bg-[#09090b] border-2 border-[#27272a]
                hover:-translate-y-1 hover:-translate-x-1 hover:border-white hover:shadow-[6px_6px_0px_0px_#3b82f6]
                ${minimal ? 'h-32' : 'h-full'}
            `}
        >
            <div className={`h-2 w-full border-b-2 border-[#27272a] transition-colors ${online ? 'bg-emerald-500' : 'bg-red-500 group-hover:bg-red-400'}`} />

            <div className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6 gap-4">
                    <div className="flex flex-col gap-3 overflow-hidden">
                        <div className={`self-start inline-flex items-center px-3 py-1 border-2 border-[#27272a] text-[10px] font-black uppercase tracking-widest transition-colors ${online ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                            {online ? 'ONLINE' : 'OFFLINE'}
                        </div>
                        <h3 className="font-black text-xl uppercase tracking-tighter text-white truncate w-full group-hover:text-blue-500 transition-colors">
                            {node.identifier}
                        </h3>
                    </div>
                    <div className="shrink-0 text-xs font-black uppercase tracking-widest text-[#a1a1aa] border-2 border-[#27272a] px-3 py-1 bg-[#000000]">
                        {node.restVersion || 'V4'}
                    </div>
                </div>

                {!minimal && (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-6 border-y-2 border-[#27272a] py-4 bg-[#000000]/50 px-4 -mx-6">
                            <StatItem
                                icon={Activity}
                                label="LOAD"
                                value={node.systemLoad || '0%'}
                                color="text-red-500"
                            />
                            <StatItem
                                icon={Wifi}
                                label="PLAYERS"
                                value={node.connections?.split('/')[0] || '0'}
                                color="text-blue-500"
                            />
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 border-2 border-[#27272a] bg-[#000000] flex items-center justify-center text-sm font-black text-white group-hover:border-blue-500 transition-colors">
                                    {node.authorId?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-[#52525b] font-black">PROVIDER</span>
                                    <span className="text-sm font-black text-white uppercase truncate max-w-[120px]">
                                        {node.authorId || 'UNKNOWN'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-2 border-2 border-[#27272a] bg-[#000000] text-[#a1a1aa] group-hover:bg-blue-500 group-hover:text-black group-hover:border-blue-500 transition-all">
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    </>
                )}

                {minimal && (
                    <div className="mt-auto flex items-center justify-between text-[#a1a1aa] pt-4 border-t-2 border-[#27272a]">
                        <span className="text-xs font-black uppercase tracking-widest truncate max-w-[200px]">{node.host}</span>
                        <div className="p-1 border-2 border-[#27272a] group-hover:bg-white group-hover:text-black transition-colors">
                            <ChevronRight size={14} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatItem({ icon: Icon, label, value, color }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Icon size={14} className="text-[#52525b]" />
                <span className="text-[10px] uppercase tracking-widest font-black text-[#a1a1aa]">{label}</span>
            </div>
            <span className={`text-xl font-black tabular-nums tracking-tighter ${color}`}>{value}</span>
        </div>
    );
}