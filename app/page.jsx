"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Server, ArrowRight, Search, Activity, Users, Zap, Globe, Plus } from "lucide-react";
import Link from "next/link";
import { useNodes } from "@/contexts/NodesContext";
import { useEffect, useState, useRef, useMemo } from "react";
import { NodeCard } from "@/components/NodeCard";
import { NodeDetailsDialog } from "@/components/NodeDetailsDialog";
import { SiteLoader } from "@/components/SiteLoader";
import { NodeCheckerTool } from "@/components/NodeCheckerTool";
import { ConfigGeneratorTool } from "@/components/ConfigGeneratorTool";


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
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
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
        { label: "Active Nodes", value: total, icon: Server, color: "#3b82f6" },
        { label: "Live Players", value: players, icon: Users, color: "#a855f7" },
        { label: "Online Ratio", value: total ? Math.round((online / total) * 100) : 0, icon: Activity, color: "#16a34a", suffix: "%" },
        { label: "Global Reach", value: countries, icon: Globe, color: "#eab308" },
    ];
  }, [nodes]);

  const filteredNodes = nodes.filter(n => 
    n.isConnected && (
    n.identifier?.toLowerCase().includes(search.toLowerCase()) ||
    n.host?.toLowerCase().includes(search.toLowerCase())
  )).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 font-sans relative">
      <SiteLoader isLoading={loading} />
      
      {/* Visual background layers */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]"></div>
      </div>
      <style>{`
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
            0%, 100% { opacity: 0.3; filter: blur(40px); }
            50% { opacity: 0.6; filter: blur(60px); }
        }
        .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(12px);
        }
      `}</style>

      <Navbar activeTab="home" />
      <NodeDetailsDialog node={selectedNode} open={!!selectedNode} onOpenChange={() => setSelectedNode(null)} />

      <main className="relative pt-20 pb-40 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full mix-blend-screen animate-glow" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full mix-blend-screen animate-glow" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto px-6 relative z-10">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 mb-8 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Community Driven Lavalink Directory
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] animate-fade-up delay-1">
              Lavalink <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Directory</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 animate-fade-up delay-2 leading-relaxed text-balance">
              The ultimate list of public Lavalink nodes for your Discord bot. 
              High performance, community verified, and always free.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up delay-3">
               <Link 
                href="/submit"
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all flex items-center gap-2"
               >
                 <Plus size={20} /> Add Your Node
               </Link>
               <Link 
                href="/ssl"
                className="px-8 py-4 glass-card font-bold rounded-full hover:bg-white/5 transition-all flex items-center gap-2"
               >
                 Explore Nodes <ArrowRight size={20} />
               </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-32 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat, i) => (
                <div key={i} className="glass-card p-8 group hover:border-white/20 transition-all duration-500 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <stat.icon size={20} className="mb-4 text-white/40 group-hover:text-white transition-colors relative z-10" />
                    <div className="text-3xl font-black tabular-nums tracking-tighter mb-1 relative z-10">
                        <AnimatedNumber value={stat.value} />{stat.suffix}
                    </div>
                    <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 relative z-10">
                        {stat.label}
                    </div>
                    {/* Accent glow on hover */}
                    <div 
                        className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 opacity-0 group-hover:opacity-100" 
                        style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
                    />
                </div>
            ))}
          </div>

          {/* Featured Nodes / Search */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12 border-b border-white/10 pb-12">
                <div className="max-w-md">
                    <h2 className="text-3xl font-bold tracking-tight mb-4 italic">Featured Nodes</h2>
                    <p className="text-white/40 text-sm">
                        Showing some of our top performing community nodes. 
                        Search for specific providers or locations.
                    </p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search identification..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm outline-none focus:border-white/20 transition-all hover:bg-white/[0.07]"
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="h-64 bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                        {filteredNodes.map(node => (
                            <NodeCard 
                                key={node.identifier} 
                                node={node} 
                                onClick={(n) => setSelectedNode(n)}
                            />
                        ))}
                    </div>
                    
                    <div className="mt-16 text-center">

                        <Link href="/ssl" className="inline-flex items-center gap-2 group text-white/40 hover:text-white transition-colors font-medium">
                            View All Lavalink Nodes 
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </>
            )}
          </div>


          {/* Tools & Utilities Section */}
          <div className="max-w-6xl mx-auto mt-40">
             <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12 border-b border-white/10 pb-12">
                <div className="max-w-md">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest text-purple-400 mb-4">
                        Developer Tools
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter mb-4 italic leading-none">Power Up Your Bot</h2>
                    <p className="text-white/40 text-sm">
                        Use our internal tools to verify node health or generate 
                        configuration files for your music bot in seconds.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <NodeCheckerTool />
                <ConfigGeneratorTool />
            </div>
          </div>

          {/* New Content Sections */}

          <div className="max-w-6xl mx-auto mt-40 space-y-40">
             {/* Why Public Nodes? */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
                        <Zap size={14} /> Performance First
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                        Why use <span className="text-blue-500">Public Nodes?</span>
                    </h2>
                    <p className="text-white/40 leading-relaxed text-lg">
                        Setting up your own Lavalink server can be expensive and time-consuming. 
                        Our community directory provides you with tested, high-quality nodes 
                        that you can plug into your Discord bot instantly.
                    </p>
                    <ul className="space-y-4">
                        {[
                            { title: "No Infrastructure Costs", desc: "Use our community power without paying for VPS.", icon: Shield },
                            { title: "Global Latency Control", desc: "Choose nodes closest to your Discord region.", icon: Globe },
                            { title: "Automated Verification", desc: "We track uptime and status 24/7.", icon: Activity }
                        ].map((item, i) => (
                            <li key={i} className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                    <item.icon size={18} className="text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1 uppercase tracking-widest text-[10px]">{item.title}</h4>
                                    <p className="text-sm text-white/30">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="glass-card rounded-3xl p-1 aspect-square overflow-hidden relative group">
                     {/* Placeholder for an interface graphic */}
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
                     <div className="h-full w-full bg-[#0a0a0a] flex items-center justify-center">
                        <pre className="text-[10px] text-white/20 font-mono leading-relaxed">
                            {`{
  "identifier": "Main-Node",
  "password": "youshallnotpass",
  "host": "node1.lavalink.net",
  "port": 2333,
  "secure": false
}`}
                        </pre>
                     </div>
                </div>
             </div>

             {/* FAQ Section */}
             <div className="space-y-16">
                <div className="text-center">
                    <h2 className="text-4xl font-black tracking-tighter mb-4">Frequently Asked Questions</h2>
                    <p className="text-white/40">Everything you need to know about using our nodes.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { q: "Is it really free?", a: "Yes. All nodes in this directory are community-hosted and free to use for any Discord bot. Some providers might have rate limits for large bots." },
                        { q: "How do I add my node?", a: "Click the 'Add Your Node' button at the top of the page. Fill in your details, and our admins will review it within 24 hours." },
                        { q: "Which version of Lavalink works?", a: "Most nodes support Lavalink v4. You can see the specific version on the node card or in the detailed view." },
                        { q: "Can I use these for large bots?", a: "Public nodes are perfect for small to medium bots. For very large bots with thousands of guilds, we recommend having a failover system or your own node." }
                    ].map((faq, i) => (
                        <div key={i} className="glass-card p-8 group hover:bg-white/[0.05] transition-all duration-300">
                             <h4 className="text-white font-bold mb-3 flex items-center gap-3">
                                <span className="text-blue-500">Q.</span> {faq.q}
                             </h4>
                             <p className="text-sm text-white/40 leading-relaxed pl-7 border-l border-white/10 group-hover:border-blue-500/50 transition-colors">
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