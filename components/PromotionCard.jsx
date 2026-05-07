"use client";
import { ExternalLink, Tag, Zap } from "lucide-react";

export function PromotionCard({ promotion }) {
    if (!promotion) return null;

    return (
        <a 
            href={promotion.link || "#"} 
            target="_blank"
            className="relative group block bg-[#09090b] border-2 border-[#27272a] p-8 overflow-hidden hover:border-blue-500 hover:-translate-y-1 transition-all shadow-[8px_8px_0px_0px_#1a1a1a] hover:shadow-[12px_12px_0px_0px_#3b82f6]"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                <Zap size={80} />
            </div>

            <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
                        <Tag size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#52525b]">COMMUNITY_PROMOTION</span>
                </div>

                <div className="space-y-2">
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white group-hover:text-blue-500 transition-colors">
                        {promotion.title}
                    </h3>
                    <p className="text-[#a1a1aa] font-medium leading-relaxed">
                        {promotion.content}
                    </p>
                </div>

                <div className="pt-4 flex items-center gap-4">
                    <div className="px-6 py-3 bg-black border-2 border-[#27272a] group-hover:border-blue-500 text-xs font-black uppercase tracking-widest text-white flex items-center gap-3 transition-all">
                        VISIT_ENDPOINT <ExternalLink size={14} />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </a>
    );
}
