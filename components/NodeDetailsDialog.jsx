"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Server, Code, Clock, Copy, Check, X, Globe, Puzzle, Filter, Cpu, HardDrive, Activity, Users, Wrench, Edit2, Trash2, Save, AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useNodes } from "@/contexts/NodesContext";
import Link from "next/link";

export function NodeDetailsDialog({ node, open, onOpenChange }) {
    const { data: session } = useSession();
    const { updateNode, deleteNode } = useNodes();
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editData, setEditData] = useState(null);

    if (!node) return null;

    const isOnline = node.isConnected;
    const isOwner = session && session.user.id === node.ownerId;

    const handleEditStart = () => {
        setEditData({
            identifier: node.identifier,
            host: node.host,
            port: node.port,
            password: node.password,
            secure: node.secure,
            restVersion: node.restVersion,
            website: node.website || "",
            discord: node.discord || ""
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateNode({ _id: node._id, ...editData });
            setIsEditing(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to permanently remove this node from the grid?")) return;
        setIsDeleting(true);
        try {
            await deleteNode(node.host, node.port, node._id);
            onOpenChange(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const copyConnectionJSON = () => {
        const json = JSON.stringify({
            identifier: node.identifier,
            password: node.password || "youshallnotpass",
            host: node.host,
            port: node.port,
            secure: node.secure
        }, null, 2);
        navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const SectionHeader = ({ icon: Icon, title, count }) => (
        <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-blue-500 text-black border-2 border-transparent">
                <Icon size={20} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                {title}
                {count !== undefined && (
                    <span className="text-sm bg-[#27272a] px-2 py-0.5 text-[#f4f4f5]">{count}</span>
                )}
            </h3>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto bg-[#000000] border-2 border-[#27272a] text-[#f4f4f5] p-0 gap-0 font-mono !rounded-none shadow-[12px_12px_0px_0px_#3b82f6] [&>button]:hidden">
                <DialogTitle className="sr-only">
                    Node Details - {node.identifier}
                </DialogTitle>

                <div className="bg-[#09090b] border-b-2 border-[#27272a] p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6 relative">
                    <div className="flex items-start gap-6">
                        <div className="w-16 h-16 border-2 border-[#27272a] bg-[#000000] flex items-center justify-center text-3xl font-black text-white shadow-[4px_4px_0px_0px_#27272a]">
                            {node.authorId?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex flex-col gap-3">
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
                                {node.identifier}
                            </h2>
                            <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-widest">
                                <span className="text-[#a1a1aa] bg-[#000000] border-2 border-[#27272a] px-3 py-1">
                                    BY {node.ownerId ? (
                                        <Link href={`/profile/${node.ownerId}`} className="text-white hover:text-blue-500 transition-colors ml-1">{node.authorId || 'UNKNOWN'}</Link>
                                    ) : (
                                        <span className="text-white ml-1">{node.authorId || 'UNKNOWN'}</span>
                                    )}
                                </span>
                                {node.website && (
                                    <a
                                        href={node.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#000000] border-2 border-[#27272a] text-[#a1a1aa] hover:border-blue-500 hover:text-white px-3 py-1 flex items-center gap-2 transition-colors"
                                    >
                                        <Globe size={14} /> WEBSITE
                                    </a>
                                )}
                                {node.discord && (
                                    <a
                                        href={node.discord}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#000000] border-2 border-[#27272a] text-[#a1a1aa] hover:border-indigo-500 hover:text-white px-3 py-1 flex items-center gap-2 transition-colors"
                                    >
                                        <Server size={14} /> DISCORD
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 self-start">
                        {isOwner && !isEditing && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleEditStart}
                                    className="px-4 py-2 bg-blue-500 border-2 border-blue-500 text-black text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:border-white transition-all shadow-[4px_4px_0px_0px_#f4f4f5]"
                                >
                                    <Edit2 size={14} /> Edit Node
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-red-500 border-2 border-red-500 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-black hover:border-white transition-all shadow-[4px_4px_0px_0px_#000]"
                                >
                                    {isDeleting ? <X size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    Delete
                                </button>
                            </div>
                        )}

                        {isEditing && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-emerald-500 border-2 border-emerald-500 text-black text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:border-white transition-all shadow-[4px_4px_0px_0px_#f4f4f5]"
                                >
                                    {isSaving ? <X size={14} className="animate-spin" /> : <Save size={14} />}
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-transparent border-2 border-[#27272a] text-[#a1a1aa] text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:border-white hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        <div className={`px-4 py-2 border-2 text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-[4px_4px_0px_0px] ${isOnline ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500 shadow-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500 shadow-red-500/20'}`}>
                            <div className={`w-2 h-2 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {isOnline ? 'SYS_ACTIVE' : 'SYS_OFFLINE'}
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="w-10 h-10 border-2 border-[#27272a] bg-[#000000] text-[#a1a1aa] hover:border-white hover:text-black hover:bg-white transition-colors flex items-center justify-center"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-12">
                    {isEditing ? (
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Identifier</label>
                                    <input
                                        type="text"
                                        value={editData.identifier}
                                        onChange={(e) => setEditData({ ...editData, identifier: e.target.value })}
                                        className="w-full bg-[#09090b] border-2 border-[#27272a] px-5 py-4 text-white font-black uppercase focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Host Address</label>
                                    <input
                                        type="text"
                                        value={editData.host}
                                        onChange={(e) => setEditData({ ...editData, host: e.target.value })}
                                        className="w-full bg-[#09090b] border-2 border-[#27272a] px-5 py-4 text-white font-black uppercase focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Port</label>
                                    <input
                                        type="number"
                                        value={editData.port}
                                        onChange={(e) => setEditData({ ...editData, port: e.target.value })}
                                        className="w-full bg-[#09090b] border-2 border-[#27272a] px-5 py-4 text-white font-black uppercase focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Auth Key</label>
                                    <input
                                        type="text"
                                        value={editData.password}
                                        onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                                        className="w-full bg-[#09090b] border-2 border-[#27272a] px-5 py-4 text-white font-black uppercase focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Secure (SSL)</label>
                                    <div 
                                        onClick={() => setEditData({ ...editData, secure: !editData.secure })}
                                        className={`px-5 py-4 border-2 font-black uppercase tracking-widest text-xs cursor-pointer transition-all flex items-center justify-between ${editData.secure ? 'bg-blue-500 text-black border-blue-500' : 'bg-[#09090b] border-[#27272a] text-[#a1a1aa]'}`}
                                    >
                                        {editData.secure ? 'ENABLED (WSS/HTTPS)' : 'DISABLED (WS/HTTP)'}
                                        {editData.secure && <Check size={16} />}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">API Version</label>
                                    <select
                                        value={editData.restVersion}
                                        onChange={(e) => setEditData({ ...editData, restVersion: e.target.value })}
                                        className="w-full bg-[#09090b] border-2 border-[#27272a] px-5 py-4 text-white font-black uppercase focus:border-blue-500 outline-none transition-colors appearance-none"
                                    >
                                        <option value="v4">LAVALINK_V4</option>
                                        <option value="v3">LAVALINK_V3</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Website Link</label>
                                    <input
                                        type="url"
                                        value={editData.website}
                                        onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                                        className="w-full bg-[#09090b] border-2 border-[#27272a] px-5 py-4 text-white font-black uppercase focus:border-blue-500 outline-none transition-colors"
                                        placeholder="HTTPS://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#a1a1aa] uppercase tracking-widest mb-3">Discord Link</label>
                                    <input
                                        type="url"
                                        value={editData.discord}
                                        onChange={(e) => setEditData({ ...editData, discord: e.target.value })}
                                        className="w-full bg-[#09090b] border-2 border-[#27272a] px-5 py-4 text-white font-black uppercase focus:border-blue-500 outline-none transition-colors"
                                        placeholder="DISCORD.GG/..."
                                    />
                                </div>
                            </div>

                            <div className="bg-yellow-500/10 border-2 border-yellow-500 p-6 flex items-start gap-4">
                                <AlertTriangle className="text-yellow-500 shrink-0" size={24} />
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Warning: Node Re-verification</h4>
                                    <p className="text-xs font-black text-[#a1a1aa] uppercase tracking-widest leading-relaxed">
                                        Significant changes to host or port parameters may require the node to be re-verified by an administrator.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <SectionHeader icon={Server} title="Target Host" />
                                <div className="bg-[#09090b] border-2 border-[#27272a] px-5 py-4 flex items-center justify-between group hover:border-white transition-colors">
                                    <code className="text-lg font-black text-white">{node.host}</code>
                                    <span className="text-xs font-black text-[#52525b] uppercase tracking-widest group-hover:text-blue-500 transition-colors">PORT: {node.port}</span>
                                </div>
                            </div>

                            <div>
                                <SectionHeader icon={Code} title="Connection Parameters" />
                                <div className="bg-[#09090b] border-2 border-[#27272a] relative group hover:border-white transition-colors">
                                    <button
                                        onClick={copyConnectionJSON}
                                        className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2 border-2 text-xs font-black uppercase tracking-widest transition-all z-10 ${copied
                                            ? 'bg-emerald-500 text-black border-emerald-500'
                                            : 'bg-[#000000] text-[#a1a1aa] border-[#27272a] hover:border-white hover:text-white hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[2px_2px_0px_0px_#ffffff]'
                                            }`}
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? 'COPIED' : 'COPY JSON'}
                                    </button>
                                    <pre 
                                        className="text-sm text-[#a1a1aa] p-6 overflow-x-auto"
                                        dangerouslySetInnerHTML={{
                                            __html: `{
  "identifier": "${node.identifier}",
  "password": <span class="credential-text">${node.password || 'youshallnotpass'}</span>,
  "host": "${node.host}",
  "port": ${node.port},
  "secure": ${node.secure}
}`
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {isOnline && (
                        <>
                            <div>
                                <SectionHeader icon={Cpu} title="Telemetry" />
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {[
                                        { l: "MEMORY", v: node.memory, i: HardDrive },
                                        { l: "PLAYERS", v: node.connections, i: Users },
                                        { l: "LOAD", v: node.systemLoad, i: Activity },
                                        { l: "UPTIME", v: node.uptime, i: Clock },
                                        { l: "CORES", v: node.cpuCores, i: Cpu }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-[#09090b] border-2 border-[#27272a] p-4 flex flex-col gap-3 hover:border-blue-500 transition-colors">
                                            <div className="flex items-center gap-2 text-[#52525b]">
                                                <stat.i size={14} />
                                                <span className="text-[10px] uppercase tracking-widest font-black">{stat.l}</span>
                                            </div>
                                            <span className="text-lg font-black text-white truncate">{stat.v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {node.info && (
                                <div>
                                    <SectionHeader icon={Wrench} title="Build Info" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { l: "LAVALINK", v: node.info.version?.major ? `${node.info.version.major}.${node.info.version.minor}.${node.info.version.patch}` : (node.info.version?.semver || 'UNKNOWN') },
                                            { l: "JAVA", v: node.info.jvm?.split(' ')[0] },
                                            { l: "BUILD", v: node.info.buildTime ? new Date(node.info.buildTime).toLocaleDateString() : 'UNKNOWN' },
                                            { l: "LAVAPLAYER", v: node.info.lavaplayer }
                                        ].map((info, i) => info.v && (
                                            <div key={i} className="bg-[#09090b] border-2 border-[#27272a] px-5 py-4 flex flex-col gap-1">
                                                <span className="text-[10px] uppercase tracking-widest text-[#52525b] font-black">{info.l}</span>
                                                <span className="text-sm font-black text-white truncate">{info.v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {node.info?.sourceManagers && node.info.sourceManagers.length > 0 && (
                                <div>
                                    <SectionHeader icon={Globe} title="Sources" count={node.info.sourceManagers.length} />
                                    <div className="bg-[#09090b] border-2 border-[#27272a] p-5">
                                        <div className="flex flex-wrap gap-3">
                                            {node.info.sourceManagers.map((source, idx) => (
                                                <span key={idx} className="bg-[#000000] border-2 border-[#27272a] text-[#a1a1aa] text-xs font-black uppercase tracking-widest px-4 py-2 hover:border-white hover:text-white transition-colors cursor-default">
                                                    {source}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {node.info?.plugins && node.info.plugins.length > 0 && (
                                    <div>
                                        <SectionHeader icon={Puzzle} title="Plugins" count={node.info.plugins.length} />
                                        <div className="bg-[#09090b] border-2 border-[#27272a] p-5 flex flex-col gap-2 h-[calc(100%-4rem)]">
                                            {node.info.plugins.map((plugin, idx) => (
                                                <div key={idx} className="flex justify-between items-center border-b-2 border-[#18181b] pb-2 last:border-0 last:pb-0">
                                                    <span className="text-sm font-black text-white uppercase">{plugin.name}</span>
                                                    <span className="text-xs font-black text-[#52525b] uppercase tracking-widest px-2 py-1 bg-[#000000] border-2 border-[#27272a]">{plugin.version}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {node.info?.filters && node.info.filters.length > 0 && (
                                    <div>
                                        <SectionHeader icon={Filter} title="Filters" count={node.info.filters.length} />
                                        <div className="bg-[#09090b] border-2 border-[#27272a] p-5 h-[calc(100%-4rem)]">
                                            <div className="flex flex-wrap gap-3">
                                                {node.info.filters.map((filter, idx) => (
                                                    <span key={idx} className="bg-[#000000] border-2 border-[#27272a] text-[#a1a1aa] text-xs font-black uppercase tracking-widest px-3 py-1 hover:border-blue-500 hover:text-white transition-colors cursor-default">
                                                        {filter}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {!isOnline && (
                        <div className="border-2 border-red-500/50 bg-red-500/10 p-12 flex flex-col items-center justify-center text-center gap-6">
                            <div className="w-16 h-16 bg-red-500 text-black flex items-center justify-center">
                                <Server size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-red-500 uppercase tracking-tighter mb-2">Target Unreachable</h3>
                                <p className="text-[#a1a1aa] font-bold uppercase tracking-widest text-sm max-w-md mx-auto">
                                    Telemetry cannot be retrieved while the node is disconnected from the grid.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}