"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { ChevronDown, LogIn, LogOut, Menu, Plus, User, X } from "lucide-react";

const NAV_ITEMS = [
    { href: "/", label: "Nodes" },
    { href: "/ssl", label: "SSL" },
    { href: "/non-ssl", label: "Non-SSL" },
    { href: "/leaderboard", label: "Leaderboard" },
];

function isActive(pathname, href) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const userRef = useRef(null);

    useEffect(() => {
        setMobileOpen(false);
        setUserOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (userRef.current && !userRef.current.contains(event.target)) {
                setUserOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, []);

    return (
        <header className="sticky top-0 z-50 border-b border-line bg-ink-950/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
                <Link href="/" className="flex shrink-0 items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center border border-signal/40 bg-signal/10 font-data text-xs font-semibold tracking-[0.08em] text-signal">
                        LL
                    </span>
                    <span className="font-display text-base font-semibold tracking-tight text-white">
                        Lavalink <span className="text-dim">Grid</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(pathname, item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={active ? "page" : undefined}
                                className={`relative py-2 font-data text-[11px] uppercase tracking-[0.16em] transition-colors ${
                                    active ? "text-white" : "text-dim hover:text-white"
                                }`}
                            >
                                {item.label}
                                {active && (
                                    <span className="absolute inset-x-0 -bottom-1 h-px bg-signal" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden items-center gap-2 lg:flex">
                    <Link
                        href="/submit"
                        className="inline-flex h-9 items-center gap-1.5 border border-signal bg-signal px-3 font-data text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-signal-soft"
                    >
                        <Plus size={13} />
                        Add node
                    </Link>

                    {session ? (
                        <div className="relative" ref={userRef}>
                            <button
                                type="button"
                                onClick={() => setUserOpen((value) => !value)}
                                aria-expanded={userOpen}
                                aria-haspopup="menu"
                                className="inline-flex h-9 items-center gap-2 border border-line bg-ink-900 pl-1 pr-2.5 transition-colors hover:border-signal/40"
                            >
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt=""
                                        className="h-7 w-7 border border-line object-cover"
                                    />
                                ) : (
                                    <span className="grid h-7 w-7 place-items-center bg-signal/10 text-signal">
                                        <User size={14} />
                                    </span>
                                )}
                                <span className="max-w-[120px] truncate font-data text-[10px] uppercase tracking-[0.12em] text-white">
                                    {session.user.name || "Account"}
                                </span>
                                <ChevronDown
                                    size={12}
                                    className={`text-dim transition-transform ${
                                        userOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {userOpen && (
                                <div
                                    className="absolute right-0 top-[calc(100%+8px)] w-60 border border-line bg-ink-900 p-1.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]"
                                    role="menu"
                                >
                                    <div className="border-b border-line px-3 py-2.5">
                                        <div className="font-data text-[9px] uppercase tracking-[0.14em] text-dim">
                                            Signed in as
                                        </div>
                                        <div className="mt-1 truncate text-xs text-white">
                                            {session.user.email}
                                        </div>
                                    </div>
                                    <Link
                                        href={`/profile/${session.user.id}`}
                                        role="menuitem"
                                        className="mt-1 flex items-center gap-2 px-3 py-2 font-data text-[10px] uppercase tracking-[0.12em] text-dim transition-colors hover:bg-ink-950 hover:text-white"
                                    >
                                        <User size={13} />
                                        View profile
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => signOut()}
                                        role="menuitem"
                                        className="flex w-full items-center gap-2 px-3 py-2 font-data text-[10px] uppercase tracking-[0.12em] text-bad transition-colors hover:bg-bad/10"
                                    >
                                        <LogOut size={13} />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => signIn("discord")}
                            className="inline-flex h-9 items-center gap-1.5 border border-line bg-ink-900 px-3 font-data text-[10px] uppercase tracking-[0.12em] text-dim transition-colors hover:border-signal/40 hover:text-white"
                        >
                            <LogIn size={13} />
                            Sign in
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    className="grid h-9 w-9 place-items-center border border-line bg-ink-900 text-white lg:hidden"
                    onClick={() => setMobileOpen((value) => !value)}
                    aria-expanded={mobileOpen}
                    aria-label="Toggle navigation"
                >
                    {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t border-line bg-ink-900 lg:hidden">
                    <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3" aria-label="Mobile">
                        {NAV_ITEMS.map((item) => {
                            const active = isActive(pathname, item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center justify-between px-3 py-3 font-data text-[11px] uppercase tracking-[0.14em] ${
                                        active ? "text-signal" : "text-dim"
                                    }`}
                                >
                                    {item.label}
                                    {active && <span className="h-1 w-1 bg-signal" />}
                                </Link>
                            );
                        })}

                        <div className="mt-2 grid gap-2 border-t border-line pt-3">
                            <Link
                                href="/submit"
                                className="inline-flex h-10 items-center justify-center gap-2 border border-signal bg-signal px-3 font-data text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-950"
                            >
                                <Plus size={13} />
                                Add node
                            </Link>

                            {session ? (
                                <button
                                    type="button"
                                    onClick={() => signOut()}
                                    className="inline-flex h-10 items-center justify-center gap-2 border border-line px-3 font-data text-[10px] uppercase tracking-[0.12em] text-bad"
                                >
                                    <LogOut size={13} />
                                    Sign out
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => signIn("discord")}
                                    className="inline-flex h-10 items-center justify-center gap-2 border border-line px-3 font-data text-[10px] uppercase tracking-[0.12em] text-dim"
                                >
                                    <LogIn size={13} />
                                    Sign in
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
