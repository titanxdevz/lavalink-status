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
            }, 800);
            return () => clearTimeout(t);
        } else {
            setShouldRender(true);
            setIsExiting(false);
        }
    }, [isLoading]);

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
            <style jsx>{`
                @keyframes pulse-ring {
                    0% { transform: scale(.33); opacity: 0; }
                    80%, 100% { transform: scale(1); opacity: 0; }
                }
                @keyframes pulse-dot {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }
                .dot-loader {
                    width: 70px;
                    height: 70px;
                    position: relative;
                }
                .dot-loader:before {
                    content: '';
                    position: absolute;
                    inset: -20px;
                    border: 4px solid #3b82f61a;
                    border-radius: 24px;
                    animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                }
                .logo-text {
                    animation: pulse-dot 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
                }
            `}</style>
            
            <div className="dot-loader flex items-center justify-center">
                 <div className="logo-text w-full h-full bg-white rounded-2xl flex items-center justify-center text-black font-black italic text-3xl shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                    LL
                 </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Initialising Directory</div>
                <div className="flex gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500 animate-[bounce_1s_infinite]"></span>
                    <span className="w-1 h-1 rounded-full bg-blue-500 animate-[bounce_1s_0.2s_infinite]"></span>
                    <span className="w-1 h-1 rounded-full bg-blue-500 animate-[bounce_1s_0.4s_infinite]"></span>
                </div>
            </div>
        </div>
    );
}
