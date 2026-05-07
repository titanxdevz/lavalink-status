"use client";
import { useEffect, useState } from "react";
import { X, Megaphone, ArrowRight, ExternalLink } from "lucide-react";

export function AnnouncementBanner() {
    const [announcement, setAnnouncement] = useState(null);
    const [closed, setClosed] = useState(false);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await fetch("/api/promotions");
                const data = await res.json();
                const activeAnn = data.find(p => p.type === "announcement" && p.isActive);
                if (activeAnn) setAnnouncement(activeAnn);
            } catch (e) {
                console.error(e);
            }
        };
        fetchAnnouncements();
    }, []);

    if (!announcement || closed) return null;

    return (
        <div className="relative z-[60] w-full bg-blue-600 border-b-2 border-white/20 text-white font-mono overflow-hidden animate-in slide-in-from-top duration-500">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuMSI+PHBhdGggZD0iTTAgMjBMMjAgME0tMTAgMjBMMjAgLTEwIi8+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="shrink-0 w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center animate-pulse">
                        <Megaphone size={18} />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 overflow-hidden">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white text-blue-600 px-2 py-0.5 shrink-0">NEW_ANNOUNCEMENT</span>
                        <p className="text-sm font-black uppercase tracking-tight truncate">
                            {announcement.content}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {announcement.link && (
                        <a 
                            href={announcement.link} 
                            target="_blank"
                            className="shrink-0 flex items-center gap-2 bg-black/20 hover:bg-black/40 border border-white/30 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all group"
                        >
                            LEARN_MORE <ExternalLink size={12} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    )}
                    <button 
                        onClick={() => setClosed(true)}
                        className="p-2 hover:bg-white/10 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
