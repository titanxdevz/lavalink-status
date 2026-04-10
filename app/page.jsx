"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NodeCard } from "@/components/NodeCard";
import { NodeDetailsDialog } from "@/components/NodeDetailsDialog";
import { useNodes } from "@/contexts/NodesContext";
import { Shield, Server, ArrowRight, Search, Activity, Users, Zap, Globe, Plus, Terminal, RefreshCw, Loader2, Code, Cpu, Database, Lock, Wifi, Check, X, ChevronRight, Play, Volume2, Music, Settings, Headphones, Layers, Command, Cpu as CpuIcon, Network, GitBranch, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

const CODE_SNIPPETS = [
  {
    language: "JAVASCRIPT (SHOUKAKU)",
    icon: Code,
    color: "yellow",
    code: `const { Shoukaku, Connectors } = require('shoukaku');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const nodes = [
    {
        name: 'COMMUNITY-NODE-1',
        url: 'node1.lavalink.directory:2333',
        auth: 'youshallnotpass',
        secure: false
    }
];

const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), nodes);

shoukaku.on('error', (_, error) => console.error('Lavalink Error:', error));
shoukaku.on('ready', (name) => console.log(\`Node \${name} is now connected\`));

client.login('YOUR_BOT_TOKEN');`
  },
  {
    language: "PYTHON (WAVELINK)",
    icon: Command,
    color: "blue",
    code: `import discord
import wavelink
from discord.ext import commands

class Bot(commands.Bot):
    def __init__(self):
        super().__init__(command_prefix='!', intents=discord.Intents.all())

    async def setup_hook(self):
        nodes = [
            wavelink.Node(
                uri="http://node1.lavalink.directory:2333",
                password="youshallnotpass"
            )
        ]
        await wavelink.Pool.connect(nodes=nodes, client=self)

@discord.utils.setup_logging()
async def main():
    async with Bot() as bot:
        await bot.start('YOUR_BOT_TOKEN')`
  },
  {
    language: "JAVA (LAVAPLAYER/JDA)",
    icon: Layers,
    color: "red",
    code: `import com.sedmelluq.discord.lavaplayer.player.AudioPlayerManager;
import com.sedmelluq.discord.lavaplayer.player.DefaultAudioPlayerManager;
import com.sedmelluq.discord.lavaplayer.source.AudioSourceManagers;
import lavalink.client.io.jda.JdaLavalink;
import net.dv8tion.jda.api.JDABuilder;

public class Bot {
    public static void main(String[] args) throws Exception {
        JdaLavalink lavalink = new JdaLavalink(
            "YOUR_BOT_ID",
            1,
            shardId -> jdaInstance
        );

        lavalink.addNode(
            "COMMUNITY-NODE-1",
            java.net.URI.create("ws://node1.lavalink.directory:2333"),
            "youshallnotpass"
        );

        JDABuilder builder = JDABuilder.createDefault("YOUR_BOT_TOKEN")
            .addEventListeners(lavalink)
            .setVoiceDispatchInterceptor(lavalink.getVoiceInterceptor());
            
        builder.build();
    }
}`
  }
];

const EXTENDED_FEATURES = [
  { title: "ZERO_INFRASTRUCTURE_COSTS", desc: "LEVERAGE COMMUNITY-DRIVEN POWER WITHOUT PAYING FOR EXPENSIVE VPS INSTANCES OR DEDICATED SERVERS. COMPLETELY FREE TO USE.", icon: Shield, color: "emerald" },
  { title: "GLOBAL_LATENCY_CONTROL", desc: "CHOOSE NODES CLOSEST TO YOUR DISCORD VOICE REGIONS TO MINIMIZE PACKET LOSS AND ELIMINATE AUDIO STUTTERING.", icon: Globe, color: "blue" },
  { title: "AUTOMATED_VERIFICATION", desc: "OUR SYSTEM TRACKS UPTIME, MEMORY USAGE, AND PLAYER LOAD 24/7, ENSURING YOU ONLY SEE HEALTHY NODES.", icon: Activity, color: "purple" },
  { title: "DDoS_PROTECTION", desc: "MOST DIRECTORY NODES ARE ROUTED THROUGH CLOUDFLARE OR EQUIVALENT PROXIES, SAFEGUARDING YOUR BOT'S AUDIO STREAM.", icon: Lock, color: "red" },
  { title: "WEBSOCKET_OPTIMIZATION", desc: "LOW-LEVEL WEBSOCKET TUNING FOR ZERO-DELAY PLAYBACK, ENSURING INSTANT PAUSE, RESUME, AND SEEK OPERATIONS.", icon: Zap, color: "amber" },
  { title: "V4_PROTOCOL_SUPPORT", desc: "FULLY COMPATIBLE WITH LAVALINK V4 SPECIFICATIONS, INCLUDING PLUGINS FOR SPOTIFY, APPLE MUSIC, AND MORE.", icon: Layers, color: "cyan" }
];

const ARCHITECTURE_STEPS = [
  { title: "DISCORD_VOICE_GATEWAY", desc: "YOUR BOT ESTABLISHES A SECURE WEBSOCKET CONNECTION TO DISCORD'S VOICE SERVERS.", icon: Headphones },
  { title: "LAVALINK_NODE_ROUTING", desc: "AUDIO REQUESTS ARE FORWARDED TO THE SELECTED COMMUNITY NODE VIA REST API.", icon: Network },
  { title: "AUDIO_DECODING_MATRIX", desc: "THE NODE DOWNLOADS, DECODES, AND ENCODES THE AUDIO STREAM INTO OPUS FORMAT.", icon: CpuIcon },
  { title: "UDP_PACKET_STREAMING", desc: "ENCODED AUDIO PACKETS ARE BLASTED DIRECTLY TO DISCORD'S UDP SERVERS IN REAL-TIME.", icon: Wifi }
];

const FAQS = [
  { q: "IS_IT_REALLY_FREE?", a: "YES. ALL NODES LISTED IN THIS DIRECTORY ARE HOSTED BY VOLUNTEERS AND SPONSORS. THEY ARE COMPLETELY FREE TO USE FOR ANY DISCORD BOT, REGARDLESS OF SIZE.", icon: Shield, color: "emerald" },
  { q: "HOW_DO_I_ADD_MY_OWN_NODE?", a: "CLICK THE 'ADD_NODE' BUTTON AT THE TOP OF THE PAGE. SUBMIT YOUR NODE'S CREDENTIALS AND ENDPOINT. OUR AUTOMATED SYSTEM WILL VERIFY ITS HEALTH BEFORE LISTING IT PUBLICLY.", icon: Plus, color: "blue" },
  { q: "WHICH_LAVALINK_VERSION_IS_SUPPORTED?", a: "THE MAJORITY OF OUR NODES RUN LAVALINK V3 OR V4. THE SPECIFIC VERSION, ALONG WITH LOADED PLUGINS, IS DISPLAYED ON EACH NODE'S DETAILED CARD.", icon: Server, color: "purple" },
  { q: "CAN_I_USE_THESE_FOR_LARGE_BOTS?", a: "WHILE PUBLIC NODES ARE GREAT, WE STRONGLY RECOMMEND IMPLEMENTING A FAILOVER SYSTEM FOR BOTS IN OVER 1,000 SERVERS. RELYING ON A SINGLE FREE NODE FOR MASSIVE TRAFFIC IS RISKY.", icon: Users, color: "amber" },
  { q: "WHAT_HAPPENS_IF_A_NODE_GOES_OFFLINE?", a: "OUR DIRECTORY PINGS ALL NODES EVERY 60 SECONDS. IF A NODE FAILS THREE CONSECUTIVE PINGS, IT IS TEMPORARILY REMOVED FROM THE ACTIVE GRID UNTIL IT RECOVERS.", icon: Activity, color: "red" },
  { q: "ARE_CUSTOM_PLUGINS_SUPPORTED?", a: "MANY HOSTS PRE-LOAD PLUGINS LIKE LAVA-SRC (FOR SPOTIFY/APPLE MUSIC) OR FILTER PLUGINS. CHECK THE 'PLUGINS' BADGE ON THE NODE DETAILS DIALOG FOR SPECIFICS.", icon: GitBranch, color: "cyan" },
  { q: "IS_YOUTUBE_PLAYBACK_SUPPORTED?", a: "DUE TO RECENT YOUTUBE RESTRICTIONS, SOME NODES MAY STRUGGLE WITH YOUTUBE PLAYBACK UNLESS THEY CONFIGURE IPV6 ROTATION. WE RECOMMEND USING SPOTIFY OR SOUNDCLOUD SOURCES.", icon: Play, color: "pink" },
  { q: "HOW_DO_I_REPORT_A_MALICIOUS_NODE?", a: "IF YOU DETECT A NODE INTERCEPTING TRAFFIC OR PERFORMING MALICIOUS ACTIONS, JOIN OUR DISCORD AND OPEN A TICKET. WE WILL BLACKLIST THE HOST PERMANENTLY.", icon: X, color: "rose" }
];

export default function HomePage() {
  const { nodes, loading, fetchNodes, lastFetch } = useNodes();
  const [search, setSearch] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeCodeTab, setActiveCodeTab] = useState(0);
  const [regionFilter, setRegionFilter] = useState("ALL");

  const formatAge = () => {
    if (!lastFetch) return "NEVER";
    const s = Math.floor((Date.now() - lastFetch) / 1000);
    if (s < 60) return `${s}S AGO`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}M AGO`;
    return `${Math.floor(m / 60)}H AGO`;
  };

  const stats = useMemo(() => {
    const total = nodes.length;
    const online = nodes.filter(n => n.isConnected).length;
    const players = nodes.reduce((acc, node) => {
      if (!node.connections) return acc;
      return acc + (parseInt(node.connections.split("/")[0], 10) || 0);
    }, 0);
    const memory = nodes.reduce((acc, node) => {
      if (!node.memory) return acc;
      return acc + (parseInt(node.memory.replace(/\D/g, ''), 10) || 0);
    }, 0);
    const memoryGB = (memory / 1024).toFixed(1);
    const countries = new Set(nodes.map(n => n.host?.split('.').pop())).size;

    return [
      { label: "ACTIVE_NODES", value: total, icon: Server, color: "blue" },
      { label: "LIVE_PLAYERS", value: players, icon: Users, color: "emerald" },
      { label: "NETWORK_MEMORY", value: memoryGB, icon: Database, suffix: "GB", color: "purple" },
      { label: "GLOBAL_REACH", value: countries, icon: Globe, suffix: " TLDs", color: "amber" },
    ];
  }, [nodes]);

  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      const matchesSearch = n.identifier?.toLowerCase().includes(search.toLowerCase()) || n.host?.toLowerCase().includes(search.toLowerCase());
      const isOnline = n.isConnected;
      const matchesRegion = regionFilter === "ALL" || (n.region && n.region.toUpperCase() === regionFilter);
      return isOnline && matchesSearch && matchesRegion;
    }).slice(0, 9);
  }, [nodes, search, regionFilter]);

  const availableRegions = useMemo(() => {
    const regions = new Set(nodes.filter(n => n.region).map(n => n.region.toUpperCase()));
    return ["ALL", ...Array.from(regions)];
  }, [nodes]);

  return (
    <div className="min-h-screen bg-[#000000] text-[#f4f4f5] font-mono selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 flex flex-wrap opacity-10">
        {[...Array(400)].map((_, i) => (
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
        @keyframes pulseBorder {
            0% { border-color: #3b82f6; box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
            70% { border-color: #60a5fa; box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { border-color: #3b82f6; box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
        }
        .animate-reveal { animation: revealUp 0.6s cubic-bezier(0, 0, 0.2, 1) forwards; opacity: 0; }
        .animate-slide { animation: slideRight 0.6s cubic-bezier(0, 0, 0.2, 1) forwards; opacity: 0; }
        .scanline-effect::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.3) 51%);
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 50;
        }
      `}</style>

      <div className="fixed top-0 left-0 right-0 h-1 bg-blue-500/20 z-50 overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-blue-500 w-1/3 animate-[slideRight_2s_infinite_linear]"></div>
      </div>

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="animate-reveal space-y-8">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="w-20 h-20 bg-blue-500 text-black flex items-center justify-center border-2 border-transparent shadow-[8px_8px_0px_0px_#f4f4f5]">
                  <Server size={40} />
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none text-white">
                  LAVALINK
                  <span className="block text-blue-500">GRID</span>
                </h1>
              </div>

              <p className="text-xl md:text-2xl font-medium text-[#a1a1aa] max-w-3xl mx-auto leading-relaxed uppercase tracking-wide">
                COMMUNITY-POWERED AUDIO STREAMING INFRASTRUCTURE FOR DISCORD BOTS
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm font-black uppercase tracking-widest">
                <div className="flex items-center gap-3 bg-[#09090b] border-2 border-[#27272a] px-6 py-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400">{stats[0]?.value || 0} NODES ONLINE</span>
                </div>
                <div className="flex items-center gap-3 bg-[#09090b] border-2 border-[#27272a] px-6 py-3">
                  <Users size={16} className="text-blue-400" />
                  <span className="text-blue-400">{stats[1]?.value || 0} ACTIVE STREAMS</span>
                </div>
                <div className="flex items-center gap-3 bg-[#09090b] border-2 border-[#27272a] px-6 py-3">
                  <Clock size={16} className="text-[#a1a1aa]" />
                  <span className="text-[#a1a1aa]">UPDATED {formatAge()}</span>
                </div>
              </div>
            </div>

            <div className="animate-reveal flex flex-col sm:flex-row items-center justify-center gap-6" style={{ animationDelay: '200ms' }}>
              <Link
                href="/submit"
                className="group inline-flex items-center gap-4 bg-blue-500 border-2 border-blue-500 text-black font-black text-xl tracking-widest uppercase px-12 py-6 transition-all shadow-[8px_8px_0px_0px_#f4f4f5] hover:bg-white hover:border-white hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0px_0px_#f4f4f5]"
              >
                <Plus size={24} />
                ADD NODE
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </Link>

              <button
                onClick={() => document.getElementById('nodes-section').scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center gap-4 bg-[#09090b] border-2 border-[#27272a] text-[#a1a1aa] font-black text-xl tracking-widest uppercase px-12 py-6 transition-all hover:border-white hover:text-white hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0px_0px_#3b82f6]"
              >
                <Search size={24} />
                BROWSE NODES
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 px-6 bg-[#09090b]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="animate-reveal bg-[#000000] border-2 border-[#27272a] p-8 text-center hover:border-blue-500 transition-colors" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`w-16 h-16 bg-${stat.color}-500 text-black flex items-center justify-center mx-auto mb-6 border-2 border-transparent shadow-[4px_4px_0px_0px_#f4f4f5]`}>
                    <stat.icon size={32} />
                  </div>
                  <div className="text-4xl font-black text-white mb-2">
                    {stat.value}{stat.suffix || ''}
                  </div>
                  <div className="text-xs font-black text-[#a1a1aa] uppercase tracking-widest">
                    {stat.label.replace(/_/g, ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nodes Section */}
        <section id="nodes-section" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-white mb-4">ACTIVE NODES</h2>
              <p className="text-xl text-[#a1a1aa] uppercase tracking-widest">BROWSE COMMUNITY-HOSTED LAVALINK SERVERS</p>
            </div>

            {/* Search and Filter */}
            <div className="mb-12 flex flex-col lg:flex-row gap-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#52525b]" size={20} />
                <input
                  type="text"
                  placeholder="SEARCH NODES..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#09090b] border-2 border-[#27272a] text-white pl-12 pr-4 py-4 font-black uppercase tracking-widest placeholder-[#52525b] focus:border-blue-500 outline-none"
                />
              </div>

              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="bg-[#09090b] border-2 border-[#27272a] text-white px-6 py-4 font-black uppercase tracking-widest focus:border-blue-500 outline-none cursor-pointer"
              >
                {availableRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>

              <button
                onClick={() => fetchNodes(true)}
                className="flex items-center gap-3 bg-[#09090b] border-2 border-[#27272a] text-[#a1a1aa] hover:border-white hover:text-white px-6 py-4 font-black uppercase tracking-widest transition-all"
              >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                REFRESH
              </button>
            </div>

            {/* Node Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={48} className="animate-spin text-blue-500" />
              </div>
            ) : filteredNodes.length === 0 ? (
              <div className="text-center py-20">
                <Server size={48} className="mx-auto text-[#52525b] mb-4" />
                <p className="text-xl text-[#a1a1aa] font-black uppercase tracking-widest">NO NODES FOUND</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNodes.map((node, i) => (
                  <NodeCard
                    key={node._id || `${node.host}:${node.port}`}
                    node={node}
                    onClick={() => setSelectedNode(node)}
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-[#09090b]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-white mb-4">WHY CHOOSE GRID</h2>
              <p className="text-xl text-[#a1a1aa] uppercase tracking-widest">ENTERPRISE-GRADE FEATURES FOR FREE</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {EXTENDED_FEATURES.map((feature, i) => (
                <div key={i} className="animate-reveal bg-[#000000] border-2 border-[#27272a] p-8 hover:border-blue-500 transition-colors" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`w-12 h-12 bg-${feature.color}-500 text-black flex items-center justify-center mb-6 border-2 border-transparent shadow-[4px_4px_0px_0px_#f4f4f5]`}>
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-black text-white mb-4">{feature.title.replace(/_/g, ' ')}</h3>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code Examples Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-white mb-4">INTEGRATION EXAMPLES</h2>
              <p className="text-xl text-[#a1a1aa] uppercase tracking-widest">QUICK SETUP FOR POPULAR LIBRARIES</p>
            </div>

            <div className="bg-[#09090b] border-2 border-[#27272a] p-8">
              <div className="flex flex-wrap gap-4 mb-8">
                {CODE_SNIPPETS.map((snippet, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCodeTab(i)}
                    className={`px-6 py-3 font-black uppercase tracking-widest text-sm transition-all ${activeCodeTab === i
                        ? 'bg-blue-500 text-black border-2 border-blue-500'
                        : 'bg-[#000000] text-[#a1a1aa] border-2 border-[#27272a] hover:border-white hover:text-white'
                      }`}
                  >
                    {snippet.language}
                  </button>
                ))}
              </div>

              <div className="bg-[#000000] border-2 border-[#27272a] p-6 overflow-x-auto">
                <pre className="text-sm text-[#a1a1aa] font-mono">
                  <code>{CODE_SNIPPETS[activeCodeTab].code}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 bg-[#09090b]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-white mb-4">FREQUENTLY ASKED QUESTIONS</h2>
              <p className="text-xl text-[#a1a1aa] uppercase tracking-widest">EVERYTHING YOU NEED TO KNOW</p>
            </div>

            <div className="space-y-6">
              {FAQS.map((faq, i) => (
                <div key={i} className="animate-reveal bg-[#000000] border-2 border-[#27272a] p-8 hover:border-blue-500 transition-colors" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-start gap-6">
                    <div className={`w-12 h-12 bg-${faq.color}-500 text-black flex items-center justify-center flex-shrink-0 border-2 border-transparent shadow-[4px_4px_0px_0px_#f4f4f5]`}>
                      <faq.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-white mb-4">{faq.q.replace(/_/g, ' ')}</h3>
                      <p className="text-[#a1a1aa] leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Node Details Dialog */}
      <NodeDetailsDialog
        node={selectedNode}
        open={!!selectedNode}
        onOpenChange={(open) => !open && setSelectedNode(null)}
      />

      <Footer />
    </div>
  );
}
