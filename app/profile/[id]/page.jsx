"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SiteLoader } from "@/components/SiteLoader";
import { NodeCard } from "@/components/NodeCard";
import { 
    User as UserIcon, Shield, Globe, Link as LinkIcon, 
    MessageSquare, Edit2, Save, X, Github, Twitter, 
    ExternalLink, Activity, Server, Clock, Award, Trash2, Loader2, Tag, Lock, Hash
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useNodes } from "@/contexts/NodesContext";

export default function ProfilePage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const [profile, setProfile] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({ bio: "", links: {} });
    const [saving, setSaving] = useState(false);

    const { updateNode, deleteNode } = useNodes();
    const [editingNode, setEditingNode] = useState(null);
    const [nodeSaving, setNodeSaving] = useState(false);

    const isOwnProfile = session?.user?.id === id;

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`/api/users/${id}`);
            const data = await res.json();
            if (data.user) {
                setProfile(data.user);
                setNodes(data.nodes || []);
                setEditData({ 
                    bio: data.user.bio || "", 
                    links: data.user.links || {} 
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData)
            });
            if (res.ok) {
                setProfile({ ...profile, ...editData });
                setEditing(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteNode = async (node) => {
        if (!window.confirm(`TERMINATE_NODE_PROTOCOL: ${node.identifier}?`)) return;
        try {
            await deleteNode(node.host, node.port);
            setNodes(nodes.filter(n => n._id !== node._id));
        } catch (err) {
            alert("PURGE_ERROR: " + err.message);
        }
    };

    const handleUpdateNode = async (e) => {
        e.preventDefault();
        setNodeSaving(true);
        try {
            await updateNode(editingNode);
            setNodes(nodes.map(n => n._id === editingNode._id ? editingNode : n));
            setEditingNode(null);
        } catch (err) {
            alert("UPDATE_ERROR: " + err.message);
        } finally {
            setNodeSaving(false);
        }
    };

    if (loading) return <SiteLoader />;
    if (!profile) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-black">USER_NOT_FOUND</div>;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 selection:text-black">
            <Navbar />
            
            <main className="max-w-6xl mx-auto px-6 pt-32 pb-40">
                {/* Hero Profile Section */}
                <div className="relative mb-20 animate-reveal">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[100px]" />
                    <div className="absolute top-20 right-0 w-60 h-60 bg-purple-500/10 blur-[120px]" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-32 h-32 md:w-48 md:h-48 bg-[#09090b] border-4 border-[#27272a] shadow-[12px_12px_0px_0px_#1a1a1a] flex items-center justify-center overflow-hidden">
                                {profile.image ? (
                                    <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon size={64} className="text-[#27272a]" />
                                )}
                            </div>
                            {isOwnProfile && (
                                <button 
                                    onClick={() => setEditing(!editing)}
                                    className="absolute -bottom-4 -right-4 p-4 bg-blue-500 text-black border-2 border-transparent hover:bg-white transition-all shadow-[4px_4px_0px_0px_#000]"
                                >
                                    {editing ? <X size={20} /> : <Edit2 size={20} />}
                                </button>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{profile.name}</h1>
                                    {profile.role === 'admin' && (
                                        <div className="px-3 py-1 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest">ADMIN</div>
                                    )}
                                </div>
                                <p className="text-[#52525b] font-black uppercase tracking-[0.3em] text-xs">OPERATOR_ID: {profile._id}</p>
                            </div>

                            {!editing ? (
                                <div className="space-y-6">
                                    <p className="text-xl text-[#a1a1aa] font-medium leading-relaxed max-w-2xl italic">
                                        {profile.bio || "No bio protocol initialized for this operator."}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-4">
                                        {profile.links?.discord && (
                                            <a href={profile.links.discord} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-[#09090b] border-2 border-[#27272a] hover:border-blue-500 text-[#a1a1aa] hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                                                <MessageSquare size={14} /> DISCORD
                                            </a>
                                        )}
                                        {profile.links?.website && (
                                            <a href={profile.links.website} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-[#09090b] border-2 border-[#27272a] hover:border-emerald-500 text-[#a1a1aa] hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                                                <Globe size={14} /> WEBSITE
                                            </a>
                                        )}
                                        {profile.links?.github && (
                                            <a href={profile.links.github} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-[#09090b] border-2 border-[#27272a] hover:border-purple-500 text-[#a1a1aa] hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                                                <Github size={14} /> GITHUB
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 bg-[#09090b] border-2 border-[#27272a] p-8 shadow-[8px_8px_0px_0px_#1a1a1a]">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">BIOGRAPHY</label>
                                        <textarea 
                                            value={editData.bio}
                                            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                            className="w-full bg-black border-2 border-[#27272a] p-4 text-white outline-none focus:border-blue-500 transition-all min-h-[120px] font-medium"
                                            placeholder="Enter your operator bio..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { key: "discord", label: "DISCORD_URL", icon: <MessageSquare size={14} /> },
                                            { key: "website", label: "WEBSITE_URL", icon: <Globe size={14} /> },
                                            { key: "github", label: "GITHUB_URL", icon: <Github size={14} /> },
                                        ].map(link => (
                                            <div key={link.key} className="space-y-2">
                                                <label className="text-[9px] font-black text-[#52525b] uppercase tracking-widest">{link.label}</label>
                                                <div className="flex items-center gap-3 bg-black border-2 border-[#27272a] px-3 py-2 focus-within:border-blue-500 transition-all">
                                                    <span className="text-[#52525b]">{link.icon}</span>
                                                    <input 
                                                        type="text" 
                                                        value={editData.links[link.key] || ""}
                                                        onChange={(e) => setEditData({ 
                                                            ...editData, 
                                                            links: { ...editData.links, [link.key]: e.target.value } 
                                                        })}
                                                        className="bg-transparent outline-none text-xs w-full text-white"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button 
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-3 bg-blue-500 text-black px-8 py-3 font-black uppercase tracking-widest text-sm hover:bg-white transition-all shadow-[4px_4px_0px_0px_#000] disabled:opacity-50"
                                    >
                                        {saving ? <Activity size={18} className="animate-spin" /> : <Save size={18} />}
                                        SAVE_PROFILE_PROTOCOL
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 animate-reveal" style={{ animationDelay: "100ms" }}>
                    {[
                        { label: "REGISTERED_NODES", value: nodes.length, icon: <Server size={20} />, color: "text-blue-500" },
                        { label: "GRID_CONTRIBUTION", value: nodes.length > 5 ? "VETERAN" : nodes.length > 0 ? "OPERATOR" : "GUEST", icon: <Award size={20} />, color: "text-amber-500" },
                        { label: "LAST_ACTIVE", value: "RECENT", icon: <Clock size={20} />, color: "text-emerald-500" },
                        { label: "SYSTEM_LEVEL", value: "L1", icon: <Shield size={20} />, color: "text-purple-500" },
                    ].map((s, i) => (
                        <div key={i} className="bg-[#09090b] border-2 border-[#27272a] p-6 shadow-[6px_6px_0px_0px_#1a1a1a]">
                            <div className={`${s.color} mb-3`}>{s.icon}</div>
                            <div className="text-2xl font-black text-white">{s.value}</div>
                            <div className="text-[10px] font-black text-[#52525b] uppercase tracking-widest">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Node Section */}
                <div className="animate-reveal" style={{ animationDelay: "200ms" }}>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-[#09090b] border-2 border-[#27272a] flex items-center justify-center text-blue-500">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter">OPERATIONAL_INFRASTRUCTURE</h2>
                            <p className="text-[10px] font-black text-[#52525b] uppercase tracking-widest">ACTIVE_NODES_DEPLOYED_BY_THIS_OPERATOR</p>
                        </div>
                    </div>

                    {nodes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {nodes.map((node) => (
                                <NodeCard 
                                    key={node._id} 
                                    node={node} 
                                    onEdit={isOwnProfile ? setEditingNode : null}
                                    onDelete={isOwnProfile ? handleDeleteNode : null}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 border-2 border-dashed border-[#27272a] bg-[#09090b]/50 text-center flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-[#27272a]/20 rounded-full flex items-center justify-center text-[#52525b]">
                                <Server size={32} />
                            </div>
                            <span className="text-[#52525b] font-black uppercase tracking-widest">NO_NODES_CURRENTLY_ACTIVE_IN_THE_GRID</span>
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {/* Edit Node Modal */}
            {editingNode && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl bg-[#09090b] border-2 border-[#27272a] shadow-[16px_16px_0px_0px_#1a1a1a] animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between p-6 border-b-2 border-[#27272a]">
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                                <Edit2 size={24} className="text-blue-500" /> RECONFIGURE_NODE
                            </h3>
                            <button onClick={() => setEditingNode(null)} className="text-[#52525b] hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateNode} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-[#52525b] uppercase tracking-widest mb-2">Identifier</label>
                                    <div className="flex items-center gap-3 bg-black border-2 border-[#27272a] px-4 py-3 focus-within:border-blue-500 transition-all">
                                        <Hash size={16} className="text-[#52525b]" />
                                        <input 
                                            type="text" 
                                            value={editingNode.identifier} 
                                            onChange={(e) => setEditingNode({ ...editingNode, identifier: e.target.value })}
                                            className="bg-transparent outline-none text-xs w-full text-white font-black uppercase"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[#52525b] uppercase tracking-widest mb-2">Auth Key</label>
                                    <div className="flex items-center gap-3 bg-black border-2 border-[#27272a] px-4 py-3 focus-within:border-blue-500 transition-all">
                                        <Lock size={16} className="text-[#52525b]" />
                                        <input 
                                            type="text" 
                                            value={editingNode.password} 
                                            onChange={(e) => setEditingNode({ ...editingNode, password: e.target.value })}
                                            className="bg-transparent outline-none text-xs w-full text-white font-black uppercase"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[#52525b] uppercase tracking-widest mb-2">API Version</label>
                                    <div className="flex items-center gap-3 bg-black border-2 border-[#27272a] px-4 py-3 focus-within:border-blue-500 transition-all">
                                        <Tag size={16} className="text-[#52525b]" />
                                        <select 
                                            value={editingNode.restVersion} 
                                            onChange={(e) => setEditingNode({ ...editingNode, restVersion: e.target.value })}
                                            className="bg-transparent outline-none text-xs w-full text-white font-black uppercase appearance-none"
                                        >
                                            <option value="v4">V4</option>
                                            <option value="v3">V3</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={nodeSaving}
                                    className="flex-1 flex items-center justify-center gap-3 bg-blue-500 text-black py-4 font-black uppercase tracking-widest text-sm hover:bg-white transition-all shadow-[6px_6px_0px_0px_#000] disabled:opacity-50"
                                >
                                    {nodeSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    EXECUTE_PATCH
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingNode(null)}
                                    className="flex-1 py-4 bg-black border-2 border-[#27272a] text-[#a1a1aa] font-black uppercase tracking-widest text-sm hover:border-white hover:text-white transition-all"
                                >
                                    ABORT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
