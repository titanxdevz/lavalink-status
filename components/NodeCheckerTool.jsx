"use client";
import { useState } from "react";
import { Server, Shield, Lock, Activity, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NodeCheckerTool() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [formData, setFormData] = useState({
        host: "",
        port: "2333",
        password: "youshallnotpass",
        secure: false,
        restVersion: "v4"
    });

    const handleCheck = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch("/api/nodes/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            setResult({ connected: false, error: err.message });
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
        <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full mix-blend-screen blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Activity size={20} className="text-blue-500" />
                </div>
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Public Node Checker</h3>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Instantly verify any Lavalink server</p>
                </div>
            </div>

            <form onSubmit={handleCheck} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">Host / IP Address</label>
                        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus-within:border-blue-500/50 transition-all">
                            <Server size={14} className="text-white/20" />
                            <input 
                                type="text" name="host" required placeholder="lavalink.example.com" 
                                value={formData.host} onChange={handleChange}
                                className="bg-transparent border-none outline-none text-sm w-full"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">Port</label>
                        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus-within:border-blue-500/50 transition-all">
                             <input 
                                type="number" name="port" required placeholder="2333" 
                                value={formData.port} onChange={handleChange}
                                className="bg-transparent border-none outline-none text-sm w-full"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">Password</label>
                        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus-within:border-blue-500/50 transition-all">
                            <Lock size={14} className="text-white/20" />
                            <input 
                                type="text" name="password" required placeholder="youshallnotpass" 
                                value={formData.password} onChange={handleChange}
                                className="bg-transparent border-none outline-none text-sm w-full"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 mt-auto">
                        <div 
                            className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border transition-all cursor-pointer ${formData.secure ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/10'}`}
                            onClick={() => setFormData(p => ({...p, secure: !p.secure}))}
                        >
                            <Shield size={14} className={formData.secure ? "text-blue-500" : "text-white/20"} />
                            <span className="text-xs font-medium">SSL / Secure</span>
                        </div>
                        <select 
                            name="restVersion" value={formData.restVersion} onChange={handleChange}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 h-[46px] text-xs outline-none focus:border-blue-500/50"
                        >
                            <option value="v4">v4</option>
                            <option value="v3">v3</option>
                        </select>
                    </div>
                </div>

                <Button 
                    type="submit" disabled={loading}
                    className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : "Check Node Status"}
                </Button>
            </form>

            {(result || loading) && (
                <div className="mt-8 pt-8 border-t border-white/10 animate-fade-in">
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <div className="text-center space-y-3">
                                <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
                                <p className="text-sm text-white/40">Performing connectivity tests...</p>
                            </div>
                        </div>
                    ) : (
                        <div className={`p-5 rounded-2xl border ${result.connected ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                             <div className="flex items-center gap-3 mb-4">
                                {result.connected ? (
                                    <>
                                        <CheckCircle2 className="text-green-500" size={24} />
                                        <div>
                                            <h4 className="font-bold text-green-500">Node Connected Successfully</h4>
                                            <p className="text-xs text-green-500/60 leading-none">Response received in {result.responseTime || 'unknown'}ms</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="text-red-500" size={24} />
                                        <div>
                                            <h4 className="font-bold text-red-500">Connection Failed</h4>
                                            <p className="text-xs text-red-500/60 leading-none">{result.error}</p>
                                        </div>
                                    </>
                                )}
                             </div>

                             {result.connected && result.stats && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <p className="text-[10px] text-white/30 uppercase font-black mb-1">Playing</p>
                                        <p className="text-sm font-bold">{result.stats.playingPlayers || 0} / {result.stats.players || 0}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <p className="text-[10px] text-white/30 uppercase font-black mb-1">Cores</p>
                                        <p className="text-sm font-bold">{result.stats.cpu?.cores || 0} Cores</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <p className="text-[10px] text-white/30 uppercase font-black mb-1">System Load</p>
                                        <p className="text-sm font-bold">{(result.stats.cpu?.systemLoad * 100 || 0).toFixed(2)}%</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <p className="text-[10px] text-white/30 uppercase font-black mb-1">Lavalink Load</p>
                                        <p className="text-sm font-bold">{(result.stats.cpu?.lavalinkLoad * 100 || 0).toFixed(2)}%</p>
                                    </div>
                                </div>
                             )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
