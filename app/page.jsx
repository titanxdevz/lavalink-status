"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Server, ArrowRight, Search, Activity, Users, Zap, Globe, Plus, Play, Command, Cpu } from "lucide-react";
import Link from "next/link";
import { useNodes } from "@/contexts/NodesContext";
import { useEffect, useState, useRef, useMemo } from "react";
import { NodeCard } from "@/components/NodeCard";
import { NodeDetailsDialog } from "@/components/NodeDetailsDialog";
import { SiteLoader } from "@/components/SiteLoader";

function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = startRef.current;
    const to = value;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(from + (to - from) * ease));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else startRef.current = to;
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  return <>{display}</>;
}

export default function HomePage() {
  const { nodes, loading } = useNodes();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    const total = nodes.length;
    const online = nodes.filter(n => n.isConnected).length;
    const players = nodes.reduce((acc, node) => {
        if (!node.connections) return acc;
        return acc + (parseInt(node.connections.split("/")[0], 10) || 0);
    }, 0);
    const countries = new Set(nodes.map(n => n.host?.split('.').pop())).size;

    return [
        { label: "Active Nodes", value: total, icon: Server, color: "text-blue-500", bg: "bg-blue-500", shadow: "hover:shadow-[6px_6px_0px_0px_#3b82f6]" },
        { label: "Live Streams", value: players, icon: Play, color: "text-purple-500", bg: "bg-purple-500", shadow: "hover:shadow-[6px_6px_0px_0px_#a855f7]" },
        { label: "Network Health", value: total ? Math.round((online / total) * 100) : 0, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500", shadow: "hover:shadow-[6px_6px_0px_0px_#10b981]", suffix: "%" },
        { label: "Global Regions", value: countries, icon: Globe, color: "text-amber-500", bg: "bg-amber-500", shadow: "hover:shadow-[6px_6px_0px_0px_#f59e0b]" },
    ];
  }, [nodes]);

  const filteredNodes = nodes.filter(n => 
    n.isConnected && (
    n.identifier?.toLowerCase().includes(search.toLowerCase()) ||
    n.host?.toLowerCase().includes(search.toLowerCase())
  )).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#000000] text-[#f4f4f5] font-mono relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
      <SiteLoader isLoading={loading} />
      
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
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-reveal { animation: revealUp 0.6s cubic-bezier(0, 0, 0.2, 1) forwards; opacity: 0; }
        .animate-slide { animation: slideIn 0.6s cubic-bezier(0, 0, 0.2, 1) forwards; opacity: 0; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .solid-card {
          background-color: #09090b;
          border: 2px solid #27272a;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .solid-card:hover {
          transform: translate(-4px, -4px);
          border-color: #f4f4f5;
        }
      `}</style>

      <Navbar activeTab="home" />
      <NodeDetailsDialog node={selectedNode} open={!!selectedNode} onOpenChange={() => setSelectedNode(null)} />

      <main className="relative z-10 pt-32 pb-40">
        <div className="container mx-auto px-6">
          
          <div className="min-h-[60vh] flex flex-col items-start justify-center relative mb-32 max-w-5xl">
            <div className="animate-slide inline-flex items-center gap-3 px-4 py-2 border-2 border-blue-500 bg-blue-500/10 text-blue-500 text-sm font-black tracking-widest uppercase mb-8">
              <Command size={16} />
              SYSTEM_ONLINE
            </div>
            
            <h1 className="animate-reveal delay-100 text-[clamp(3.5rem,8vw,8rem)] font-black tracking-tighter leading-none mb-8 uppercase text-white">
              Unleash <br/>
              <span className="text-blue-500">Audio Power</span>
            </h1>
            
            <p className="animate-reveal delay-200 text-xl md:text-2xl text-[#a1a1aa] max-w-2xl font-medium mb-12">
              The brutalist, high-performance registry of public Lavalink nodes. 
              Zero cost infrastructure for your Discord bots.
            </p>
            
            <div className="animate-reveal delay-300 flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
               <Link 
                href="/ssl"
                className="group px-8 py-5 bg-blue-500 text-black font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-3"
               >
                 Explore Network <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
               </Link>
               
               <Link 
                href="/submit"
                className="group px-8 py-5 bg-transparent border-2 border-[#27272a] hover:border-white font-black uppercase tracking-widest text-white transition-colors flex items-center justify-center gap-3"
               >
                 <Plus size={20} className="text-blue-500 group-hover:text-black" /> Host a Node
               </Link>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mb-40">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-reveal delay-400">
              {stats.map((stat, i) => (
                  <div key={i} className={`solid-card p-8 flex flex-col items-start ${stat.shadow}`}>
                      <div className={`p-4 mb-6 ${stat.bg} text-black`}>
                        <stat.icon size={28} />
                      </div>
                      <div className="text-5xl font-black tabular-nums tracking-tighter mb-2 text-white">
                          <AnimatedNumber value={stat.value} />{stat.suffix}
                      </div>
                      <div className={`text-sm font-black uppercase tracking-widest ${stat.color}`}>
                          {stat.label}
                      </div>
                  </div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto mb-40">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-b-2 border-[#27272a] pb-8">
                <div>
                    <h2 className="text-5xl font-black tracking-tighter uppercase text-white mb-2">Network Hub</h2>
                    <p className="text-[#a1a1aa] text-lg font-medium">Real-time telemetry of verified nodes.</p>
                </div>
                <div className="w-full md:w-96">
                    <div className="flex items-center bg-[#09090b] border-2 border-[#27272a] focus-within:border-blue-500 focus-within:shadow-[6px_6px_0px_0px_#3b82f6] transition-all duration-200">
                      <Search className="text-[#a1a1aa] ml-4" size={24} />
                      <input 
                          type="text" 
                          placeholder="SEARCH HOSTS..." 
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full bg-transparent border-none outline-none text-white px-4 py-4 placeholder-[#52525b] font-black tracking-widest uppercase text-sm"
                      />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="h-72 bg-[#09090b] border-2 border-[#27272a] animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNodes.map((node, i) => (
                            <div key={node.identifier} className="animate-reveal" style={{ animationDelay: `${i * 100}ms` }}>
                              <div className="solid-card hover:shadow-[6px_6px_0px_0px_#f4f4f5] h-full">
                                <NodeCard 
                                    node={node} 
                                    onClick={(n) => setSelectedNode(n)}
                                />
                              </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-20 flex justify-center">
                        <Link href="/ssl" className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-4">
                            Access Directory 
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </>
            )}
          </div>

          <div className="max-w-7xl mx-auto space-y-40">
             <div className="flex flex-col lg:flex-row gap-20 items-stretch">
                <div className="flex-1 space-y-10 animate-slide">
                    <div className="inline-flex items-center gap-3 px-4 py-2 border-2 border-emerald-500 bg-emerald-500/10 text-emerald-500 text-sm font-black tracking-widest uppercase">
                        <Cpu size={16} /> Architecture
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter leading-none uppercase text-white">
                        Built For <br/>
                        <span className="text-emerald-500">Scale</span>
                    </h2>
                    <p className="text-xl text-[#a1a1aa] font-medium leading-relaxed">
                        Bypass complex setup. Plug into the grid and deploy high-fidelity audio features to your bot instantly.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        {[
                            { title: "Zero Setup", desc: "Instant deployment.", icon: Zap, c: "text-amber-500" },
                            { title: "Geo-Routing", desc: "Lowest latency regions.", icon: Globe, c: "text-blue-500" },
                            { title: "Active Polling", desc: "Real-time health checks.", icon: Activity, c: "text-emerald-500" },
                            { title: "Enterprise Sec", desc: "DDoS Protected hosts.", icon: Shield, c: "text-purple-500" }
                        ].map((item, i) => (
                            <div key={i} className="solid-card p-6 border-l-4 border-l-[#27272a] hover:border-l-white">
                                <item.icon size={32} className={`${item.c} mb-4`} />
                                <h4 className="font-black text-xl text-white mb-2 uppercase tracking-wide">{item.title}</h4>
                                <p className="text-sm text-[#a1a1aa] font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="flex-1 w-full bg-[#09090b] border-2 border-[#27272a] flex items-center justify-center animate-reveal p-8">
                     <div className="w-full h-full border-2 border-[#18181b] bg-[#000000] p-8 flex flex-col">
                        <div className="flex items-center gap-4 mb-8 border-b-2 border-[#18181b] pb-6">
                          <div className="w-4 h-4 bg-red-500" />
                          <div className="w-4 h-4 bg-yellow-500" />
                          <div className="w-4 h-4 bg-green-500" />
                          <span className="ml-4 text-sm font-black tracking-widest text-[#52525b] uppercase">config.yml</span>
                        </div>
                        <pre className="text-sm text-[#a1a1aa] font-mono leading-loose overflow-x-auto flex-1">
{`lavalink:
  server:
    password: "youshallnotpass"
    sources:
      youtube: true
      bandcamp: true
      soundcloud: true
      twitch: true
  metrics:
    prometheus:
      enabled: true
      endpoint: /metrics`}
                        </pre>
                     </div>
                </div>
             </div>

             <div className="border-t-2 border-[#27272a] pt-20 pb-20 animate-reveal">
                <div className="mb-16">
                    <h2 className="text-6xl font-black tracking-tighter uppercase text-white">Intelligence DB</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { q: "What is the cost structure?", a: "Zero. Every node listed in this directory is volunteered by the community for public use without charge." },
                        { q: "How are nodes verified?", a: "Automated telemetry systems poll endpoints every minute. Offline or degraded nodes are temporarily hidden." },
                        { q: "Which Lavalink versions?", a: "The network primarily supports Lavalink v3 and v4. Compatibility tags are displayed on every node card." },
                        { q: "Production readiness?", a: "Ideal for development and medium-scale bots. For enterprise loads (10k+ guilds), deploying dedicated infrastructure is recommended." }
                    ].map((faq, i) => (
                        <div key={i} className="solid-card p-10 hover:shadow-[8px_8px_0px_0px_#3b82f6]">
                             <h4 className="text-2xl font-black mb-6 text-white uppercase tracking-tight flex flex-col items-start gap-4">
                                <span className="bg-blue-500 text-black px-3 py-1 text-sm tracking-widest">SEQ_0{i+1}</span> 
                                {faq.q}
                             </h4>
                             <p className="text-lg text-[#a1a1aa] font-medium leading-relaxed">
                                {faq.a}
                             </p>
                        </div>
                    ))}
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}