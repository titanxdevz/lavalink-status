"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Activity,
    ArrowUpRight,
    Award,
    Check,
    Github,
    Globe,
    Hash,
    Link2,
    Loader2,
    Lock,
    MessageSquare,
    Pencil,
    Save,
    Server,
    ShieldCheck,
    Tag,
    Trash2,
    User as UserIcon,
    Users,
    X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NodeCard } from "@/components/NodeCard";
import {
    ActionButton,
    Badge,
    Breadcrumbs,
    EmptyState,
    Field,
    Panel,
    Section,
    SectionHeader,
    StatCard,
    inputClasses,
} from "@/components/site/ui";
import { useNodes } from "@/contexts/NodesContext";
import { parsePlayers } from "@/hooks/useLandingNodes";

const LINK_FIELDS = [
    { key: "discord", label: "Discord invite", icon: MessageSquare, placeholder: "https://discord.gg/..." },
    { key: "website", label: "Website", icon: Globe, placeholder: "https://example.com" },
    { key: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/..." },
];

function profileRank(nodeCount) {
    if (nodeCount >= 10) return "Principal operator";
    if (nodeCount >= 5) return "Veteran operator";
    if (nodeCount >= 1) return "Operator";
    return "Observer";
}

function mergeTelemetry(nodes, allNodes) {
    if (!allNodes.length) return nodes;

    const byId = new Map();
    const byEndpoint = new Map();

    for (const live of allNodes) {
        byId.set(String(live._id), live);
        byEndpoint.set(`${live.host}:${live.port}`, live);
    }

    return nodes.map(
        (node) =>
            byId.get(String(node._id)) ||
            byEndpoint.get(`${node.host}:${node.port}`) ||
            node
    );
}

export function ProfileClient({ userId, initialProfile }) {
    const { data: session } = useSession();
    const { nodes: allNodes, updateNode, deleteNode } = useNodes();

    const [profile, setProfile] = useState(initialProfile);
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [editData, setEditData] = useState({
        bio: initialProfile?.bio || "",
        links: initialProfile?.links || {},
    });

    const [editingNode, setEditingNode] = useState(null);
    const [nodeSaving, setNodeSaving] = useState(false);
    const [nodeError, setNodeError] = useState("");

    const isOwnProfile = Boolean(session?.user?.id && session.user.id === userId);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) {
                    if (response.status === 404 && !cancelled) setNotFound(true);
                    return;
                }
                const data = await response.json();
                if (cancelled || !data.user) return;

                setProfile(data.user);
                setNodes(data.nodes || []);
                setEditData({
                    bio: data.user.bio || "",
                    links: data.user.links || {},
                });
            } catch {
                // The server-rendered summary remains visible if the API fails.
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [userId]);

    const liveNodes = useMemo(() => mergeTelemetry(nodes, allNodes), [nodes, allNodes]);

    const stats = useMemo(() => {
        const online = liveNodes.filter((node) => node.isConnected).length;
        const players = liveNodes.reduce(
            (sum, node) => sum + parsePlayers(node.connections),
            0
        );
        const regions = new Set(
            liveNodes.map((node) => (node.region || "").toUpperCase()).filter(Boolean)
        );

        return {
            total: liveNodes.length,
            online,
            players,
            regions: regions.size,
        };
    }, [liveNodes]);

    const links = profile?.links || {};
    const displayName = profile?.name || "Operator";
    const handle = profile?.id || profile?._id || userId;

    const handleSaveProfile = async () => {
        setSaving(true);
        setSaveError("");
        try {
            const response = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });

            if (!response.ok) throw new Error(await response.text());

            setProfile((previous) => ({ ...previous, ...editData }));
            setEditing(false);
        } catch (error) {
            setSaveError(error.message || "Could not save the profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteNode = async (node) => {
        if (!window.confirm(`Remove “${node.identifier}” from the public directory?`)) return;

        try {
            await deleteNode(node.host, node.port, node._id);
            setNodes((previous) => previous.filter((item) => item._id !== node._id));
        } catch (error) {
            window.alert(`Could not remove the node: ${error.message}`);
        }
    };

    const handleUpdateNode = async (event) => {
        event.preventDefault();
        setNodeSaving(true);
        setNodeError("");

        try {
            await updateNode(editingNode);
            setNodes((previous) =>
                previous.map((item) =>
                    item._id === editingNode._id ? { ...item, ...editingNode } : item
                )
            );
            setEditingNode(null);
        } catch (error) {
            setNodeError(error.message || "Could not update the node.");
        } finally {
            setNodeSaving(false);
        }
    };

    if (notFound && !profile) {
        return (
            <div className="min-h-screen bg-ink-950 font-display text-white">
                <Navbar />
                <main className="mx-auto max-w-3xl px-6 py-24">
                    <EmptyState
                        icon={UserIcon}
                        title="Operator not found."
                        description="This profile does not exist, or the account has been removed from the directory."
                        action={
                            <Link
                                href="/"
                                className="inline-flex h-11 items-center border border-signal bg-signal px-5 font-data text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-950"
                            >
                                Back to the directory
                            </Link>
                        }
                    />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ink-950 font-display text-white selection:bg-signal selection:text-ink-950">
            <Navbar />

            <main>
                <header className="relative overflow-hidden border-b border-line">
                    <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 mask-fade-b" />
                    <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-signal/10 blur-[120px]" />

                    <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
                        <Breadcrumbs
                            items={[
                                { label: "Home", href: "/" },
                                { label: "Operators", href: "/leaderboard" },
                                { label: displayName },
                            ]}
                        />

                        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
                            <div className="lg:col-span-4">
                                <div className="flex items-start gap-5">
                                    <div className="relative shrink-0">
                                        <span className="grid h-24 w-24 place-items-center overflow-hidden border border-line bg-ink-900 text-dim sm:h-28 sm:w-28">
                                            {profile?.image ? (
                                                <img
                                                    src={profile.image}
                                                    alt=""
                                                    width={112}
                                                    height={112}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <UserIcon size={40} />
                                            )}
                                        </span>
                                        <span
                                            className={`absolute -bottom-1.5 -right-1.5 h-3 w-3 border-2 border-ink-950 ${
                                                stats.online > 0 ? "bg-ok" : "bg-dim"
                                            }`}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div className="min-w-0 pt-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h1 className="truncate font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                                {displayName}
                                            </h1>
                                            {profile?.role === "admin" && (
                                                <Badge tone="warn">
                                                    <ShieldCheck size={10} />
                                                    Admin
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="mt-1 font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                                            {profileRank(stats.total)}
                                        </p>
                                        <p className="mt-2 break-all font-data text-[10px] text-dim/70">
                                            ID {handle}
                                        </p>
                                    </div>
                                </div>

                                {isOwnProfile && !editing && (
                                    <ActionButton
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setEditing(true)}
                                        className="mt-6"
                                    >
                                        <Pencil size={13} />
                                        Edit profile
                                    </ActionButton>
                                )}
                            </div>

                            <div className="lg:col-span-8">
                                {!editing ? (
                                    <>
                                        <p className="max-w-2xl text-pretty text-base leading-relaxed text-dim">
                                            {profile?.bio ||
                                                "This operator has not added a bio yet. Their public nodes are listed below."}
                                        </p>

                                        <div className="mt-6 flex flex-wrap gap-2">
                                            {links.discord && (
                                                <a
                                                    href={links.discord}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex h-9 items-center gap-2 border border-line bg-ink-900 px-3 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-signal/50 hover:text-white"
                                                >
                                                    <MessageSquare size={13} />
                                                    Discord
                                                    <ArrowUpRight size={11} />
                                                </a>
                                            )}
                                            {links.website && (
                                                <a
                                                    href={links.website}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex h-9 items-center gap-2 border border-line bg-ink-900 px-3 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-signal/50 hover:text-white"
                                                >
                                                    <Globe size={13} />
                                                    Website
                                                    <ArrowUpRight size={11} />
                                                </a>
                                            )}
                                            {links.github && (
                                                <a
                                                    href={links.github}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex h-9 items-center gap-2 border border-line bg-ink-900 px-3 font-data text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-signal/50 hover:text-white"
                                                >
                                                    <Github size={13} />
                                                    GitHub
                                                    <ArrowUpRight size={11} />
                                                </a>
                                            )}
                                            {!links.discord && !links.website && !links.github && (
                                                <span className="font-data text-[10px] uppercase tracking-[0.14em] text-dim/60">
                                                    No external links
                                                </span>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <Panel className="p-6">
                                        <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
                                            <h2 className="font-display text-lg font-semibold text-white">
                                                Edit operator profile
                                            </h2>
                                            <button
                                                type="button"
                                                onClick={() => setEditing(false)}
                                                className="grid h-8 w-8 place-items-center border border-line text-dim transition-colors hover:text-white"
                                                aria-label="Cancel editing"
                                            >
                                                <X size={15} />
                                            </button>
                                        </div>

                                        <div className="mt-5 space-y-5">
                                            <Field label="Bio" htmlFor="profile-bio">
                                                <textarea
                                                    id="profile-bio"
                                                    value={editData.bio}
                                                    onChange={(event) =>
                                                        setEditData((previous) => ({
                                                            ...previous,
                                                            bio: event.target.value,
                                                        }))
                                                    }
                                                    rows={4}
                                                    placeholder="Tell people what you run and where."
                                                    className={inputClasses(
                                                        "h-auto min-h-[110px] py-3 leading-relaxed"
                                                    )}
                                                />
                                            </Field>

                                            <div className="grid gap-4 sm:grid-cols-3">
                                                {LINK_FIELDS.map((field) => (
                                                    <Field
                                                        key={field.key}
                                                        label={field.label}
                                                        htmlFor={`profile-${field.key}`}
                                                    >
                                                        <div className="relative">
                                                            <field.icon
                                                                size={13}
                                                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim"
                                                            />
                                                            <input
                                                                id={`profile-${field.key}`}
                                                                type="url"
                                                                value={
                                                                    editData.links?.[field.key] || ""
                                                                }
                                                                onChange={(event) =>
                                                                    setEditData((previous) => ({
                                                                        ...previous,
                                                                        links: {
                                                                            ...previous.links,
                                                                            [field.key]:
                                                                                event.target.value,
                                                                        },
                                                                    }))
                                                                }
                                                                placeholder={field.placeholder}
                                                                className={inputClasses("pl-9")}
                                                            />
                                                        </div>
                                                    </Field>
                                                ))}
                                            </div>

                                            {saveError && (
                                                <p
                                                    role="alert"
                                                    className="border border-bad/40 bg-bad/10 px-3 py-2 text-sm text-bad"
                                                >
                                                    {saveError}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap gap-2">
                                                <ActionButton
                                                    onClick={handleSaveProfile}
                                                    disabled={saving}
                                                >
                                                    {saving ? (
                                                        <Loader2
                                                            size={14}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Save size={14} />
                                                    )}
                                                    Save profile
                                                </ActionButton>
                                                <ActionButton
                                                    variant="ghost"
                                                    onClick={() => setEditing(false)}
                                                >
                                                    Cancel
                                                </ActionButton>
                                            </div>
                                        </div>
                                    </Panel>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <Section className="border-b-0">
                    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <StatCard
                            label="Listed nodes"
                            value={stats.total}
                            icon={Server}
                            hint="Approved and public"
                        />
                        <StatCard
                            label="Online now"
                            value={stats.online}
                            icon={Activity}
                            tone="ok"
                            hint="Passing the live probe"
                        />
                        <StatCard
                            label="Active players"
                            value={stats.players}
                            icon={Users}
                            hint="Across this operator's nodes"
                        />
                        <StatCard
                            label="Regions"
                            value={stats.regions || "—"}
                            icon={Globe}
                            hint="Distinct node locations"
                        />
                    </dl>
                </Section>

                <Section tone="raised" className="border-b-0">
                    <SectionHeader
                        eyebrow="Infrastructure"
                        title="Nodes by this operator."
                        description="Live telemetry is merged from the directory probe. Open a node from the main directory for the full connection block."
                        actions={
                            <Badge tone="dim">
                                <Award size={11} />
                                {profileRank(stats.total)}
                            </Badge>
                        }
                    />

                    {loading && liveNodes.length === 0 ? (
                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            {[0, 1].map((index) => (
                                <div
                                    key={index}
                                    className="h-64 animate-pulse border border-line bg-ink-950"
                                />
                            ))}
                        </div>
                    ) : liveNodes.length === 0 ? (
                        <div className="mt-8">
                            <EmptyState
                                icon={Server}
                                title="No public nodes yet."
                                description={
                                    isOwnProfile
                                        ? "Submit a node and it will appear here once an administrator approves it."
                                        : "This operator has no approved nodes in the directory right now."
                                }
                                action={
                                    isOwnProfile ? (
                                        <Link
                                            href="/submit"
                                            className="inline-flex h-11 items-center gap-2 border border-signal bg-signal px-5 font-data text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-950"
                                        >
                                            Add a node
                                            <ArrowUpRight size={14} />
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/"
                                            className="inline-flex h-11 items-center border border-line px-5 font-data text-[11px] uppercase tracking-[0.14em] text-white"
                                        >
                                            Browse the directory
                                        </Link>
                                    )
                                }
                            />
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            {liveNodes.map((node) => (
                                <NodeCard
                                    key={node._id}
                                    node={node}
                                    onEdit={isOwnProfile ? setEditingNode : undefined}
                                    onDelete={isOwnProfile ? handleDeleteNode : undefined}
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 font-data text-[10px] uppercase tracking-[0.14em] text-dim">
                        <Link
                            href="/leaderboard"
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-signal"
                        >
                            <Award size={12} />
                            Operator leaderboard
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-signal"
                        >
                            <Link2 size={12} />
                            Full node directory
                        </Link>
                    </div>
                </Section>
            </main>

            <Footer />

            {editingNode && (
                <div
                    className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink-950/90 p-4 py-10 backdrop-blur-sm sm:items-center"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) setEditingNode(null);
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-node-title"
                        className="w-full max-w-xl border border-line bg-ink-900"
                    >
                        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
                            <h2
                                id="edit-node-title"
                                className="font-display text-lg font-semibold text-white"
                            >
                                Edit node
                            </h2>
                            <button
                                type="button"
                                onClick={() => setEditingNode(null)}
                                className="grid h-8 w-8 place-items-center border border-line text-dim transition-colors hover:text-white"
                                aria-label="Close"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateNode} className="space-y-5 p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Identifier"
                                    htmlFor="node-identifier"
                                    className="sm:col-span-2"
                                >
                                    <div className="relative">
                                        <Hash
                                            size={13}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim"
                                        />
                                        <input
                                            id="node-identifier"
                                            required
                                            value={editingNode.identifier || ""}
                                            onChange={(event) =>
                                                setEditingNode((previous) => ({
                                                    ...previous,
                                                    identifier: event.target.value,
                                                }))
                                            }
                                            className={inputClasses("pl-9")}
                                        />
                                    </div>
                                </Field>

                                <Field label="Host" htmlFor="node-host">
                                    <div className="relative">
                                        <Globe
                                            size={13}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim"
                                        />
                                        <input
                                            id="node-host"
                                            required
                                            value={editingNode.host || ""}
                                            onChange={(event) =>
                                                setEditingNode((previous) => ({
                                                    ...previous,
                                                    host: event.target.value,
                                                }))
                                            }
                                            className={inputClasses("pl-9")}
                                        />
                                    </div>
                                </Field>

                                <Field label="Port" htmlFor="node-port">
                                    <input
                                        id="node-port"
                                        type="number"
                                        min="1"
                                        max="65535"
                                        required
                                        value={editingNode.port || ""}
                                        onChange={(event) =>
                                            setEditingNode((previous) => ({
                                                ...previous,
                                                port: event.target.value,
                                            }))
                                        }
                                        className={inputClasses()}
                                    />
                                </Field>

                                <Field
                                    label="Auth key"
                                    htmlFor="node-password"
                                    className="sm:col-span-2"
                                >
                                    <div className="relative">
                                        <Lock
                                            size={13}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim"
                                        />
                                        <input
                                            id="node-password"
                                            required
                                            value={editingNode.password || ""}
                                            onChange={(event) =>
                                                setEditingNode((previous) => ({
                                                    ...previous,
                                                    password: event.target.value,
                                                }))
                                            }
                                            className={inputClasses("pl-9")}
                                        />
                                    </div>
                                </Field>

                                <Field label="REST version" htmlFor="node-version">
                                    <div className="relative">
                                        <Tag
                                            size={13}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim"
                                        />
                                        <select
                                            id="node-version"
                                            value={editingNode.restVersion || "v4"}
                                            onChange={(event) =>
                                                setEditingNode((previous) => ({
                                                    ...previous,
                                                    restVersion: event.target.value,
                                                }))
                                            }
                                            className={inputClasses("appearance-none pl-9")}
                                        >
                                            <option value="v4">Lavalink v4</option>
                                            <option value="v3">Lavalink v3</option>
                                        </select>
                                    </div>
                                </Field>

                                <Field label="Transport" htmlFor="node-secure">
                                    <button
                                        id="node-secure"
                                        type="button"
                                        aria-pressed={Boolean(editingNode.secure)}
                                        onClick={() =>
                                            setEditingNode((previous) => ({
                                                ...previous,
                                                secure: !previous.secure,
                                            }))
                                        }
                                        className={`flex h-11 w-full items-center justify-between border px-3 font-data text-[10px] uppercase tracking-[0.14em] transition-colors ${
                                            editingNode.secure
                                                ? "border-ok/50 bg-ok/10 text-ok"
                                                : "border-line bg-ink-950 text-dim hover:text-white"
                                        }`}
                                    >
                                        {editingNode.secure ? "TLS / WSS" : "Plain WS"}
                                        {editingNode.secure && <Check size={13} />}
                                    </button>
                                </Field>
                            </div>

                            <p className="border border-warn/30 bg-warn/10 px-3 py-2.5 text-xs leading-relaxed text-warn">
                                Changing the host, port, or transport can require the node to be
                                re-verified by an administrator.
                            </p>

                            {nodeError && (
                                <p
                                    role="alert"
                                    className="border border-bad/40 bg-bad/10 px-3 py-2 text-sm text-bad"
                                >
                                    {nodeError}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2 border-t border-line pt-5">
                                <ActionButton type="submit" disabled={nodeSaving}>
                                    {nodeSaving ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <Save size={14} />
                                    )}
                                    Save changes
                                </ActionButton>
                                <ActionButton
                                    variant="secondary"
                                    onClick={() => setEditingNode(null)}
                                >
                                    Cancel
                                </ActionButton>
                                <ActionButton
                                    variant="danger"
                                    className="sm:ml-auto"
                                    onClick={() => {
                                        const node = editingNode;
                                        setEditingNode(null);
                                        handleDeleteNode(node);
                                    }}
                                >
                                    <Trash2 size={14} />
                                    Delete node
                                </ActionButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
