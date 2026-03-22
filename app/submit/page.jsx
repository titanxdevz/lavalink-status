"use client";
import { useState } from "react";
import {
    Server, Shield, Globe, MessageSquare,
    Lock, Hash, User, ArrowRight, Loader2, Tag, ChevronLeft, Check, Terminal, Cpu
} from "lucide-react";
import { useNodes } from "@/contexts/NodesContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

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
            }, 3000);
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
        <div className="min-h-screen bg-[#000000] text-[#f4f4f5] font-mono selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
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
                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(-40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-reveal { animation: revealUp 0.6s cubic-bezier(0, 0, 0.2, 1) forwards; opacity: 0; }
                .animate-slide { animation: slideRight 0.6s cubic-bezier(0, 0, 0.2, 1) forwards; opacity: 0; }
            `}</style>

            <Navbar />

            <main className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-40">
                <Link
                    href="/"
                    className="animate-slide inline-flex items-center gap-3 text-[#a1a1aa] font-black uppercase tracking-widest hover:text-white transition-colors mb-12 group bg-[#09090b] border-2 border-[#27272a] hover:border-white px-4 py-2"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    ABORT / RETURN
                </Link>

                <div className="animate-reveal mb-16 border-b-2 border-[#27272a] pb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-blue-500 text-black flex items-center justify-center border-2 border-transparent shadow-[4px_4px_0px_0px_#f4f4f5]">
                            <Terminal size={32} />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-white">
                            INIT_NODE
                        </h1>
                    </div>
                    <p className="text-[#a1a1aa] text-xl font-medium leading-relaxed uppercase tracking-wide max-w-2xl">
                        Submit your public Lavalink node to the grid.
                        Awaiting manual verification protocol.
                    </p>
                </div>

                {success ? (
                    <div className="animate-reveal bg-[#09090b] border-2 border-emerald-500 p-12 text-center shadow-[12px_12px_0px_0px_#10b981]">
                        <div className="w-24 h-24 bg-emerald-500 text-black flex items-center justify-center mx-auto mb-8 border-4 border-[#000000] shadow-[8px_8px_0px_0px_#f4f4f5]">
                            <Check size={48} />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-4">Transmission Successful</h2>
                        <p className="text-[#a1a1aa] text-lg font-black uppercase tracking-widest">
                            Node entered into review queue. Redirecting to main grid...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-12">

                        <div className="animate-reveal space-y-8 bg-[#09090b] border-2 border-[#27272a] p-8 md:p-10 shadow-[8px_8px_0px_0px_#27272a] hover:border-[#52525b] transition-colors" style={{ animationDelay: '100ms' }}>
                            <div className="flex items-center gap-4 border-b-2 border-[#27272a] pb-6 mb-8">
                                <Server className="text-blue-500" size={28} />
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Target Parameters</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Identifier</label>
                                    <div className="flex items-center gap-4 bg-[#000000] border-2 border-[#27272a] px-4 py-4 focus-within:border-blue-500 focus-within:shadow-[6px_6px_0px_0px_#3b82f6] transition-all">
                                        <Hash size={20} className="text-[#52525b]" />
                                        <input type="text" name="identifier" required placeholder="LAVALINK-EU-01" value={formData.identifier} onChange={handleChange} className="bg-transparent border-none outline-none text-white w-full font-black uppercase placeholder-[#52525b]" />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Host Address</label>
                                    <div className="flex items-center gap-4 bg-[#000000] border-2 border-[#27272a] px-4 py-4 focus-within:border-blue-500 focus-within:shadow-[6px_6px_0px_0px_#3b82f6] transition-all">
                                        <Globe size={20} className="text-[#52525b]" />
                                        <input type="text" name="host" required placeholder="NODE.EXAMPLE.COM" value={formData.host} onChange={handleChange} className="bg-transparent border-none outline-none text-white w-full font-black uppercase placeholder-[#52525b]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Port</label>
                                    <div className="flex items-center gap-4 bg-[#000000] border-2 border-[#27272a] px-4 py-4 focus-within:border-blue-500 focus-within:shadow-[6px_6px_0px_0px_#3b82f6] transition-all">
                                        <Terminal size={20} className="text-[#52525b]" />
                                        <input type="number" name="port" required placeholder="2333" value={formData.port} onChange={handleChange} className="bg-transparent border-none outline-none text-white w-full font-black uppercase placeholder-[#52525b]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Auth Key</label>
                                    <div className="flex items-center gap-4 bg-[#000000] border-2 border-[#27272a] px-4 py-4 focus-within:border-blue-500 focus-within:shadow-[6px_6px_0px_0px_#3b82f6] transition-all">
                                        <Lock size={20} className="text-[#52525b]" />
                                        <input type="text" name="password" required placeholder="YOUSHALLNOTPASS" value={formData.password} onChange={handleChange} className="bg-transparent border-none outline-none text-white w-full font-black uppercase placeholder-[#52525b]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="animate-reveal space-y-8 bg-[#09090b] border-2 border-[#27272a] p-8 md:p-10 shadow-[8px_8px_0px_0px_#27272a] hover:border-[#52525b] transition-colors" style={{ animationDelay: '200ms' }}>
                            <div className="flex items-center gap-4 border-b-2 border-[#27272a] pb-6 mb-8">
                                <Cpu className="text-blue-500" size={28} />
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-white">System Flags</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div
                                    className={`flex items-center gap-6 p-6 border-2 cursor-pointer transition-all ${formData.secure
                                            ? 'bg-blue-500/10 border-blue-500 shadow-[6px_6px_0px_0px_#3b82f6]'
                                            : 'bg-[#000000] border-[#27272a] hover:border-white'
                                        }`}
                                    onClick={() => setFormData(p => ({ ...p, secure: !p.secure }))}
                                >
                                    <Shield size={32} className={formData.secure ? "text-blue-500" : "text-[#52525b]"} />
                                    <div className="flex-1">
                                        <div className={`text-xl font-black tracking-tighter uppercase mb-1 ${formData.secure ? 'text-blue-500' : 'text-white'}`}>SECURE_SSL</div>
                                        <div className="text-xs font-black text-[#a1a1aa] uppercase tracking-widest">HTTPS/WSS REQUIRED</div>
                                    </div>
                                    <div className={`w-6 h-6 border-2 flex items-center justify-center ${formData.secure ? 'border-blue-500 bg-blue-500' : 'border-[#52525b] bg-transparent'}`}>
                                        {formData.secure && <Check size={16} className="text-black" />}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">API Version</label>
                                    <div className="flex items-center gap-4 bg-[#000000] border-2 border-[#27272a] px-4 py-4 focus-within:border-blue-500 focus-within:shadow-[6px_6px_0px_0px_#3b82f6] transition-all h-[92px]">
                                        <Tag size={20} className="text-[#52525b]" />
                                        <select name="restVersion" value={formData.restVersion} onChange={handleChange} className="bg-transparent border-none outline-none text-white w-full font-black uppercase appearance-none cursor-pointer">
                                            <option value="v4">LAVALINK_V4</option>
                                            <option value="v3">LAVALINK_V3</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="animate-reveal space-y-8 bg-[#09090b] border-2 border-[#27272a] p-8 md:p-10 shadow-[8px_8px_0px_0px_#27272a] hover:border-[#52525b] transition-colors" style={{ animationDelay: '300ms' }}>
                            <div className="flex items-center gap-4 border-b-2 border-[#27272a] pb-6 mb-8">
                                <User className="text-blue-500" size={28} />
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Operator Registry</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Designation / Alias</label>
                                    <div className="flex items-center gap-4 bg-[#000000] border-2 border-[#27272a] px-4 py-4 focus-within:border-blue-500 focus-within:shadow-[6px_6px_0px_0px_#3b82f6] transition-all">
                                        <User size={20} className="text-[#52525b]" />
                                        <input type="text" name="authorId" required placeholder="SYS_ADMIN_01" value={formData.authorId} onChange={handleChange} className="bg-transparent border-none outline-none text-white w-full font-black uppercase placeholder-[#52525b]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Web Uplink (OPTIONAL)</label>
                                    <div className="flex items-center gap-4 bg-[#000000] border-2 border-[#27272a] px-4 py-4 focus-within:border-blue-500 focus-within:shadow-[6px_6px_0px_0px_#3b82f6] transition-all">
                                        <Globe size={20} className="text-[#52525b]" />
                                        <input type="url" name="website" placeholder="HTTPS://..." value={formData.website} onChange={handleChange} className="bg-transparent border-none outline-none text-white w-full font-black uppercase placeholder-[#52525b]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Comms Link (OPTIONAL)</label>
                                    <div className="flex items-center gap-4 bg-[#000000] border-2 border-[#27272a] px-4 py-4 focus-within:border-blue-500 focus-within:shadow-[6px_6px_0px_0px_#3b82f6] transition-all">
                                        <MessageSquare size={20} className="text-[#52525b]" />
                                        <input type="url" name="discord" placeholder="DISCORD.GG/..." value={formData.discord} onChange={handleChange} className="bg-transparent border-none outline-none text-white w-full font-black uppercase placeholder-[#52525b]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="animate-reveal bg-red-500/10 border-2 border-red-500 p-6 text-red-500 font-black uppercase tracking-widest text-sm flex items-center gap-4 shadow-[4px_4px_0px_0px_#ef4444]" style={{ animationDelay: '400ms' }}>
                                <Terminal size={24} />
                                ERR: {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`animate-reveal w-full py-8 border-2 font-black text-2xl tracking-widest uppercase flex items-center justify-center gap-6 transition-all shadow-[8px_8px_0px_0px] ${loading
                                    ? 'bg-[#27272a] border-[#52525b] text-[#a1a1aa] shadow-[#52525b]'
                                    : 'bg-blue-500 border-blue-500 text-black shadow-[#f4f4f5] hover:bg-white hover:border-white hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0px_0px_#f4f4f5]'
                                }`}
                            style={{ animationDelay: '500ms' }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={32} className="animate-spin" />
                                    PROCESSING...
                                </>
                            ) : (
                                <>
                                    EXECUTE_SUBMIT <ArrowRight size={32} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </main>

            <Footer />
        </div>
    );
}