"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SiteLoader } from "@/components/SiteLoader";
import { 
    Trophy, Medal, Award, User, Server, 
    ArrowRight, ChevronRight, Activity, Zap, 
    TrendingUp, Star, Crown, Target
} from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const res = await fetch("/api/leaderboard");
                const data = await res.json();
                setLeaders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaders();
    }, []);

    if (loading) return <SiteLoader />;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 selection:text-black">
            <Navbar activeTab="leaderboard" />
            
            <main className="max-w-5xl mx-auto px-6 pt-32 pb-40">
                {/* Hero Header */}
                <div className="relative mb-20 text-center space-y-6">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[120px] rounded-full -z-10" />
                    
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border-2 border-blue-500/30 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                        <TrendingUp size={14} /> GLOBAL_CONTRIBUTION_INDEX
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
                        TOP_SYSTEM<br/>
                        <span className="text-blue-500">OPERATORS</span>
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-[#52525b] font-bold uppercase tracking-widest text-sm leading-relaxed">
                        The elite ranking of operators contributing the most computational power to the global Lavalink grid.
                    </p>
                </div>

                {/* Podium / Top 3 */}
                {leaders.length > 0 && (
                    <div className={`grid grid-cols-1 md:grid-cols-${Math.min(leaders.length, 3)} gap-8 mb-20 relative`}>
                        {/* Rank 2 */}
                        {leaders.length >= 2 && (
                            <div className="order-2 md:order-1 mt-12">
                                <PodiumCard user={leaders[1]} rank={2} color="text-slate-400" borderColor="border-slate-400" />
                            </div>
                        )}
                        {/* Rank 1 */}
                        {leaders.length >= 1 && (
                            <div className="order-1 md:order-2">
                                <PodiumCard user={leaders[0]} rank={1} color="text-amber-500" borderColor="border-amber-500" highlight />
                            </div>
                        )}
                        {/* Rank 3 */}
                        {leaders.length >= 3 && (
                            <div className="order-3 md:order-3 mt-12">
                                <PodiumCard user={leaders[2]} rank={3} color="text-orange-600" borderColor="border-orange-600" />
                            </div>
                        )}
                    </div>
                )}

                {/* Full List */}
                <div className="space-y-4">
                    {leaders.length > 3 && (
                        <div className="grid grid-cols-12 px-8 py-4 text-[10px] font-black text-[#52525b] uppercase tracking-widest border-b-2 border-[#27272a] mb-4">
                            <div className="col-span-1">RANK</div>
                            <div className="col-span-7">OPERATOR</div>
                            <div className="col-span-4 text-right">ACTIVE_NODES</div>
                        </div>
                    )}

                    {leaders.slice(3).map((user, index) => (
                        <Link 
                            key={user.userId} 
                            href={`/profile/${user.userId}`}
                            className="grid grid-cols-12 items-center px-8 py-6 bg-[#09090b] border-2 border-[#27272a] hover:border-blue-500 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_#3b82f6] transition-all group"
                        >
                            <div className="col-span-1 font-black text-xl text-[#27272a] group-hover:text-blue-500 transition-colors">
                                #{index + 4}
                            </div>
                            <div className="col-span-7 flex items-center gap-4">
                                <div className="w-12 h-12 border-2 border-[#27272a] bg-black flex items-center justify-center shrink-0 group-hover:border-white transition-colors overflow-hidden">
                                    {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : <User size={20} />}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-black text-lg uppercase tracking-tight group-hover:text-white transition-colors">{user.name}</span>
                                    <span className="text-[9px] font-black text-[#52525b] uppercase tracking-widest">LVL_{user.nodeCount > 5 ? 'VETERAN' : 'OPERATOR'}</span>
                                </div>
                            </div>
                            <div className="col-span-4 text-right">
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-black border-2 border-[#27272a] group-hover:border-blue-500 transition-colors">
                                    <Server size={14} className="text-blue-500" />
                                    <span className="font-black text-xl tabular-nums">{user.nodeCount}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}

function PodiumCard({ user, rank, color, borderColor, highlight }) {
    return (
        <Link 
            href={`/profile/${user.userId}`}
            className={`
                relative flex flex-col items-center p-10 bg-[#09090b] border-4 ${borderColor} 
                ${highlight ? 'scale-110 z-10 shadow-[16px_16px_0px_0px_rgba(59,130,246,0.1)]' : 'shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]'} 
                hover:-translate-y-2 hover:bg-[#0c0c0e] transition-all group
            `}
        >
            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-black border-2 ${borderColor} font-black text-sm ${color} tracking-widest`}>
                RANK_0{rank}
            </div>
            
            <div className={`mb-6 relative`}>
                <div className={`w-24 h-24 border-4 ${borderColor} p-1 group-hover:rotate-6 transition-transform`}>
                    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
                        {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : <User size={32} />}
                    </div>
                </div>
                {rank === 1 && <Crown className="absolute -top-8 -right-8 text-amber-500 rotate-12" size={32} />}
                {rank === 2 && <Medal className="absolute -top-6 -right-6 text-slate-400" size={24} />}
                {rank === 3 && <Medal className="absolute -top-6 -right-6 text-orange-600" size={24} />}
            </div>

            <div className="text-center space-y-2">
                <h3 className="font-black text-2xl uppercase tracking-tighter leading-tight">{user.name}</h3>
                <div className="flex items-center justify-center gap-3">
                    <Server size={14} className="text-blue-500" />
                    <span className="text-2xl font-black">{user.nodeCount}</span>
                </div>
                <div className="text-[10px] font-black text-[#52525b] uppercase tracking-[0.2em] pt-4">NODES_REGISTERED</div>
            </div>

            <div className="mt-8 w-full h-1 bg-[#27272a] relative overflow-hidden">
                <div className={`absolute inset-0 ${borderColor.replace('border-', 'bg-')} opacity-20 animate-pulse`} />
            </div>
        </Link>
    );
}
