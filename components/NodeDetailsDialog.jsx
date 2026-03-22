"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Server, Code, Clock, Copy, Check, X, Globe, Puzzle, Filter, Cpu, HardDrive, Activity, Users, Wrench } from "lucide-react";

export function NodeDetailsDialog({ node, open, onOpenChange }) {
    if (!node) return null;

    const isOnline = node.isConnected;

    const [copied, setCopied] = useState(false);

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



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border text-card-foreground p-0 gap-0">
                <DialogTitle className="sr-only">
                    Node Details - {node.identifier}
                </DialogTitle>
                {/* Header */}
                <div className="bg-muted/50 p-6 flex flex-col md:flex-row md:items-center justify-between border-b border-border gap-6">
                    <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-white italic">
                            {node.authorId?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold text-foreground tracking-tight">
                                {node.identifier}
                            </h2>
                            <div className="flex items-center gap-4 text-xs font-medium">
                                <span className="text-white/40 uppercase tracking-widest text-[10px]">Provided by <span className="text-white font-bold">{node.authorId || 'Unknown'}</span></span>
                                {node.website && (
                                    <a
                                        href={node.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                    >
                                        <Globe size={12} /> Website
                                    </a>
                                )}
                                {node.discord && (
                                    <a
                                        href={node.discord}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                                    >
                                        <Server size={12} /> Discord
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-auto">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${isOnline ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                            {isOnline ? 'Active Node' : 'Disconnected'}
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all ml-4"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-5 space-y-6">

                    {/* Node Identifier */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-3">
                            <Server className="w-5 h-5 text-blue-500" />
                            <h3 className="text-base font-semibold text-foreground">Node Identifier</h3>
                        </div>
                        <div className="bg-muted/50 rounded px-4 py-3 border border-border">
                            <code className="text-sm font-mono text-muted-foreground">{node.identifier}</code>
                        </div>
                    </div>

                    {/* Connection Details */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-3">
                            <Code className="w-5 h-5 text-blue-500" />
                            <h3 className="text-base font-semibold text-foreground">Connection Details</h3>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2.5">Copy full connection JSON</div>
                        <div className="bg-muted/50 rounded p-4 relative border border-border">
                            <button
                                onClick={copyConnectionJSON}
                                className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded transition-all border ${copied
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                    : 'bg-secondary hover:bg-muted text-foreground border-border'
                                    } text-xs font-medium`}
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <pre className="text-xs font-mono text-yellow-500 dark:text-yellow-400 leading-relaxed pr-20 overflow-x-auto">
                                {`{
    "identifier": "${node.identifier}",
    "password": "${node.password || 'youshallnotpass'}",
    "host": "${node.host}",
    "port": ${node.port},
    "secure": ${node.secure}
    }`}
                            </pre>
                        </div>
                    </div>

                    {isOnline && (
                        <>


                            {/* System Specs */}
                            <div>
                                <div className="flex items-center gap-2.5 mb-3">
                                    <Cpu className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-base font-semibold text-foreground">System Specs</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <HardDrive className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">Memory Usage:</div>
                                            <div className="text-sm font-medium text-foreground">{node.memory}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">Connections:</div>
                                            <div className="text-sm font-medium text-foreground">{node.connections}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Activity className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">System Load:</div>
                                            <div className="text-sm font-medium text-foreground">{node.systemLoad}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">Uptime:</div>
                                            <div className="text-sm font-medium text-foreground">{node.uptime}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Cpu className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">CPU Cores:</div>
                                            <div className="text-sm font-medium text-foreground">{node.cpuCores}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Version Information */}
                            {node.info && (
                                <div>
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <Wrench className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-base font-semibold text-foreground">Version Information</h3>
                                    </div>
                                    <div className="bg-muted/50 rounded p-4 border border-border">
                                        <div className="grid grid-cols-2 gap-4">
                                            {node.info.version && (
                                                <div className="flex items-center gap-3">
                                                    <Server className="w-5 h-5 text-muted-foreground" />
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">Lavalink Version:</div>
                                                        <div className="text-sm font-medium text-foreground">
                                                            {node.info.version?.major
                                                                ? `${node.info.version.major}.${node.info.version.minor}.${node.info.version.patch}`
                                                                : (node.info.version?.semver || 'Unknown')}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {node.info.jvm && (
                                                <div className="flex items-center gap-3">
                                                    <Code className="w-5 h-5 text-muted-foreground" />
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">Java:</div>
                                                        <div className="text-sm font-medium text-foreground">{node.info.jvm.split(' ')[0]}</div>
                                                    </div>
                                                </div>
                                            )}
                                            {node.info.buildTime && (
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-5 h-5 text-muted-foreground" />
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">Build Time:</div>
                                                        <div className="text-sm font-medium text-foreground">
                                                            {new Date(node.info.buildTime).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {node.info.lavaplayer && (
                                                <div className="flex items-center gap-3">
                                                    <Puzzle className="w-5 h-5 text-muted-foreground" />
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">Lavaplayer:</div>
                                                        <div className="text-sm font-medium text-foreground">{node.info.lavaplayer}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Source Managers */}
                            {node.info?.sourceManagers && node.info.sourceManagers.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <Globe className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-base font-semibold text-foreground">Source Managers</h3>
                                        <span className="text-sm text-muted-foreground">{node.info.sourceManagers.length}</span>
                                    </div>
                                    <div className="bg-muted/50 rounded p-3 border border-border">
                                        <div className="flex flex-wrap gap-2">
                                            {node.info.sourceManagers.map((source, idx) => (
                                                <span key={idx} className="bg-card text-card-foreground text-sm px-3 py-1 rounded-full border border-border shadow-sm">
                                                    {source}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Plugins */}
                            {node.info?.plugins && node.info.plugins.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <Puzzle className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-base font-semibold text-foreground">Plugins</h3>
                                        <span className="text-sm text-muted-foreground">{node.info.plugins.length}</span>
                                    </div>
                                    <div className="bg-muted/50 rounded p-3 border border-border">
                                        <div className="space-y-1">
                                            {node.info.plugins.map((plugin, idx) => (
                                                <div key={idx} className="text-sm font-mono text-muted-foreground">
                                                    {plugin.name}: {plugin.version}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Filters */}
                            {node.info?.filters && node.info.filters.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <Filter className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-base font-semibold text-foreground">Filters</h3>
                                        <span className="text-sm text-muted-foreground">{node.info.filters.length}</span>
                                    </div>
                                    <div className="bg-muted/50 rounded p-3 border border-border">
                                        <div className="flex flex-wrap gap-2">
                                            {node.info.filters.map((filter, idx) => (
                                                <span key={idx} className="bg-card text-card-foreground text-sm px-3 py-1 rounded-full border border-border shadow-sm">
                                                    {filter}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {!isOnline && (
                        <div className="text-center py-12">
                            <Server className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-muted-foreground">Node is currently offline. Cannot retrieve detailed information.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog >
    );
}
