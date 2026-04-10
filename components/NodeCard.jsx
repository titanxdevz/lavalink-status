"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { 
    Activity, 
    Wifi, 
    ChevronRight, 
    Server, 
    Cpu, 
    Database, 
    HardDrive, 
    Clock, 
    ShieldCheck, 
    ShieldAlert,
    Copy,
    Check,
    Globe,
    Terminal,
    Layers,
    Music,
    Zap,
    AlertTriangle,
    PlayCircle
} from "lucide-react";

const generateSparklineData = (seedStr, count = 20) => {
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
        seed += seedStr.charCodeAt(i);
    }
    const data = [];
    let current = 50;
    for (let i = 0; i < count; i++) {
        const random = Math.sin(seed + i) * 10000;
        const change = (random - Math.floor(random)) * 20 - 10;
        current = Math.max(10, Math.min(90, current + change));
        data.push(current);
    }
    return data;
};

const Sparkline = ({ data, color, height = 40, width = 120, strokeWidth = 2 }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - strokeWidth * 2) - strokeWidth;
        return `${x},${y}`;
    });

    const pathData = `M ${points.join(' L ')}`;
    
    const fillPath = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;

    return (
        <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${width} ${height}`} 
            preserveAspectRatio="none"
            className="overflow-visible"
        >
            <defs>
                <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                </linearGradient>
            </defs>
            <path 
                d={fillPath} 
                fill={`url(#gradient-${color})`} 
                className="transition-all duration-300"
            />
            <path 
                d={pathData} 
                fill="none" 
                stroke={color} 
                strokeWidth={strokeWidth}
                strokeLinecap="square"
                strokeLinejoin="miter"
                className="transition-all duration-300"
            />
            <circle cx={width} cy={points[points.length - 1].split(',')[1]} r={strokeWidth * 1.5} fill={color} />
        </svg>
    );
};

const CopyButton = ({ text, label }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`
                group relative flex items-center justify-center gap-2 px-3 py-2 
                border-2 transition-all overflow-hidden
                ${copied 
                    ? 'bg-emerald-500 border-emerald-500 text-black' 
                    : 'bg-[#000000] border-[#27272a] text-[#a1a1aa] hover:border-blue-500 hover:text-white'
                }
            `}
        >
            {copied ? <Check size={14} className="animate-in zoom-in duration-200" /> : <Copy size={14} className="group-hover:scale-110 transition-transform" />}
            <span className="text-[10px] font-black uppercase tracking-widest relative z-10">
                {copied ? 'COPIED_TO_CLIPBOARD' : label}
            </span>
            {!copied && (
                <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out -z-0"></div>
            )}
            {!copied && (
                <span className="text-[10px] font-black uppercase tracking-widest absolute z-10 text-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                    COPY_ENDPOINT
                </span>
            )}
        </button>
    );
};

const ProgressBar = ({ value, max, colorClass, label, secondaryLabel }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex items-end justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#a1a1aa] flex items-center gap-2">
                    {label}
                </span>
                <span className="text-xs font-black tabular-nums tracking-tighter text-white">
                    {secondaryLabel || `${percentage.toFixed(1)}%`}
                </span>
            </div>
            <div className="h-2 w-full bg-[#000000] border border-[#27272a] overflow-hidden relative">
                <div 
                    className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuMSI+PHBhdGggZD0iTTAgMjBMMjAgME0tMTAgMjBMMjAgLTEwIi8+PC9nPjwvc3ZnPg==')] pointer-events-none opacity-50 mix-blend-overlay"></div>
            </div>
        </div>
    );
};

const PluginBadge = ({ name }) => {
    return (
        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#000000] border border-[#27272a] text-[#a1a1aa] hover:border-blue-500 hover:text-white transition-colors cursor-help group relative">
            <Music size={10} className="group-hover:animate-bounce" />
            <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[80px]">
                {name}
            </span>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-500 text-black px-2 py-1 text-[9px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                ACTIVE_PLUGIN
            </div>
        </div>
    );
};

const parseUptime = (uptimeMillis) => {
    if (!uptimeMillis) return 'UNKNOWN';
    const totalSeconds = Math.floor(uptimeMillis / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (days > 0) return `${days}D_${hours}H`;
    if (hours > 0) return `${hours}H_${minutes}M`;
    return `${minutes}M_00S`;
};

const parseMemory = (memoryString) => {
    if (!memoryString) return { used: 0, total: 100, label: '0/0 MB' };
    const matches = memoryString.match(/(\d+)\s*\/\s*(\d+)/);
    if (matches && matches.length === 3) {
        return {
            used: parseInt(matches[1], 10),
            total: parseInt(matches[2], 10),
            label: memoryString.replace(/\s+/g, '')
        };
    }
    const singleMatch = memoryString.match(/(\d+)/);
    if (singleMatch) {
        const val = parseInt(singleMatch[1], 10);
        return { used: val, total: Math.max(val * 2, 1024), label: memoryString };
    }
    return { used: 0, total: 100, label: 'UNKNOWN' };
};

const parseLoad = (loadString) => {
    if (!loadString) return 0;
    const match = loadString.match(/([\d.]+)%/);
    if (match && match[1]) return parseFloat(match[1]);
    return 0;
};

const getHealthStatus = (online, load, players) => {
    if (!online) return { label: 'CRITICAL_FAILURE', color: 'bg-red-500', textColor: 'text-red-500', border: 'border-red-500' };
    if (load > 85) return { label: 'HEAVY_LOAD', color: 'bg-amber-500', textColor: 'text-amber-500', border: 'border-amber-500' };
    if (players > 1000) return { label: 'HIGH_TRAFFIC', color: 'bg-blue-500', textColor: 'text-blue-500', border: 'border-blue-500' };
    return { label: 'OPTIMAL_STATE', color: 'bg-emerald-500', textColor: 'text-emerald-500', border: 'border-emerald-500' };
};

export function NodeCard({ node, onClick, minimal = false }) {
    const online = node.isConnected;
    const memoryData = parseMemory(node.memory);
    const loadValue = parseLoad(node.systemLoad);
    const playerCount = parseInt(node.connections?.split('/')[0] || '0', 10);
    const health = getHealthStatus(online, loadValue, playerCount);
    const sparklineData = useMemo(() => generateSparklineData(node.identifier || 'node', 30), [node.identifier]);
    const isSecure = node.secure === true || (node.host && node.host.includes('443'));

    if (minimal) {
        return (
            <div
                onClick={onClick ? () => onClick(node) : undefined}
                className={`
                    relative group flex flex-col cursor-pointer transition-all duration-300 font-mono h-32
                    bg-[#000000] border-2 border-[#27272a] overflow-hidden
                    hover:-translate-y-1 hover:-translate-x-1 hover:border-white hover:shadow-[4px_4px_0px_0px_#ffffff]
                `}
            >
                <div className={`absolute top-0 left-0 h-full w-1 transition-colors duration-500 ${health.color}`} />
                <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r from-${health.color.replace('bg-', '')}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="p-5 pl-6 flex flex-col h-full justify-between relative z-10">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="font-black text-lg uppercase tracking-tighter text-white truncate w-full group-hover:text-blue-400 transition-colors">
                            {node.identifier || 'UNKNOWN_NODE'}
                        </h3>
                        <div className={`shrink-0 w-2 h-2 ${online ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'} rounded-none animate-pulse`} />
                    </div>

                    <div className="flex items-center justify-between text-[#a1a1aa]">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#52525b]">HOST_ADDRESS</span>
                            <span className="text-xs font-black uppercase tracking-widest truncate max-w-[200px] flex items-center gap-2">
                                {isSecure ? <ShieldCheck size={12} className="text-emerald-500" /> : <Globe size={12} className="text-[#52525b]" />}
                                {node.host || 'N/A'}
                            </span>
                        </div>
                        <div className="w-8 h-8 border-2 border-[#27272a] bg-[#09090b] flex items-center justify-center group-hover:bg-white group-hover:border-white group-hover:text-black transition-all">
                            <ChevronRight size={16} className={!online ? 'opacity-50' : ''} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick ? () => onClick(node) : undefined}
            className={`
                relative group flex flex-col cursor-pointer transition-all duration-300 font-mono h-full
                bg-[#09090b] border-2 border-[#27272a]
                hover:-translate-y-2 hover:-translate-x-2 hover:border-[#3b82f6] hover:shadow-[8px_8px_0px_0px_#3b82f6]
            `}
        >
            <div className={`h-2 w-full border-b-2 border-[#27272a] transition-colors duration-500 ${online ? 'bg-emerald-500' : 'bg-red-500 group-hover:bg-red-400'}`} />

            <div className="p-6 flex flex-col h-full relative z-10">
                <div className="flex items-center justify-between mb-4 border-b-2 border-[#27272a] pb-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 border-2 ${health.border} bg-[#000000]`}>
                        <div className={`w-2 h-2 ${health.color} ${online ? 'animate-pulse shadow-[0_0_8px_currentColor]' : ''}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${health.textColor}`}>
                            {health.label}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-[#52525b]">
                        <div className="flex items-center gap-1.5" title="UPTIME">
                            <Clock size={12} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {parseUptime(node.uptimeMillis)}
                            </span>
                        </div>
                        <div className="w-1 h-1 bg-[#27272a]" />
                        <div className="flex items-center gap-1.5" title="REGION">
                            <Globe size={12} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {node.region || 'GLB'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-start justify-between mb-6 gap-4">
                    <div className="flex flex-col gap-2 overflow-hidden flex-1">
                        <h3 className="font-black text-2xl uppercase tracking-tighter text-white truncate w-full group-hover:text-blue-500 transition-colors">
                            {node.identifier || 'UNNAMED_NODE_INSTANCE'}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#a1a1aa] border border-[#27272a] px-2 py-0.5 bg-[#000000] flex items-center gap-1.5">
                                <Terminal size={10} />
                                {node.restVersion || 'LAVALINK_V4'}
                            </div>
                            {isSecure && (
                                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 px-2 py-0.5 bg-emerald-500/10 flex items-center gap-1.5">
                                    <ShieldCheck size={10} />
                                    WSS_SECURE
                                </div>
                            )}
                            {!isSecure && (
                                <div className="text-[10px] font-black uppercase tracking-widest text-[#52525b] border border-[#27272a] px-2 py-0.5 bg-[#000000] flex items-center gap-1.5">
                                    <ShieldAlert size={10} />
                                    STANDARD_WS
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-6 relative z-20">
                    <CopyButton text={`${isSecure ? 'wss' : 'ws'}://${node.host || 'unknown'}`} label={node.host || 'UNKNOWN_HOST'} />
                </div>

                <div className="flex-1 flex flex-col justify-center gap-6 bg-[#000000]/80 border-2 border-[#27272a] p-5 mb-6 relative overflow-hidden group-hover:border-[#3f3f46] transition-colors">
                    
                    <div className="absolute top-0 right-0 w-32 h-full opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none">
                        <Sparkline data={sparklineData} color={online ? '#3b82f6' : '#ef4444'} />
                    </div>

                    <div className="grid grid-cols-2 gap-6 relative z-10">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                                    <PlayCircle size={12} className="text-blue-500" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest font-black text-[#a1a1aa]">ACTIVE_STREAMS</span>
                            </div>
                            <span className="text-3xl font-black tabular-nums tracking-tighter text-white">
                                {playerCount}
                            </span>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                                    <Activity size={12} className="text-red-500" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest font-black text-[#a1a1aa]">SYSTEM_LOAD</span>
                            </div>
                            <span className={`text-3xl font-black tabular-nums tracking-tighter ${loadValue > 80 ? 'text-red-500' : 'text-white'}`}>
                                {loadValue.toFixed(1)}%
                            </span>
                        </div>
                    </div>

                    <div className="w-full h-px bg-[#27272a] relative z-10" />

                    <div className="relative z-10">
                        <ProgressBar 
                            value={memoryData.used} 
                            max={memoryData.total} 
                            colorClass={memoryData.used / memoryData.total > 0.8 ? 'bg-red-500' : 'bg-emerald-500'}
                            label={<><Database size={12} /> HEAP_MEMORY</>}
                            secondaryLabel={memoryData.label}
                        />
                    </div>
                </div>

                {node.plugins && Array.isArray(node.plugins) && node.plugins.length > 0 && (
                    <div className="mb-6 flex flex-col gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#52525b] flex items-center gap-2">
                            <Layers size={10} /> INSTALLED_PLUGINS [{node.plugins.length}]
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {node.plugins.slice(0, 4).map((plugin, idx) => (
                                <PluginBadge key={idx} name={typeof plugin === 'string' ? plugin : plugin.name || `PLUGIN_${idx}`} />
                            ))}
                            {node.plugins.length > 4 && (
                                <div className="inline-flex items-center px-2 py-1 bg-[#000000] border border-[#27272a] text-[#52525b] text-[9px] font-black tracking-widest">
                                    +{node.plugins.length - 4}_MORE
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-auto flex items-center justify-between pt-5 border-t-2 border-[#27272a]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 border-2 border-[#27272a] bg-[#000000] flex items-center justify-center text-lg font-black text-white group-hover:border-blue-500 group-hover:bg-blue-500/10 transition-colors relative overflow-hidden">
                            <span className="relative z-10">{node.authorId?.charAt(0).toUpperCase() || '?'}</span>
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] pointer-events-none"></div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] uppercase tracking-widest text-[#52525b] font-black flex items-center gap-1.5">
                                <Server size={10} /> INFRA_PROVIDER
                            </span>
                            <span className="text-sm font-black text-white uppercase truncate max-w-[140px] tracking-wide">
                                {node.authorId || 'COMMUNITY_HOSTED'}
                            </span>
                        </div>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center border-2 border-[#27272a] bg-[#000000] text-[#a1a1aa] group-hover:bg-blue-500 group-hover:text-black group-hover:border-blue-500 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
}