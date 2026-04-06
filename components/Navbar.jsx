import Link from "next/link";
import { Plus, Home, Shield, Server, Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Navbar({ activeTab }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="flex flex-col py-4 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
            <div className="flex items-center justify-between w-full">
                {/* Left Side: Logo & Navigation */}
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black italic">LL</div>
                        <span className="font-bold text-xl tracking-tight">Lavalink List</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/">
                            <Button variant="ghost" className={`gap-2 ${activeTab === 'home' ? 'text-foreground font-semibold bg-accent' : 'text-muted-foreground'}`}>
                                <Home className="w-4 h-4" /> Home
                            </Button>
                        </Link>
                        <Link href="/ssl">
                            <Button variant="ghost" className={`gap-2 ${activeTab === 'ssl' ? 'text-foreground font-semibold bg-accent' : 'text-muted-foreground'}`}>
                                <Shield className="w-4 h-4" /> SSL Nodes
                            </Button>
                        </Link>
                        <Link href="/non-ssl">
                            <Button variant="ghost" className={`gap-2 ${activeTab === 'non-ssl' ? 'text-foreground font-semibold bg-accent' : 'text-muted-foreground'}`}>
                                <Server className="w-4 h-4" /> Non-SSL Nodes
                            </Button>
                        </Link>
                        <Link href="/submit">
                            <Button 
                                variant="ghost" 
                                className={`gap-2 ${activeTab === 'submit' ? 'text-foreground font-semibold bg-accent' : 'text-muted-foreground'}`}
                            >
                                <Plus className="w-4 h-4" /> Add Node
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2">
                        <Link href="/admin">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Settings className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden flex flex-col gap-2 pt-4 pb-2 border-t border-border mt-4 animate-in slide-in-from-top-2">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className={`w-full justify-start gap-2 ${activeTab === 'home' ? 'text-foreground font-semibold bg-accent' : 'text-muted-foreground'}`}>
                            <Home className="w-4 h-4" /> Home
                        </Button>
                    </Link>
                    <Link href="/ssl" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className={`w-full justify-start gap-2 ${activeTab === 'ssl' ? 'text-foreground font-semibold bg-accent' : 'text-muted-foreground'}`}>
                            <Shield className="w-4 h-4" /> SSL Nodes
                        </Button>
                    </Link>
                    <Link href="/non-ssl" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className={`w-full justify-start gap-2 ${activeTab === 'non-ssl' ? 'text-foreground font-semibold bg-accent' : 'text-muted-foreground'}`}>
                            <Server className="w-4 h-4" /> Non-SSL Nodes
                        </Button>
                    </Link>
                    <Link href="/submit" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button 
                            variant="ghost" 
                            className={`w-full justify-start gap-2 ${activeTab === 'submit' ? 'text-foreground font-semibold bg-accent' : 'text-muted-foreground'}`}
                        >
                            <Plus className="w-4 h-4" /> Add Node
                        </Button>
                    </Link>
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                            <Settings className="w-4 h-4" /> Admin Panel
                        </Button>
                    </Link>
                </div>
            )}
        </nav>
    );
}

