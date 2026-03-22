import Link from "next/link";
import { Plus, Home, Shield, Server, Menu, X, Settings } from "lucide-react";
import { useState } from "react";

export function Navbar({ activeTab }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'home', path: '/', label: 'Home', icon: Home },
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
                    <div className="hidden md:flex items-center">
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
                </div>
            )}
        </nav>
    );
}