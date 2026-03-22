"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const NodesContext = createContext();

const CACHE_KEY = "lavalink_nodes_cache";
const CACHE_TTL = 5 * 60 * 1000;

export function NodesProvider({ children }) {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetch, setLastFetch] = useState(null);
    const mounted = useRef(true);

    const fetchNodes = useCallback(async (force = false) => {
        if (!force && lastFetch && Date.now() - lastFetch < CACHE_TTL) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/nodes");
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`API Error (${res.status}): ${text.slice(0, 100)}`);
            }
            const data = await res.json();
            if (mounted.current) {
                setNodes(data);
                const ts = Date.now();
                setLastFetch(ts);
                localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: ts }));
            }
        } catch (err) {
            if (mounted.current) setError(err.message || "Failed to fetch nodes");
        } finally {
            if (mounted.current) setLoading(false);
        }
    }, [lastFetch]);

    useEffect(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_TTL) {
                    setNodes(data);
                    setLastFetch(timestamp);
                    setLoading(false);
                    return;
                }
            } catch { }
        }
        fetchNodes();
    }, [fetchNodes]);

    useEffect(() => {
        const id = setInterval(() => fetchNodes(true), 2 * 60 * 1000);
        return () => clearInterval(id);
    }, [fetchNodes]);

    useEffect(() => {
        return () => { mounted.current = false; };
    }, []);

    const submitNode = async (nodeData) => {
        const res = await fetch("/api/nodes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nodeData)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    };

    const updateNodeStatus = async (host, port, status) => {
        const res = await fetch("/api/nodes", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ host, port, status })
        });
        if (!res.ok) throw new Error(await res.text());
        fetchNodes(true);
        return await res.json();
    };

    const deleteNode = async (host, port) => {
        const res = await fetch(`/api/nodes?host=${host}&port=${port}`, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error(await res.text());
        fetchNodes(true);
        return await res.json();
    };

    return (
        <NodesContext.Provider value={{ 
            nodes, loading, error, fetchNodes, lastFetch,
            submitNode, updateNodeStatus, deleteNode 
        }}>
            {children}
        </NodesContext.Provider>
    );
}

export function useNodes() {
    const ctx = useContext(NodesContext);
    if (!ctx) throw new Error("useNodes must be used within NodesProvider");
    return ctx;
}