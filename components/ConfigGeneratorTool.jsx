"use client";
import { useState } from "react";
import { Code, Copy, Check, FileJson, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const LIBRARIES = {
    "application.yml": {
        language: "yaml",
        generate: (n) => `lavalink:
  server:
    password: "${n.password}"
    address: ${n.host}
    port: ${n.port}
    http-address: 0.0.0.0
    http-port: ${n.port}
    sources:
      youtube: true
      bandcamp: true
      soundcloud: true
      twitch: true
      vimeo: true
      mixer: true
      http: true
      local: false
    bufferDurationMs: 400
    frameBufferMs: 5000
    opusEncodingQuality: 10
    resamplingQuality: LOW
    trackStuckThresholdMs: 10000
    useSeekGhosting: true
    youtubePlaylistLoadLimit: 6
    playerUpdateInterval: 5
    youtubeSearchEnabled: true
    soundcloudSearchEnabled: true
    gc-logs: false
metrics:
  prometheus:
    enabled: false
    endpoint: /metrics

sentry:
  dsn: ""
  environment: ""

logging:
  file:
    max-history: 30
    max-size: 1GB
  path: ./logs/

  level:
    root: INFO
    lavalink: INFO

  request:
    enabled: true
    includeClientInfo: true
    includeHeaders: false
    includeQueryString: true
    includePayload: true
    maxPayloadLength: 10000`
    },
    "Discord.js (Erela.js)": {
        language: "javascript",
        generate: (n) => `const { Manager } = require("erela.js");

const nodes = [
  {
    host: "${n.host}",
    port: ${n.port},
    password: "${n.password}",
    secure: ${n.secure}
  }
];

const manager = new Manager({
  nodes,
  send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});`
    },
    "Discord.py (Wavelink)": {
        language: "python",
        generate: (n) => `import wavelink

async def setup_nodes():
    node: wavelink.Node = wavelink.Node(
        uri='${n.secure ? "https" : "http"}://${n.host}:${n.port}',
        password='${n.password}'
    )
    await wavelink.Pool.connect(nodes=[node], client=bot)`
    },
    "Disnake (Lavalink.py)": {
        language: "python",
        generate: (n) => `import lavalink

class MusicBot(commands.Bot):
    def __init__(self):
        super().__init__(command_prefix="!")
        self.lavalink = None

    async def on_ready(self):
        self.lavalink = lavalink.Client(self.user.id)
        self.lavalink.add_node(
            '${n.host}',
            ${n.port},
            '${n.password}',
            '${n.region || "us"}',
            'default-node'
        )`
    }
};

export function ConfigGeneratorTool() {
    const [selectedLib, setSelectedLib] = useState("application.yml");
    const [copied, setCopied] = useState(false);
    const [node, setNode] = useState({
        host: "node1.lavalink.net",
        port: 2333,
        password: "youshallnotpass",
        secure: false
    });

    const config = LIBRARIES[selectedLib].generate(node);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(config);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full mix-blend-screen blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Code size={20} className="text-purple-500" />
                </div>
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Config Generator</h3>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Quick-start templates for your bot</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">Host</label>
                    <input 
                        type="text" value={node.host} 
                        onChange={(e) => setNode({...node, host: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-purple-500/50 outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">Port</label>
                    <input 
                        type="number" value={node.port} 
                        onChange={(e) => setNode({...node, port: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-purple-500/50 outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">Password</label>
                    <input 
                        type="text" value={node.password} 
                        onChange={(e) => setNode({...node, password: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-purple-500/50 outline-none"
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {Object.keys(LIBRARIES).map(lib => (
                            <button
                                key={lib}
                                onClick={() => setSelectedLib(lib)}
                                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedLib === lib ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                            >
                                {lib}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={copyToClipboard}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 transition-all flex items-center gap-2"
                    >
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        <span className="text-[10px] font-bold hidden sm:inline">{copied ? "COPIED" : "COPY"}</span>
                    </button>
                </div>

                <div className="flex-1 relative bg-black/40 rounded-xl border border-white/5 overflow-hidden flex flex-col font-mono">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-pink-500/50 opactiy-50" />
                    <pre className="p-4 text-[11px] leading-relaxed overflow-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <code className={`language-${LIBRARIES[selectedLib].language}`}>
                            {config}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    );
}
