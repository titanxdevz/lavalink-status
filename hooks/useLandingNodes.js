"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useNodes } from "@/contexts/NodesContext";

const SIZE_TO_MB = {
    B: 1 / 1048576,
    KB: 1 / 1024,
    MB: 1,
    GB: 1024,
    TB: 1048576,
};

export function parseSizeToMb(value) {
    if (typeof value !== "string") return 0;
    const match = value.match(/([\d.]+)\s*(B|KB|MB|GB|TB)/i);
    if (!match) return 0;
    return parseFloat(match[1]) * (SIZE_TO_MB[match[2].toUpperCase()] || 0);
}

export function parseLoad(value) {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return 0;
    const match = value.match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
}

export function parsePlayers(value) {
    if (typeof value !== "string") return 0;
    const parsed = parseInt(value.split("/")[0], 10);
    return Number.isFinite(parsed) ? parsed : 0;
}

export function formatUptime(ms) {
    if (!ms || ms <= 0) return "—";
    const seconds = Math.floor(ms / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

export function formatAge(timestamp) {
    if (!timestamp) return "never";
    const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (seconds < 10) return "just now";
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
}

/**
 * @param {{ secure?: boolean | null }} options
 * Pass secure=true/false to lock a directory to one transport (SSL pages).
 * Pass null (default) for the mixed landing directory.
 */
export function useLandingNodes({ secure = null } = {}) {
    const { data: session } = useSession();
    const { nodes: allNodes, loading, error, fetchNodes, lastFetch } = useNodes();

    const [query, setQuery] = useState("");
    const deferredQuery = useDeferredValue(query);
    const [region, setRegion] = useState("all");
    const [transport, setTransport] = useState(
        secure === true ? "ssl" : secure === false ? "ws" : "all"
    );
    const [sort, setSort] = useState("status");
    const [onlineOnly, setOnlineOnly] = useState(true);
    const [showMine, setShowMine] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (!session && showMine) setShowMine(false);
    }, [session, showMine]);

    const nodes = useMemo(() => {
        if (secure === null) return allNodes;
        return allNodes.filter((node) => Boolean(node.secure) === secure);
    }, [allNodes, secure]);

    const stats = useMemo(() => {
        const total = nodes.length;
        const online = nodes.filter((node) => node.isConnected).length;
        const players = nodes.reduce((sum, node) => sum + parsePlayers(node.connections), 0);
        const memoryMb = nodes.reduce((sum, node) => sum + parseSizeToMb(node.memory), 0);
        const loads = nodes
            .filter((node) => node.isConnected)
            .map((node) => parseLoad(node.systemLoad));
        const avgLoad = loads.length ? loads.reduce((a, b) => a + b, 0) / loads.length : 0;
        const regionSet = new Set(
            nodes.map((node) => (node.region || "").toUpperCase()).filter(Boolean)
        );
        const versions = Array.from(
            new Set(nodes.map((node) => node.restVersion || "v4"))
        ).sort();
        const operators = new Set(
            nodes.map((node) => node.ownerId || node.authorId).filter(Boolean)
        );
        const secureCount = nodes.filter((node) => node.secure).length;

        return {
            total,
            online,
            offline: total - online,
            players,
            memoryMb,
            memoryGb: memoryMb / 1024,
            avgLoad,
            regions: regionSet.size,
            versions,
            operators: operators.size,
            secure: secureCount,
            nonSecure: total - secureCount,
        };
    }, [nodes]);

    const regions = useMemo(() => {
        const values = Array.from(
            new Set(nodes.map((node) => (node.region || "").toUpperCase()).filter(Boolean))
        ).sort();
        return ["all", ...values];
    }, [nodes]);

    const filtered = useMemo(() => {
        const needle = deferredQuery.trim().toLowerCase();

        const list = nodes.filter((node) => {
            if (showMine && node.ownerId !== session?.user?.id) return false;
            if (onlineOnly && !node.isConnected) return false;
            if (region !== "all" && (node.region || "").toUpperCase() !== region) return false;
            if (transport === "ssl" && !node.secure) return false;
            if (transport === "ws" && node.secure) return false;
            if (!needle) return true;

            return [node.identifier, node.host, node.region, node.authorId].some((value) =>
                String(value || "").toLowerCase().includes(needle)
            );
        });

        return list.sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            if (a.isConnected !== b.isConnected) return a.isConnected ? -1 : 1;

            switch (sort) {
                case "load":
                    return parseLoad(a.systemLoad) - parseLoad(b.systemLoad);
                case "players":
                    return parsePlayers(b.connections) - parsePlayers(a.connections);
                case "uptime":
                    return (b.uptimeMillis || 0) - (a.uptimeMillis || 0);
                case "name":
                    return String(a.identifier || "").localeCompare(String(b.identifier || ""));
                default:
                    return parsePlayers(b.connections) - parsePlayers(a.connections);
            }
        });
    }, [nodes, deferredQuery, region, transport, sort, onlineOnly, showMine, session]);

    const visible = useMemo(
        () => (expanded ? filtered : filtered.slice(0, 9)),
        [filtered, expanded]
    );

    const hasFilters =
        query.trim().length > 0 ||
        region !== "all" ||
        (secure === null && transport !== "all") ||
        !onlineOnly ||
        showMine;

    const resetFilters = () => {
        setQuery("");
        setRegion("all");
        setTransport(secure === true ? "ssl" : secure === false ? "ws" : "all");
        setSort("status");
        setOnlineOnly(true);
        setShowMine(false);
        setExpanded(false);
    };

    const toggleMine = () => {
        setShowMine((value) => !value);
        setExpanded(false);
    };

    const refresh = () => fetchNodes(true);

    return {
        // data
        nodes,
        visible,
        filtered,
        stats,
        regions,
        loading,
        error,
        lastFetch,
        session,
        secure,
        isOwner: (node) => Boolean(session?.user?.id && node.ownerId === session.user.id),

        // filters
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

        // actions
        resetFilters,
        refresh,
    };
}
