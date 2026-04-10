"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, ChevronLeft, FileText, Terminal } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
    const sections = [
        {
            id: "01",
            title: "INTRODUCTION",
            content: "AT LAVALINK LIST, WE PRIORITIZE YOUR PRIVACY. THIS DIRECTIVE OUTLINES HOW WE HANDLE AND PROCESS INFORMATION WHEN YOU INTERACT WITH OUR REGISTRY OF PUBLIC LAVALINK NODES."
        },
        {
            id: "02",
            title: "DATA COLLECTION",
            content: "WE DO NOT HARVEST PERSONAL IDENTIFICATION METRICS FROM GENERAL TRAFFIC. WHEN SUBMITTING A NODE TO THE GRID, WE EXPLICITLY STORE THE FOLLOWING PARAMETERS:",
            list: [
                "TARGET HOST AND ALLOCATED PORT",
                "AUTHENTICATION KEY / PASSWORD",
                "OPERATOR DESIGNATION / IDENTIFIER",
                "OPTIONAL WEB OR COMMS UPLINKS (DISCORD/WEBSITE)"
            ]
        },
        {
            id: "03",
            title: "NODE TELEMETRY",
            content: "OUR AUTOMATED SYSTEMS PERIODICALLY PING REGISTERED ENDPOINTS TO VERIFY UPTIME AND SYSTEM LOAD. WE DO NOT INTERCEPT, STORE, OR ANALYZE AUDIO PACKETS, TRACK METADATA, OR MONITOR CONNECTED GUILDS."
        },
        {
            id: "04",
            title: "LOCAL STORAGE CACHE",
            content: "WE UTILIZE BASIC CLIENT-SIDE STORAGE PROTOCOLS TO CACHE NODE DATA TEMPORARILY, ENSURING OPTIMAL FRONTEND PERFORMANCE. WE DEPLOY ZERO TRACKING OR ADVERTISING COOKIES."
        },
        {
            id: "05",
            title: "COMMUNICATIONS",
            content: "IF YOU REQUIRE CLARIFICATION REGARDING THIS PRIVACY DIRECTIVE, INITIATE CONTACT THROUGH OUR ESTABLISHED COMMUNITY COMMS CHANNELS."
        }
    ];

    return (
        <div className="min-h-screen bg-[#000000] text-[#f4f4f5] font-mono selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
            <Navbar activeTab="privacy" />

            <div className="fixed inset-0 pointer-events-none z-0 flex flex-wrap opacity-10">
                {[...Array(200)].map((_, i) => (
                    <div key={i} className="w-8 h-8 border-[0.5px] border-[#333333]"></div>
                ))}
            </div>

            <style>{`
                @keyframes revealUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(-40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-reveal { animation: revealUp 0.6s cubic-bezier(0, 0, 0.2, 1) forwards; opacity: 0; }
                .animate-slide { animation: slideRight 0.6s cubic-bezier(0, 0, 0.2, 1) forwards; opacity: 0; }
            `}</style>

            <main className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-40">
                <Link
                    href="/"
                    className="animate-slide inline-flex items-center gap-3 text-[#a1a1aa] font-black uppercase tracking-widest hover:text-white transition-colors mb-16 group bg-[#09090b] border-2 border-[#27272a] hover:border-white px-4 py-2"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    RETURN TO GRID
                </Link>

                <div className="animate-reveal border-b-2 border-[#27272a] pb-12 mb-16" style={{ animationDelay: '100ms' }}>
                    <div className="flex flex-col md:flex-row md:items-center gap-8 mb-8">
                        <div className="w-20 h-20 bg-blue-500 text-black flex items-center justify-center border-2 border-transparent shadow-[6px_6px_0px_0px_#f4f4f5] shrink-0">
                            <Shield size={40} />
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-white mb-4">
                                PRIVACY_PROTOCOL
                            </h1>
                            <div className="inline-flex items-center gap-3 bg-[#09090b] border-2 border-[#27272a] px-4 py-2 text-[#a1a1aa] font-black uppercase tracking-widest text-sm">
                                <Terminal size={16} />
                                LAST_MODIFIED: 2026.03.22
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    {sections.map((section, index) => (
                        <div
                            key={section.id}
                            className="animate-reveal bg-[#09090b] border-2 border-[#27272a] p-8 md:p-12 shadow-[8px_8px_0px_0px_#27272a] hover:border-[#52525b] transition-colors relative"
                            style={{ animationDelay: `${(index + 2) * 100}ms` }}
                        >
                            <div className="absolute top-0 right-0 p-4 border-b-2 border-l-2 border-[#27272a] bg-[#000000] text-[#52525b] font-black text-xl">
                                {section.id}
                            </div>

                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white mb-6 flex items-center gap-4">
                                <FileText className="text-blue-500" size={28} />
                                {section.title}
                            </h2>

                            <div className="border-l-4 border-blue-500 pl-6 py-2">
                                <p className="text-[#a1a1aa] text-lg font-medium leading-relaxed uppercase tracking-wide">
                                    {section.content}
                                </p>
                            </div>

                            {section.list && (
                                <div className="mt-8 bg-[#000000] border-2 border-[#27272a] p-6">
                                    <ul className="space-y-4">
                                        {section.list.map((item, i) => (
                                            <li key={i} className="flex items-start gap-4">
                                                <div className="w-3 h-3 bg-blue-500 mt-1.5 shrink-0" />
                                                <span className="text-white font-black uppercase tracking-widest text-sm leading-relaxed">
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}