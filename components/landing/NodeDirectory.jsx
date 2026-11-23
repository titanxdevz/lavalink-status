"use client";

import Link from "next/link";
import {
    AlertTriangle,
    ArrowRight,
    ChevronDown,
    RefreshCw,
    Search,
    Server,
    X,
} from "lucide-react";
import { LandingNodeCard } from "./LandingNodeCard";
import { LiveAge } from "./LiveAge";

function Select({ label, value, onChange, options }) {
    return (
        <label className="relative inline-flex h-10 items-center border border-line bg-ink-950 transition-colors focus-within:border-signal/60">
            <span className="sr-only">{label}</span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-full appearance-none bg-transparent pl-3 pr-8 font-data text-[10px] uppercase tracking-[0.12em] text-white outline-none"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-ink-950 text-white">
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-2.5 text-dim" />
        </label>
    );
}

function Toggle({ pressed, onClick, label }) {
    return (
        <button
            type="button"
            aria-pressed={pressed}
            onClick={onClick}
            className={`inline-flex h-8 items-center gap-2 border px-2.5 font-data text-[9px] uppercase tracking-[0.14em] transition-colors ${
                pressed
                    ? "border-signal/40 bg-signal/10 text-signal"
                    : "border-line bg-ink-950 text-dim hover:text-white"
            }`}
        >
            <span className={`h-1.5 w-1.5 ${pressed ? "bg-signal" : "bg-dim/40"}`} />
            {label}
        </button>
    );
}

function SkeletonGrid() {
    return (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border border-line bg-ink-900 p-4">
                    <div className="flex items-center justify-between">
                        <div className="h-2.5 w-20 animate-pulse bg-ink-800" />
                        <div className="h-2.5 w-12 animate-pulse bg-ink-800" />
                    </div>
                    <div className="mt-5 h-4 w-2/3 animate-pulse bg-ink-800" />
                    <div className="mt-2 h-2.5 w-1/2 animate-pulse bg-ink-800" />
                    <div className="mt-5 grid grid-cols-4 gap-px bg-line">
                        {Array.from({ length: 4 }).map((__, cell) => (
                            <div key={cell} className="h-12 bg-ink-950" />
                        ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-line pt-3">
                        <div className="h-2.5 w-16 animate-pulse bg-ink-800" />
                        <div className="h-8 w-16 animate-pulse bg-ink-800" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function NodeDirectory({
    data,
    onSelect,
    eyebrow = "Directory",
    heading = "Browse the grid.",
    description = "Filter by region, transport, and live load. Open any node for full telemetry and a ready-to-paste connection block.",
    showTransport = true,
    sectionId = "directory",
}) {
    const {
        visible,
        filtered,
        regions,
        loading,
        error,
        lastFetch,
        session,
        isOwner,
        query,
        setQuery,
        region,
        setRegion,
        transport,
        setTransport,
        sort,
        setSort,
        onlineOnly,
        setOnlineOnly,
        showMine,
        toggleMine,
        expanded,
        setExpanded,
        hasFilters,
        resetFilters,
        refresh,
    } = data;

    return (
        <section id={sectionId} className="border-b border-line">
            <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
                <div className="max-w-2xl">
                    <p className="font-data text-[10px] uppercase tracking-[0.22em] text-signal">
                        {eyebrow}
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        {heading}
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-dim">{description}</p>
                </div>

                <div className="mt-10 border border-line bg-ink-900 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <Search
                                size={16}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim"
                            />
                            <label htmlFor="node-search" className="sr-only">
                                Search nodes
                            </label>
                            <input
                                id="node-search"
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search identifier, host, or region"
                                className="h-10 w-full border border-line bg-ink-950 pl-9 pr-9 font-data text-xs text-white outline-none transition-colors placeholder:text-dim/60 focus:border-signal/60"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery("")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-dim transition-colors hover:text-white"
                                    aria-label="Clear search"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                label="Filter by region"
                                value={region}
                                onChange={setRegion}
                                options={regions.map((value) => ({
                                    value,
                                    label: value === "all" ? "All regions" : value,
                                }))}
                            />
                            <Select
                                label="Sort nodes"
                                value={sort}
                                onChange={setSort}
                                options={[
                                    { value: "status", label: "Sort: traffic" },
                                    { value: "load", label: "Sort: load" },
                                    { value: "players", label: "Sort: players" },
                                    { value: "uptime", label: "Sort: uptime" },
                                    { value: "name", label: "Sort: name" },
                                ]}
                            />
                            <button
                                type="button"
                                onClick={refresh}
                                disabled={loading}
                                className="inline-flex h-10 items-center gap-2 border border-line bg-ink-950 px-3 font-data text-[10px] uppercase tracking-[0.12em] text-dim transition-colors hover:border-signal/50 hover:text-white disabled:opacity-50"
                            >
                                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                        {showTransport && (
                            <div
                                className="inline-flex h-8 items-center border border-line bg-ink-950 p-0.5"
                                role="group"
                                aria-label="Transport"
                            >
                                {[
                                    ["all", "All"],
                                    ["ssl", "TLS"],
                                    ["ws", "WS"],
                                ].map(([value, label]) => (
                                    <button
                                        key={value}
                                        type="button"
                                        aria-pressed={transport === value}
                                        onClick={() => setTransport(value)}
                                        className={`h-full px-2.5 font-data text-[9px] uppercase tracking-[0.14em] transition-colors ${
                                            transport === value
                                                ? "bg-signal text-ink-950"
                                                : "text-dim hover:text-white"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <Toggle
                            pressed={onlineOnly}
                            onClick={() => setOnlineOnly((value) => !value)}
                            label="Online only"
                        />

                        {session && (
                            <Toggle pressed={showMine} onClick={toggleMine} label="My nodes" />
                        )}

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex h-8 items-center gap-1.5 px-1 font-data text-[9px] uppercase tracking-[0.14em] text-dim transition-colors hover:text-white"
                            >
                                <X size={11} />
                                Clear filters
                            </button>
                        )}

                        <span
                            className="ml-auto font-data text-[9px] uppercase tracking-[0.16em] text-dim"
                            aria-live="polite"
                        >
                            {loading ? "Syncing" : `${filtered.length} nodes`}
                        </span>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                    <p className="font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                        {showMine ? "Your nodes" : "Directory"}{" "}
                        <span className="text-white">/</span> {visible.length} of {filtered.length}
                    </p>
                    <LiveAge
                        timestamp={lastFetch}
                        prefix="Updated"
                        className="font-data text-[10px] uppercase tracking-[0.14em] text-dim"
                    />
                </div>

                {loading && !lastFetch ? (
                    <SkeletonGrid />
                ) : error ? (
                    <div className="mt-4 border border-bad/30 bg-bad/5 px-6 py-16 text-center">
                        <AlertTriangle size={28} className="mx-auto text-bad" />
                        <h3 className="mt-4 font-display text-xl font-semibold text-white">
                            The directory could not load.
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-dim">
                            {error}
                        </p>
                        <button
                            type="button"
                            onClick={refresh}
                            className="mt-6 inline-flex h-10 items-center gap-2 border border-signal bg-signal px-4 font-data text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-signal-soft"
                        >
                            <RefreshCw size={13} />
                            Try again
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="mt-4 border border-dashed border-line px-6 py-16 text-center">
                        <Server size={28} className="mx-auto text-dim" />
                        <h3 className="mt-4 font-display text-xl font-semibold text-white">
                            No nodes match those filters.
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-dim">
                            Try another region, include offline nodes, or clear the filters to see
                            the full directory.
                        </p>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="mt-6 inline-flex h-10 items-center gap-2 border border-line bg-ink-900 px-4 font-data text-[10px] uppercase tracking-[0.14em] text-white transition-colors hover:border-signal/50"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {visible.map((node) => (
                                <LandingNodeCard
                                    key={node._id || `${node.host}:${node.port}`}
                                    node={node}
                                    isOwner={isOwner(node)}
                                    onSelect={onSelect}
                                />
                            ))}
                        </div>

                        {filtered.length > 9 && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => setExpanded((value) => !value)}
                                    className="inline-flex h-10 items-center gap-2 border border-line bg-ink-900 px-4 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-signal/50 hover:text-white"
                                >
                                    {expanded ? "Show fewer" : `Show all ${filtered.length} nodes`}
                                    <ChevronDown
                                        size={13}
                                        className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                                    />
                                </button>
                            </div>
                        )}
                    </>
                )}

                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5">
                    {[
                        ["/ssl", "Browse TLS nodes"],
                        ["/non-ssl", "Browse non-TLS nodes"],
                        ["/leaderboard", "Operator leaderboard"],
                    ].map(([href, label]) => (
                        <Link
                            key={href}
                            href={href}
                            className="inline-flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:text-signal"
                        >
                            {label}
                            <ArrowRight size={12} />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
