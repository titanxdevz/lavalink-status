"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Megaphone, X } from "lucide-react";

export function AnnouncementBanner() {
    const [announcement, setAnnouncement] = useState(null);
    const [closed, setClosed] = useState(false);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch("/api/promotions");
                const data = await response.json();
                if (!Array.isArray(data)) return;
                const active = data.find(
                    (item) => item.type === "announcement" && item.isActive
                );
                if (active) setAnnouncement(active);
            } catch {
                // Announcements are optional.
            }
        };

        fetchAnnouncements();
    }, []);

    if (!announcement || closed) return null;

    return (
        <div className="relative z-40 border-b border-line bg-ink-900">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2.5">
                <div className="flex min-w-0 items-center gap-3">
                    <Megaphone size={14} className="hidden shrink-0 text-signal sm:block" />
                    <span className="shrink-0 border border-signal/30 bg-signal/10 px-2 py-0.5 font-data text-[9px] uppercase tracking-[0.16em] text-signal">
                        Update
                    </span>
                    <p className="truncate font-data text-xs text-white/90">
                        {announcement.content}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    {announcement.link && (
                        <a
                            href={announcement.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:text-white"
                        >
                            Read more
                            <ArrowUpRight size={12} />
                        </a>
                    )}
                    <button
                        type="button"
                        onClick={() => setClosed(true)}
                        className="grid h-7 w-7 place-items-center text-dim transition-colors hover:text-white"
                        aria-label="Dismiss announcement"
                    >
                        <X size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}
