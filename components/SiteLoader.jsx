"use client";
import { useEffect, useState } from "react";
import { Shield, Loader2, Cpu, Network, Wifi, Activity } from "lucide-react";

export function SiteLoader({ isLoading }) {
    const [shouldRender, setShouldRender] = useState(isLoading);
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isLoading) {
            setProgress(100);
            setIsExiting(true);
            const t = setTimeout(() => {
                setShouldRender(false);
            }, 800); 
            return () => clearTimeout(t);
        } else {
            setShouldRender(true);
            setIsExiting(false);
            setProgress(0);
            
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) return prev;
                    return prev + Math.random() * 5;
                });
            }, 100);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black font-mono transition-all duration-700 ease-in-out ${isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
            
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <style>{`
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(1000%); }
                }
                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
                .glitch-text:hover {
                    animation: glitch 0.3s infinite;
                }
            `}</style>

            <div className="relative z-10 flex flex-col items-center gap-16 max-w-lg w-full px-8">
                {/* Logo Area */}
                <div className="relative group">
                    <div className="absolute -inset-4 bg-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-24 h-24 bg-black border-2 border-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] overflow-hidden">
                        <Shield className="text-blue-500 w-12 h-12" />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
                    </div>
                </div>

                {/* Status Container */}
                <div className="w-full space-y-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3">
                            <Activity className="text-emerald-500 w-5 h-5 animate-pulse" />
                            <h2 className="text-white text-3xl font-black tracking-[0.2em] uppercase italic">
                                Initializing<span className="text-blue-500">_Grid</span>
                            </h2>
                        </div>
                        <p className="text-[#52525b] font-bold text-xs tracking-[0.5em] uppercase">Handshaking Community Nodes</p>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end px-1">
                            <div className="flex flex-col gap-1">
                                <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">System Load</span>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className={`w-1.5 h-3 border ${i < progress/20 ? 'bg-blue-500 border-blue-400' : 'bg-transparent border-[#27272a]'}`}></div>
                                    ))}
                                </div>
                            </div>
                            <span className="text-white font-black text-2xl tabular-nums">{Math.round(progress)}%</span>
                        </div>

                        <div className="relative h-1.5 w-full bg-[#09090b] border border-[#27272a] overflow-hidden">
                            <div 
                                className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                style={{ width: `${progress}%` }}
                            ></div>
                            <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[slideRight_1.5s_infinite]"></div>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-4 border-t border-b border-[#27272a] py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#09090b] border border-[#27272a] flex items-center justify-center">
                                <Network size={14} className="text-blue-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-[#52525b] font-black uppercase">Net_Layer</span>
                                <span className="text-white text-[10px] font-black uppercase">v4_Protocol</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#09090b] border border-[#27272a] flex items-center justify-center">
                                <Wifi size={14} className="text-emerald-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-[#52525b] font-black uppercase">Latency</span>
                                <span className="text-white text-[10px] font-black uppercase">Optimized</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-[#52525b] text-[10px] font-black uppercase tracking-[0.3em]">
                    <span className="animate-pulse">Authenticating</span>
                    <span className="w-1 h-1 bg-[#27272a] rounded-full"></span>
                    <span className="animate-pulse delay-300">Syncing</span>
                    <span className="w-1 h-1 bg-[#27272a] rounded-full"></span>
                    <span className="animate-pulse delay-700">Deploying</span>
                </div>
            </div>
        </div>
    );
}