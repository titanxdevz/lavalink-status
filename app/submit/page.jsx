"use client";
import { useState } from "react";
import { 
    Server, Shield, Globe, MessageSquare, 
    Lock, Hash, User, ExternalLink, ArrowRight, Loader2, Tag, ChevronLeft,
    CheckCircle2, Sparkles, AlertCircle
} from "lucide-react";
import { useNodes } from "@/contexts/NodesContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SubmitPage() {
    const { submitNode } = useNodes();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        identifier: "",
        host: "",
        port: "2333",
        password: "youshallnotpass",
        secure: false,
        restVersion: "v4",
        authorId: "",
        website: "",
        discord: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await submitNode(formData);
            setSuccess(true);
            setTimeout(() => {
                window.location.href = "/";
            }, 3500);
        } catch (err) {
            setError(err.message || "Failed to submit node");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans relative">
            <Navbar activeTab="submit" />
            
            {/* Background elements */}
             <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.1),transparent_70%)]" />
            </div>

            <main className="container mx-auto px-6 py-20 max-w-4xl relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 text-sm font-medium">
                    <ChevronLeft size={16} /> Back to Directory
                </Link>

                {success ? (
                    <div className="glass-card rounded-[32px] p-20 text-center animate-fade-up relative overflow-hidden">
                        <div className="absolute inset-0 bg-green-500/5 mix-blend-screen opacity-50" />
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                                <CheckCircle2 size={48} className="text-green-500" />
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter mb-4">Submission Received!</h2>
                            <p className="text-white/40 text-lg max-w-md mx-auto mb-10 leading-relaxed">
                                Your node has been entered into our manual review queue. 
                                We'll verify it shortly and list it in the community directory.
                            </p>
                            <div className="flex items-center justify-center gap-3 text-sm font-bold text-white/30 uppercase tracking-[0.2em]">
                                <div className="w-8 h-[1px] bg-white/10" />
                                Redirecting you home
                                <div className="w-8 h-[1px] bg-white/10" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Summary Column */}
                        <div className="lg:col-span-5 space-y-10">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">
                                    Community Growth
                                </div>
                                <h1 className="text-6xl font-black tracking-tighter leading-[0.9]">
                                    List Your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Node</span> Node.
                                </h1>
                                <p className="text-white/40 text-lg leading-relaxed">
                                    Help thousands of bot developers by providing a reliable public Lavalink node. 
                                    High performance nodes get featured on our landing page.
                                </p>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/5">
                                {[
                                    { title: "Manual Review", desc: "Our admins test every node for connectivity and version compatibility.", icon: Shield },
                                    { title: "Global Analytics", desc: "Get insights into how many bot connections your node is handling.", icon: Globe },
                                    { title: "Trusted Status", desc: "Verified providers receive a special badge in the directory.", icon: Sparkles }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-all transition-colors">
                                            <item.icon size={18} className="text-white/40 group-hover:text-white" />
                                         </div>
                                         <div>
                                            <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                                            <p className="text-xs text-white/30 leading-relaxed">{item.desc}</p>
                                         </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-7">
                            <form onSubmit={handleSubmit} className="space-y-8 glass-card p-1 rounded-[32px] overflow-hidden border-white/5">
                                <div className="bg-[#0a0a0a] rounded-[30px] p-8 md:p-10 space-y-10">
                                    {/* Section: Node Credentials */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                <Hash size={16} />
                                            </div>
                                            <h3 className="font-black uppercase tracking-widest text-xs text-white/40">Node Credentials</h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Identifier</label>
                                                <input 
                                                    type="text" name="identifier" required placeholder="Lavalink-US-East" 
                                                    value={formData.identifier} onChange={handleChange}
                                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10"
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Host Host</label>
                                                    <input 
                                                        type="text" name="host" required placeholder="example.host.com" 
                                                        value={formData.host} onChange={handleChange}
                                                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Port</label>
                                                    <input 
                                                        type="number" name="port" required placeholder="2333" 
                                                        value={formData.port} onChange={handleChange}
                                                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm outline-none focus:border-blue-500/50 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Node Password</label>
                                                <div className="relative">
                                                    <input 
                                                        type="password" name="password" required placeholder="youshallnotpass" 
                                                        value={formData.password} onChange={handleChange}
                                                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10"
                                                    />
                                                    <Lock size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Configuration */}
                                    <div className="space-y-6">
                                         <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                                <Settings size={16} />
                                            </div>
                                            <h3 className="font-black uppercase tracking-widest text-xs text-white/40">Configuration</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div 
                                                className={`flex items-center justify-between px-5 h-14 rounded-2xl border cursor-pointer transition-all ${formData.secure ? 'bg-blue-500/5 border-blue-500/30' : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'}`}
                                                onClick={() => setFormData(p => ({...p, secure: !p.secure}))}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Shield size={16} className={formData.secure ? "text-blue-500" : "text-white/20"} />
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold leading-none mb-1">SSL Secure</span>
                                                        <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Connect via WSS</span>
                                                    </div>
                                                </div>
                                                <input type="checkbox" checked={formData.secure} readOnly className="sr-only" />
                                                <div className={`w-4 h-4 rounded-full border-2 transition-all ${formData.secure ? 'bg-blue-500 border-blue-400 scale-110 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-white/10'}`} />
                                            </div>
                                            
                                            <div className="relative">
                                                <select 
                                                    name="restVersion" value={formData.restVersion} onChange={handleChange}
                                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm outline-none focus:border-blue-500/50 appearance-none transition-all"
                                                >
                                                    <option value="v4">Lavalink v4</option>
                                                    <option value="v3">Lavalink v3</option>
                                                </select>
                                                <Tag size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Ownership */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                                                <User size={16} />
                                            </div>
                                            <h3 className="font-black uppercase tracking-widest text-xs text-white/40">Ownership Details</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Creator / Studio Name</label>
                                                <input 
                                                    type="text" name="authorId" required placeholder="Lavalink Community" 
                                                    value={formData.authorId} onChange={handleChange}
                                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Discord Invite (Optional)</label>
                                                <input 
                                                    type="url" name="discord" placeholder="https://discord.gg/invite" 
                                                    value={formData.discord} onChange={handleChange}
                                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-3 p-5 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 animate-in fade-in zoom-in-95">
                                            <AlertCircle size={20} className="flex-shrink-0" />
                                            <p className="text-sm font-bold">{error}</p>
                                        </div>
                                    )}

                                    <Button 
                                        type="submit" disabled={loading}
                                        className="w-full h-16 bg-white text-black text-lg font-black hover:bg-white/90 rounded-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 size={24} className="animate-spin" /> : <>Submit Node to Directory <ArrowRight size={22} className="ml-2" /></>}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

function Settings({ size, className }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}
