import { Github, Twitter, MessageSquare, Zap, Globe, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="mt-20 border-t border-white/5 bg-[#050505] text-white/40 pb-20 pt-16">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                         <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black italic">LL</div>
                            <span className="font-bold text-xl tracking-tight text-white">Lavalink List</span>
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed mb-8">
                            Empowering Discord bot developers with free, high-performance Lavalink nodes. 
                            Community verified and always open.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Home Page</Link></li>
                            <li><Link href="/ssl" className="hover:text-white transition-colors">SSL Nodes</Link></li>
                            <li><Link href="/non-ssl" className="hover:text-white transition-colors">Non-SSL Nodes</Link></li>
                            <li><Link href="/submit" className="hover:text-white transition-colors font-semibold text-blue-400">Add Your Node</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs">
                        &copy; {new Date().getFullYear()} Lavalink List.
                    </p>
                    <div className="flex items-center gap-6 text-xs uppercase font-bold tracking-widest">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
