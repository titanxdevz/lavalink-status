"use client";
import Link from "next/link";
import { Plus, Home, Shield, Server, Menu, X, Settings, LogIn, LogOut, User, Trophy } from "lucide-react";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export function Navbar({ activeTab }) {
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const navItems = [
        { id: 'home', path: '/', label: 'Home', icon: Home },
        { id: 'leaderboard', path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
        { id: 'ssl', path: '/ssl', label: 'SSL Nodes', icon: Shield },
        { id: 'non-ssl', path: '/non-ssl', label: 'Non-SSL', icon: Server },
        { id: 'submit', path: '/submit', label: 'Add Node', icon: Plus }
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#000000] border-b-2 border-[#27272a] text-[#f4f4f5] font-mono uppercase selection:bg-blue-500 selection:text-black">
            <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">

                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-blue-500 text-black flex items-center justify-center font-black text-2xl group-hover:shadow-[4px_4px_0px_0px_#f4f4f5] transition-all border-2 border-transparent group-hover:border-white group-hover:-translate-y-1 group-hover:-translate-x-1">
                            LL
                        </div>
                        <span className="font-black text-2xl tracking-widest text-white group-hover:text-blue-500 transition-colors hidden sm:block">
                            Lavalink
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-4">
                        {navItems.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.path}
                                    className={`flex items-center gap-3 px-5 py-3 border-2 text-sm font-black tracking-widest transition-all ${isActive
                                        ? 'bg-blue-500 border-blue-500 text-black shadow-[4px_4px_0px_0px_#f4f4f5] -translate-y-1 -translate-x-1'
                                        : 'bg-[#09090b] border-[#27272a] text-[#a1a1aa] hover:border-white hover:text-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#3b82f6]'
                                        }`}
                                >
                                    <item.icon size={18} /> {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        {session ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-3 bg-[#09090b] border-2 border-[#27272a] hover:border-blue-500 px-4 py-2 transition-all shadow-[4px_4px_0px_0px_#27272a] hover:shadow-[4px_4px_0px_0px_#3b82f6] group"
                                >
                                    {session.user.image ? (
                                        <img src={session.user.image} alt="User" className="w-8 h-8 rounded-none border border-[#27272a] group-hover:border-white" />
                                    ) : (
                                        <div className="w-8 h-8 bg-blue-500 flex items-center justify-center text-black">
                                            <User size={16} />
                                        </div>
                                    )}
                                    <span className="text-white text-xs font-black tracking-widest">{session.user.name?.toUpperCase()}</span>
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-4 w-64 bg-[#09090b] border-4 border-[#27272a] p-2 shadow-[12px_12px_0px_0px_#000] animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b-2 border-[#27272a] mb-2">
                                            <div className="text-[10px] text-[#52525b] font-black uppercase tracking-widest mb-1">Authenticated as</div>
                                            <div className="text-white font-black uppercase truncate">{session.user.email}</div>
                                        </div>
                                        <Link
                                            href={`/profile/${session.user.id}`}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-[#a1a1aa] hover:bg-blue-500/10 hover:text-blue-400 font-black uppercase tracking-widest text-xs transition-colors text-left"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <User size={16} /> View Profile
                                        </Link>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 hover:text-red-400 font-black uppercase tracking-widest text-xs transition-colors text-left"
                                        >
                                            <LogOut size={16} /> Terminate Session
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn('discord')}
                                className="flex items-center gap-3 bg-blue-500 border-2 border-blue-500 text-black px-6 py-3 font-black text-xs tracking-widest uppercase transition-all shadow-[4px_4px_0px_0px_#f4f4f5] hover:bg-white hover:border-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_#f4f4f5]"
                            >
                                <LogIn size={18} /> Initialize Login
                            </button>
                        )}
                    </div>

                    <button
                        className="md:hidden p-3 bg-[#09090b] border-2 border-[#27272a] text-white hover:border-blue-500 transition-colors active:bg-blue-500 active:text-black"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden border-t-2 border-[#27272a] bg-[#09090b] p-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <Link
                                key={item.id}
                                href={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-4 px-6 py-4 border-2 text-sm font-black tracking-widest transition-all ${isActive
                                    ? 'bg-blue-500 border-blue-500 text-black shadow-[4px_4px_0px_0px_#f4f4f5]'
                                    : 'bg-[#000000] border-[#27272a] text-[#a1a1aa] hover:border-white hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} /> {item.label}
                            </Link>
                        );
                    })}

                    <div className="pt-4 mt-4 border-t-2 border-[#27272a]">
                        {session ? (
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-4 px-6 py-4 border-2 border-red-500/50 text-red-500 font-black uppercase tracking-widest text-sm transition-all hover:bg-red-500 hover:text-black"
                            >
                                <LogOut size={20} /> Terminate Session
                            </button>
                        ) : (
                            <button
                                onClick={() => signIn('discord')}
                                className="w-full flex items-center gap-4 px-6 py-4 border-2 border-blue-500 text-blue-500 font-black uppercase tracking-widest text-sm transition-all hover:bg-blue-500 hover:text-black"
                            >
                                <LogIn size={20} /> Initialize Login
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}