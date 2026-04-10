"use client";
import { useEffect, useState } from "react";

export function SiteLoader({ isLoading }) {
    const [shouldRender, setShouldRender] = useState(isLoading);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setIsExiting(true);
            const t = setTimeout(() => {
                setShouldRender(false);
            }, 600); // Wait for slide-up animation
            return () => clearTimeout(t);
        } else {
            setShouldRender(true);
            setIsExiting(false);
        }
    }, [isLoading]);

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#000000] font-mono transition-transform duration-500 ease-in-out ${isExiting ? '-translate-y-full' : 'translate-y-0'}`}>

            <div className="fixed inset-0 pointer-events-none z-0 flex flex-wrap opacity-10 overflow-hidden">
                {[...Array(300)].map((_, i) => (
                    <div key={i} className="w-8 h-8 border-[0.5px] border-[#333333]"></div>
                ))}
            </div>

            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                @keyframes loadingStep {
                    0% { width: 5%; }
                    25% { width: 30%; }
                    50% { width: 55%; }
                    75% { width: 80%; }
                    100% { width: 100%; }
                }
            `}</style>

            <div className="relative z-10 flex flex-col items-center gap-12">
                <div className="w-24 h-24 bg-blue-500 text-black border-4 border-white flex items-center justify-center text-5xl font-black shadow-[8px_8px_0px_0px_#f4f4f5]">
                    LL
                </div>

                <div className="flex flex-col items-center gap-6 w-72">
                    <div className="flex items-center gap-3 text-white font-black tracking-widest text-2xl uppercase">
                        <span className="text-blue-500 animate-[blink_1s_step-end_infinite]">_</span>
                        SYS_BOOT
                    </div>

                    <div className="w-full h-6 border-4 border-[#27272a] bg-[#09090b] p-1">
                        <div className="h-full bg-white animate-[loadingStep_1.5s_infinite_step-end]"></div>
                    </div>

                    <div className="text-[#a1a1aa] text-sm font-black uppercase tracking-widest flex justify-between w-full border-t-2 border-[#27272a] pt-4">
                        <span>CONNECTING</span>
                        <span className="text-blue-500 animate-[blink_1s_step-end_infinite]">WAIT</span>
                    </div>
                </div>
            </div>
        </div>
    );
}