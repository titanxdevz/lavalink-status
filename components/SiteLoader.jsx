"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

export function SiteLoader({ isLoading = true }) {
    const [shouldRender, setShouldRender] = useState(isLoading);
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isLoading) {
            setProgress(100);
            setIsExiting(true);
            const timeout = setTimeout(() => setShouldRender(false), 450);
            return () => clearTimeout(timeout);
        }

        setShouldRender(true);
        setIsExiting(false);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress((value) => (value >= 92 ? value : value + Math.random() * 6));
        }, 120);

        return () => clearInterval(interval);
    }, [isLoading]);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-ink-950 transition-opacity duration-500 ${
                isExiting ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            role="status"
            aria-live="polite"
        >
            <div className="w-full max-w-sm px-6">
                <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center border border-signal/40 bg-signal/10 text-signal">
                        <Activity size={18} />
                    </span>
                    <div>
                        <div className="font-display text-lg font-semibold tracking-tight text-white">
                            Loading the grid
                        </div>
                        <div className="font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                            Handshaking community nodes
                        </div>
                    </div>
                </div>

                <div className="mt-6 h-1 w-full overflow-hidden bg-ink-800">
                    <div
                        className="h-full bg-signal transition-[width] duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="mt-2 flex justify-between font-data text-[10px] uppercase tracking-[0.14em] text-dim">
                    <span>Syncing</span>
                    <span className="tabular-nums">{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    );
}
