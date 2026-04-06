"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClipboardList, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 font-sans">
            <Navbar activeTab="terms" />
            
            <main className="max-w-4xl mx-auto px-6 py-24">
                <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 text-sm font-medium">
                    <ChevronLeft size={16} /> Back to Directory
                </Link>

                <div className="space-y-12">
                    <header>
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                            <ClipboardList size={24} />
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter mb-4">Terms of Service</h1>
                        <p className="text-white/40 text-lg">Last updated: March 22, 2026</p>
                    </header>

                    <div className="prose prose-invert prose-blue max-w-none space-y-8 text-white/60 leading-relaxed">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Introduction</h2>
                            <p>
                                Welcome to Lavalink List. By accessing our website, you agree to these terms of service. 
                                Please read them carefully before using our directory.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Acceptable Use</h2>
                            <p>
                                You agree to use the nodes provided in our directory responsibly. You must not:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Attempt to DDoS or overload the listed nodes.</li>
                                <li>Use the nodes for illegal streaming or copyright infringement.</li>
                                <li>Redistribute node credentials behind a paywall.</li>
                                <li>Automate queries to our directory without proper API headers.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Disclaimer</h2>
                            <p>
                                Lavalink List is a directory of third-party community-hosted nodes. 
                                We are not responsible for the performance, offline status, or content 
                                played through these nodes. Use them at your own risk.
                            </p>
                            <p className="font-bold text-white/80">
                                This service is provided "as is" without any warranty.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Node Submissions</h2>
                            <p>
                                By submitting a node, you confirm that you are the provider or have explicit 
                                permission to share the node credentials publicly. 
                                We reserve the right to remove any node for any reason at our discretion.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Liability</h2>
                            <p>
                                Lavalink List, its creators, and administrators shall not be held liable 
                                for any damages resulting from the use or inability to use the listed nodes.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
