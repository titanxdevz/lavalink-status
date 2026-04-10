"use client";
import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NodeCard } from "@/components/NodeCard";
import { NodeDetailsDialog } from "@/components/NodeDetailsDialog";
import { useNodes } from "@/contexts/NodesContext";
import Link from "next/link";
import { 
  Shield, Lock, Server, ArrowLeft, Terminal, RefreshCw, Loader2, 
  Activity, Zap, Search, Globe, ChevronRight, Key, ShieldCheck, 
  Wifi, Cpu, Database, Command, Layers, Network, Fingerprint,
  FileKey, ShieldAlert, CheckCircle2, AlertTriangle, LayoutGrid, List
} from "lucide-react";

const WSS_CODE_SNIPPETS = [
  {
    language: "JAVASCRIPT (SHOUKAKU WSS)",
    icon: CodeIconWrapper,
    color: "yellow",
    code: `const { Shoukaku, Connectors } = require('shoukaku');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const nodes = [
    {
        name: 'SECURE-NODE-ALPHA',
        url: 'alpha.lavalink.directory:443',
        auth: 'youshallnotpass',
        secure: true 
    }
];

const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), nodes);

shoukaku.on('error', (_, error) => console.error('TLS/SSL Error:', error));
shoukaku.on('ready', (name) => console.log(\`[SECURE] Node \${name} connected via WSS\`));

client.login('YOUR_BOT_TOKEN');`
  },
  {
    language: "PYTHON (WAVELINK WSS)",
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
                uri="https://alpha.lavalink.directory:443",
                password="youshallnotpass",
                secure=True 
            )
        ]
        await wavelink.Pool.connect(nodes=nodes, client=self)

@discord.utils.setup_logging()
async def main():
    async with Bot() as bot:
        await bot.start('YOUR_BOT_TOKEN')`
  },
  {
    language: "JAVA (JDA LAVALINK SSL)",
    icon: Layers,
    color: "red",
    code: `import lavalink.client.io.jda.JdaLavalink;
import net.dv8tion.jda.api.JDABuilder;
import java.net.URI;

public class SecureBot {
    public static void main(String[] args) throws Exception {
        JdaLavalink lavalink = new JdaLavalink(
            "YOUR_BOT_ID",
            1,
            shardId -> jdaInstance
        );

        lavalink.addNode(
            "SECURE-NODE-ALPHA",
            URI.create("wss://alpha.lavalink.directory:443"),
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

const SSL_FEATURES = [
  { title: "END_TO_END_ENCRYPTION", desc: "ALL WEBSOCKET AND REST TRAFFIC IS ENCRYPTED USING TLS 1.3, PREVENTING PACKET SNIFFING AND MAN-IN-THE-MIDDLE ATTACKS.", icon: Lock, color: "emerald" },
  { title: "CERTIFICATE_AUTHORITY_VERIFIED", desc: "NODES UTILIZE STRICT SSL CERTIFICATES ISSUED BY TRUSTED AUTHORITIES LIKE LET'S ENCRYPT AND CLOUDFLARE.", icon: FileKey, color: "blue" },
  { title: "PORT_443_BYPASS", desc: "RUNNING ON STANDARD HTTPS PORTS ALLOWS BOT TRAFFIC TO BYPASS STRICT FIREWALLS AND ISP THROTTLING RULES.", icon: Network, color: "purple" },
  { title: "PAYLOAD_INTEGRITY", desc: "CRYPTOGRAPHIC HASHING ENSURES THAT AUDIO TRACK METADATA AND CONTROL COMMANDS CANNOT BE TAMPERED WITH IN TRANSIT.", icon: Fingerprint, color: "amber" },
  { title: "DDoS_MITIGATION", desc: "SSL TERMINATION AT THE EDGE (VIA REVERSE PROXIES) MASKS THE ORIGIN IP, PROVIDING ENTERPRISE-GRADE DDOS PROTECTION.", icon: ShieldCheck, color: "cyan" },
  { title: "WSS_PROTOCOL_SUPPORT", desc: "NATIVE WEBSOCKET SECURE (WSS) HANDSHAKES ENSURE IMMEDIATE UPGRADES FROM HTTPS WITHOUT LATENCY PENALTIES.", icon: Wifi, color: "rose" }
];

const ENCRYPTION_STEPS = [
  { title: "CLIENT_HELLO", desc: "BOT INITIATES CONNECTION, SENDING SUPPORTED CIPHER SUITES.", icon: Cpu },
  { title: "SERVER_CERTIFICATE", desc: "NODE RESPONDS WITH PUBLIC KEY AND SIGNED SSL CERTIFICATE.", icon: FileKey },
  { title: "KEY_EXCHANGE", desc: "ASYMMETRIC ENCRYPTION ESTABLISHES A SECURE SYMMETRIC SESSION KEY.", icon: Key },
  { title: "SECURE_STREAM", desc: "AUDIO PACKETS ARE TRANSMITTED VIA ENCRYPTED WSS TUNNEL.", icon: Lock }
];

const FAQS = [
  { q: "WHY_DO_I_NEED_AN_SSL_NODE?", a: "WHILE STANDARD WS IS FINE FOR LOCALHOST, WSS (WEBSOCKET SECURE) IS CRUCIAL WHEN CONNECTING TO PUBLIC NODES ACROSS THE INTERNET TO PROTECT YOUR BOT'S AUTHENTICATION HEADERS.", icon: ShieldAlert, color: "emerald" },
  { q: "HOW_DO_I_CONFIGURE_WSS?", a: "IN MOST LAVALINK WRAPPERS, YOU SIMPLY CHANGE 'HTTP/WS' TO 'HTTPS/WSS' IN THE URI, OR SET A 'SECURE: TRUE' BOOLEAN FLAG IN THE NODE CONFIGURATION.", icon: Command, color: "blue" },
  { q: "DOES_ENCRYPTION_ADD_LATENCY?", a: "TLS 1.3 HANDSHAKES ADD NEGLIGIBLE OVERHEAD (MILLISECONDS) ONLY DURING THE INITIAL CONNECTION. CONTINUOUS AUDIO STREAMING EXPERIENCES ZERO PERFORMANCE DEGRADATION.", icon: Zap, color: "purple" },
  { q: "MY_WRAPPER_THROWS_CERT_ERRORS?", a: "ENSURE YOUR HOST MACHINE/SERVER HAS UPDATED CA CERTIFICATES (CA-CERTIFICATES PACKAGE IN LINUX). OUTDATED OS ENVIRONMENTS WILL REJECT MODERN LET'S ENCRYPT CERTIFICATES.", icon: AlertTriangle, color: "amber" },
  { q: "ARE_ALL_PUBLIC_NODES_SECURE?", a: "NO. ONLY NODES LISTED IN THIS SPECIFIC GRID HAVE BEEN VERIFIED TO HAVE VALID, NON-EXPIRED SSL CERTIFICATES CONFIGURED CORRECTLY.", icon: Shield, color: "cyan" },
  { q: "CAN_I_USE_IP_ADDRESSES_WITH_SSL?", a: "NO. SSL CERTIFICATES ARE BOUND TO DOMAIN NAMES. YOU MUST USE THE PROVIDED DOMAIN HOSTNAME FOR WSS CONNECTIONS, NOT THE RESOLVED IP.", icon: Globe, color: "rose" }
];

function CodeIconWrapper(props) {
  return <Terminal {...props} />;
}

export function NodeList({ filterSecure, title, description, icon }) {
  const { nodes, loading, fetchNodes, lastFetch } = useNodes();
  const [selectedNode, setSelectedNode] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCodeTab, setActiveCodeTab] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("uptime");

  const filtered = useMemo(() => {
    let result = nodes.filter(n => n.secure === filterSecure);
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n => 
        n.identifier?.toLowerCase().includes(q) || 
        n.host?.toLowerCase().includes(q) ||
        n.region?.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => {
      if (a.isConnected !== b.isConnected) return a.isConnected ? -1 : 1;
      
      if (sortBy === "uptime") {
        return (b.uptimeMillis || 0) - (a.uptimeMillis || 0);
      } else if (sortBy === "players") {
        const pA = parseInt(a.connections?.split("/")[0] || 0);
        const pB = parseInt(b.connections?.split("/")[0] || 0);
        return pB - pA;
      } else if (sortBy === "memory") {
        const mA = parseInt(a.memory?.replace(/\D/g, '') || 0);
        const mB = parseInt(b.memory?.replace(/\D/g, '') || 0);
        return mA - mB;
      }
      return 0;
    });
  }, [nodes, filterSecure, searchQuery, sortBy]);

  const online = filtered.filter(n => n.isConnected);
  const offline = filtered.filter(n => !n.isConnected);

  const formatAge = () => {
    if (!lastFetch) return "NEVER_SYNCED";
    const s = Math.floor((Date.now() - lastFetch) / 1000);
    if (s < 60) return `${s}S_AGO`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}M_AGO`;
    return `${Math.floor(m / 60)}H_AGO`;
  };

  const handleClick = (node) => {
    setSelectedNode(node);
    setDialogOpen(true);
  };

  return (
    <>
      <NodeDetailsDialog node={selectedNode} open={dialogOpen} onOpenChange={setDialogOpen} />

      <main className="relative z-10 w-full max-w-[1600px] mx-auto px-6 pt-12 pb-40">
        <style>{`
          @keyframes revealUp {
              from { opacity: 0; transform: translateY(40px); }
              to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideRight {
              from { opacity: 0; transform: translateX(-40px); }
              to { opacity: 1; transform: translateX(0); }
          }
          @keyframes matrixFade {
              0% { opacity: 0; }
              50% { opacity: 0.1; }
              100% { opacity: 0; }
          }
          @keyframes scanBeam {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(1000%); }
          }
          .animate-reveal { animation: revealUp 0.6s cubic-bezier(0, 0, 0.2, 1) forwards; opacity: 0; }
          .animate-slide { animation: slideRight 0.6s cubic-bezier(0, 0, 0.2, 1) forwards; opacity: 0; }
        `}</style>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/5 blur-[150px] pointer-events-none rounded-full"></div>

        <Link
          href="/"
          className="animate-slide inline-flex items-center gap-3 text-[#a1a1aa] font-black uppercase tracking-widest hover:text-emerald-400 transition-colors mb-12 group bg-[#000000] border-2 border-[#27272a] hover:border-emerald-400 px-6 py-4 shadow-[4px_4px_0px_0px_#27272a] hover:shadow-[6px_6px_0px_0px_#34d399] relative z-20"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
          RETURN_TO_MAIN_GRID
        </Link>

        <div className="animate-reveal flex flex-col xl:flex-row items-start xl:items-end justify-between gap-12 mb-16 pb-12 border-b-4 border-[#27272a] relative">
          <div className="absolute -left-6 top-0 w-2 h-full bg-emerald-500"></div>
          
          <div className="max-w-4xl pl-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-emerald-500 text-black flex items-center justify-center border-4 border-transparent shadow-[8px_8px_0px_0px_#f4f4f5] relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover:translate-y-full transition-transform duration-700 ease-in-out"></div>
                <div className="relative z-10">{icon}</div>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white">
                {title}
              </h1>
            </div>
            <p className="text-[#a1a1aa] text-xl md:text-2xl font-bold leading-relaxed uppercase tracking-widest">
              {description}
            </p>
          </div>

          <button
            onClick={() => fetchNodes(true)}
            disabled={loading}
            className={`flex items-center justify-center gap-4 px-10 py-6 border-4 font-black tracking-widest uppercase transition-all shadow-[8px_8px_0px_0px] text-lg w-full xl:w-auto ${loading
                ? 'bg-[#27272a] border-[#52525b] text-[#a1a1aa] shadow-[#52525b]'
                : 'bg-[#000000] border-[#27272a] text-white hover:border-emerald-500 hover:text-emerald-500 shadow-[#27272a] hover:shadow-emerald-500 hover:-translate-y-2 hover:-translate-x-2'
            }`}
          >
            <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
            {loading ? "ESTABLISHING_HANDSHAKE..." : "SYNC_SECURE_GRID"}
          </button>
        </div>

        <div className="animate-reveal bg-[#09090b] border-4 border-[#27272a] p-8 shadow-[12px_12px_0px_0px_#27272a] mb-24 relative overflow-hidden" style={{ animationDelay: '100ms' }}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8 mb-8">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" size={24} />
              <input 
                type="text" 
                placeholder="QUERY SECURE IDENTIFIER..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-20 bg-[#000000] border-2 border-[#3f3f46] pl-16 pr-6 text-white text-lg font-black uppercase tracking-widest placeholder-[#52525b] outline-none focus:border-emerald-500 transition-all shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.5)]"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-20 bg-[#000000] border-2 border-[#3f3f46] px-6 text-white text-sm font-black uppercase tracking-widest outline-none focus:border-emerald-500 appearance-none cursor-pointer"
              >
                <option value="uptime">SORT_BY: UPTIME</option>
                <option value="players">SORT_BY: LOAD</option>
                <option value="memory">SORT_BY: MEMORY</option>
              </select>
              
              <div className="flex h-20 bg-[#000000] border-2 border-[#3f3f46]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-6 flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-emerald-500 text-black" : "text-[#52525b] hover:text-white"}`}
                >
                  <LayoutGrid size={24} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-6 flex items-center justify-center transition-colors ${viewMode === "list" ? "bg-emerald-500 text-black" : "text-[#52525b] hover:text-white"}`}
                >
                  <List size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t-2 border-[#27272a] pt-8">
            <div className="flex flex-col gap-2 p-6 border-l-4 border-emerald-500 bg-[#000000]">
              <span className="text-xs font-black uppercase tracking-widest text-[#a1a1aa] flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" /> SECURE_CONNECTIONS
              </span>
              <span className="text-4xl font-black text-white tabular-nums tracking-tighter">{loading ? "—" : online.length}</span>
            </div>
            <div className="flex flex-col gap-2 p-6 border-l-4 border-red-500 bg-[#000000]">
              <span className="text-xs font-black uppercase tracking-widest text-[#a1a1aa] flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" /> HANDSHAKE_FAILURES
              </span>
              <span className="text-4xl font-black text-white tabular-nums tracking-tighter">{loading ? "—" : offline.length}</span>
            </div>
            <div className="flex flex-col gap-2 p-6 border-l-4 border-[#52525b] bg-[#000000]">
              <span className="text-xs font-black uppercase tracking-widest text-[#a1a1aa] flex items-center gap-2">
                <Activity size={16} className="text-[#52525b]" /> LAST_VERIFICATION
              </span>
              <span className="text-2xl font-black text-white uppercase tracking-widest mt-auto">{formatAge()}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-60 gap-8 border-4 border-[#27272a] bg-[#09090b] shadow-[16px_16px_0px_0px_#27272a]">
            <div className="relative">
              <Loader2 size={80} className="animate-spin text-emerald-500 relative z-10" />
              <div className="absolute inset-0 blur-xl bg-emerald-500/30 animate-pulse"></div>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="text-white font-black tracking-widest uppercase text-3xl">NEGOTIATING_TLS_HANDSHAKES</span>
              <span className="text-[#a1a1aa] font-bold tracking-widest text-lg border-2 border-[#27272a] px-6 py-2 bg-[#000000]">AWAITING CERTIFICATE VALIDATION...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-40">
            {online.length > 0 && (
              <section>
                <div className="flex items-center gap-6 mb-16">
                  <div className="w-24 h-4 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                    VERIFIED_SECURE_GRID
                  </h2>
                  <div className="hidden md:block h-1 flex-1 bg-gradient-to-r from-[#27272a] to-transparent ml-8"></div>
                </div>
                
                <div className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
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
                <div className="flex items-center gap-6 mb-16">
                  <div className="w-24 h-4 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#a1a1aa]">
                    CONNECTION_REFUSED
                  </h2>
                  <div className="hidden md:block h-1 flex-1 bg-gradient-to-r from-[#27272a] to-transparent ml-8"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 opacity-50 hover:opacity-100 transition-opacity duration-500 filter grayscale hover:grayscale-0">
                  {offline.map((n, i) => (
                    <div key={`off-${n.identifier}`} className="animate-reveal" style={{ animationDelay: `${(i % 10) * 50}ms` }}>
                      <NodeCard node={n} onClick={handleClick} minimal={true} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-60 bg-[#09090b] border-4 border-dashed border-[#52525b] flex flex-col items-center justify-center gap-10">
                <div className="relative">
                  <ShieldAlert size={80} className="text-[#52525b]" />
                  <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-white font-black uppercase tracking-widest text-4xl">NO_SECURE_NODES_FOUND</h3>
                  <p className="text-[#a1a1aa] font-bold uppercase tracking-widest text-xl">ADJUST_QUERY_PARAMETERS_OR_AWAIT_NETWORK_PROPAGATION</p>
                </div>
              </div>
            )}

            <section className="animate-reveal border-t-4 border-[#27272a] pt-32">
              <div className="flex flex-col xl:flex-row gap-20 items-start">
                <div className="w-full xl:w-1/3 space-y-10 sticky top-32">
                  <div className="inline-flex items-center gap-4 px-8 py-4 bg-emerald-500/10 border-l-8 border-emerald-500">
                    <CodeIconWrapper size={28} className="text-emerald-500" />
                    <span className="text-base font-black text-emerald-400 uppercase tracking-widest">TLS_IMPLEMENTATION</span>
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                    SECURE<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">INTEGRATION</span>
                  </h2>
                  <p className="text-[#a1a1aa] text-xl font-bold uppercase tracking-wide leading-relaxed">
                    UPGRADING TO WSS REQUIRES MINIMAL CODE CHANGES. SELECT YOUR WRAPPER TO VIEW THE ENCRYPTED HANDSHAKE BOILERPLATE.
                  </p>
                  <div className="flex flex-col gap-4">
                    {WSS_CODE_SNIPPETS.map((snippet, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveCodeTab(idx)}
                        className={`flex items-center justify-between px-8 py-6 border-4 font-black uppercase tracking-widest transition-all text-lg ${
                          activeCodeTab === idx 
                            ? `bg-[#09090b] border-${snippet.color}-500 text-white shadow-[8px_8px_0px_0px]` 
                            : "bg-[#000000] border-[#27272a] text-[#52525b] hover:border-[#52525b] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-6">
                          <snippet.icon size={24} className={activeCodeTab === idx ? `text-${snippet.color}-500` : ""} />
                          {snippet.language}
                        </div>
                        <ChevronRight size={24} className={`transition-transform ${activeCodeTab === idx ? "translate-x-3" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-full xl:w-2/3">
                  <div className="bg-[#09090b] border-4 border-[#27272a] p-2 shadow-[16px_16px_0px_0px_#27272a] relative group">
                    <div className="absolute top-0 right-0 px-6 py-3 bg-[#27272a] text-white text-sm font-black uppercase tracking-widest z-10">
                      {WSS_CODE_SNIPPETS[activeCodeTab].language}
                    </div>
                    <div className="absolute top-0 left-0 px-6 py-3 bg-emerald-500 text-black text-sm font-black uppercase tracking-widest z-10 flex items-center gap-2">
                      <Lock size={16} /> ENCRYPTED_CHANNEL
                    </div>
                    <div className="bg-[#000000] p-10 pt-24 min-h-[600px] overflow-x-auto relative">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEgMWgydjJIMXoiIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] opacity-20 pointer-events-none"></div>
                      <pre className="text-base md:text-lg text-[#a1a1aa] font-mono leading-loose relative z-10">
                        <code dangerouslySetInnerHTML={{ __html: WSS_CODE_SNIPPETS[activeCodeTab].code.replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-emerald-400">$1</span>').replace(/(const|let|var|class|import|from|require|function|async|await|return|super|def|True)/g, '<span class="text-cyan-400">$1</span>').replace(/(wss?:\/\/[^\s'"]+)/g, '<span class="text-rose-400 font-bold underline">$1</span>') }} />
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="animate-reveal">
              <div className="bg-[#09090b] border-4 border-[#27272a] p-12 lg:p-24 relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-4 px-8 py-4 bg-[#000000] border-2 border-[#3f3f46] mb-8">
                      <Lock size={24} className="text-emerald-500" />
                      <span className="text-lg font-black text-white uppercase tracking-widest">ENCRYPTION_STANDARDS</span>
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-white mb-8">
                      WHY_ENFORCE_SSL?
                    </h2>
                    <p className="text-[#a1a1aa] text-2xl font-bold uppercase tracking-widest max-w-4xl mx-auto leading-relaxed">
                      PUBLIC NETWORKS ARE HOSTILE. SECURE WEBSOCKETS GUARANTEE THAT YOUR BOT'S COMMANDS AND METADATA REMAIN IMPENETRABLE.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {SSL_FEATURES.map((feature, i) => (
                      <div key={i} className="bg-[#000000] border-2 border-[#3f3f46] p-10 hover:border-emerald-500 hover:shadow-[8px_8px_0px_0px_#10b981] hover:-translate-y-2 transition-all flex flex-col group">
                        <div className={`w-20 h-20 bg-${feature.color}-500/10 border-2 border-${feature.color}-500/50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                          <feature.icon size={36} className={`text-${feature.color}-500`} />
                        </div>
                        <h4 className="text-white font-black uppercase tracking-widest text-2xl mb-6 leading-tight">
                          {feature.title}
                        </h4>
                        <p className="text-[#a1a1aa] leading-loose font-bold uppercase tracking-wide text-sm">
                          {feature.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="animate-reveal">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-emerald-500 text-black p-12 lg:p-20 shadow-[16px_16px_0px_0px_#27272a]">
                <div className="max-w-2xl">
                  <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-none mb-6">
                    TLS_HANDSHAKE_PIPELINE
                  </h2>
                  <p className="text-black/80 font-bold uppercase tracking-widest text-xl leading-relaxed">
                    VISUALIZING THE CRYPTOGRAPHIC NEGOTIATION BETWEEN YOUR BOT ENVIRONMENT AND THE LAVALINK DIRECTORY NODES.
                  </p>
                </div>
                <div className="w-full lg:w-auto flex flex-col gap-4 relative">
                  <div className="absolute top-1/2 left-8 w-1 h-full bg-black/20 -translate-y-1/2 z-0 hidden sm:block"></div>
                  {ENCRYPTION_STEPS.map((step, i) => (
                    <div key={i} className="flex items-center gap-6 relative z-10 bg-black text-white p-6 w-full lg:w-[450px] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:translate-x-1 transition-transform">
                      <div className="w-12 h-12 shrink-0 bg-emerald-500 text-black flex items-center justify-center">
                        <step.icon size={24} />
                      </div>
                      <div>
                        <h4 className="font-black uppercase tracking-widest text-emerald-400 mb-1">{step.title}</h4>
                        <p className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wide">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="animate-reveal">
              <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20 border-b-4 border-[#27272a] pb-8">
                <div>
                  <h2 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase text-white mb-6">CERTIFICATE_FAQ</h2>
                  <p className="text-[#a1a1aa] text-2xl font-bold uppercase tracking-widest">TROUBLESHOOTING SECURE CONNECTIONS</p>
                </div>
                <div className="bg-[#27272a] px-8 py-4 text-white font-black uppercase tracking-widest text-lg">
                  {FAQS.length} RECORDS ACCESSED
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
                {FAQS.map((faq, i) => (
                  <div key={i} className="group border-2 border-transparent hover:border-[#27272a] p-6 transition-colors">
                    <div className="flex items-start gap-8">
                      <div className="mt-2 w-16 h-16 shrink-0 bg-[#000000] border-4 border-[#27272a] flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all shadow-[4px_4px_0px_0px_#27272a]">
                        <faq.icon size={28} className={`text-${faq.color}-500 group-hover:text-black transition-colors`} />
                      </div>
                      <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xl mb-4 group-hover:text-emerald-500 transition-colors leading-tight">
                          {faq.q}
                        </h4>
                        <p className="text-base text-[#a1a1aa] leading-loose font-bold uppercase tracking-wide border-l-4 border-[#27272a] pl-6 group-hover:border-emerald-500 transition-colors">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}

export default function SSLNodesPage() {
  return (
    <div className="min-h-screen bg-[#000000] font-sans text-foreground pb-20 selection:bg-emerald-500 selection:text-black">
      <Navbar activeTab="ssl" />

      <NodeList
        filterSecure={true}
        title={<>WSS_ENCRYPTED<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">LAVALINK_NODES</span></>}
        description="A VERIFIED REGISTRY OF FREE PUBLIC SECURE LAVALINK NODES REQUIRING STRICT TLS CERTIFICATE VALIDATION."
        icon={<Lock className="w-12 h-12 text-black" />}
      />
      <Footer />
    </div>
  );
}