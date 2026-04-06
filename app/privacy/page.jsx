"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 font-sans">
            <Navbar activeTab="privacy" />
            
            <main className="max-w-4xl mx-auto px-6 py-24">
                <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 text-sm font-medium">
                    <ChevronLeft size={16} /> Back to Directory
                </Link>

                <div className="space-y-12">
                    <header>
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                            <Shield size={24} />
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter mb-4">Privacy Policy</h1>
                        <p className="text-white/40 text-lg">Last updated: March 22, 2026</p>
                    </header>

                    <div className="prose prose-invert prose-blue max-w-none space-y-8 text-white/60 leading-relaxed">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Introduction</h2>
                            <p>
                                At Lavalink List, we prioritize your privacy. This policy describes how we handle any information when you 
                                use our directory of public Lavalink nodes.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Data Collection</h2>
                            <p>
                                We do not collect personal identification information from general visitors. When you submit a node to our 
                                directory, we store the following Information provided by you:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Node Host and Port</li>
                                <li>Node Password</li>
                                <li>Provider Name/Identifier</li>
                                <li>Optional Website or Discord links</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Node Monitoring</h2>
                            <p>
                                Our systems periodically ping the provided node status endpoints to verify uptime and load. 
                                We do not store any metadata from the music being played or the guilds using the nodes.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Cookies</h2>
                            <p>
                                We use basic local storage to cache node data temporarily on your browser for better performance. 
                                We do not use tracking or advertising cookies.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Contact</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us through the community channels.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
