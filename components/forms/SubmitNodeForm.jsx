"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    AlertTriangle,
    ArrowRight,
    Check,
    Globe,
    Hash,
    Loader2,
    Lock,
    MessageSquare,
    Server,
    Shield,
    Terminal,
    User,
} from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { useNodes } from "@/contexts/NodesContext";
import {
    ActionButton,
    ActionLink,
    Badge,
    Field,
    Panel,
    inputClasses,
} from "@/components/site/ui";

const INITIAL = {
    identifier: "",
    host: "",
    port: "2333",
    password: "youshallnotpass",
    secure: false,
    restVersion: "v4",
    authorId: "",
    website: "",
    discord: "",
};

function AuthGate() {
    return (
        <Panel className="p-8 text-center sm:p-12">
            <span className="mx-auto grid h-14 w-14 place-items-center border border-signal/30 bg-signal/10 text-signal">
                <Lock size={24} />
            </span>
            <h2 className="mt-6 font-display text-2xl font-semibold text-white sm:text-3xl">
                Sign in to submit a node.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-dim">
                Discord authentication prevents spam and gives every node an accountable
                owner. Your Discord account is only used to tie the submission to you.
            </p>
            <button
                type="button"
                onClick={() => signIn("discord")}
                className="mt-8 inline-flex h-11 items-center justify-center gap-2 border border-signal bg-signal px-5 font-data text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-signal-soft"
            >
                <User size={14} />
                Continue with Discord
            </button>
        </Panel>
    );
}

function SuccessPanel() {
    return (
        <Panel className="border-ok/40 p-8 text-center sm:p-12">
            <span className="mx-auto grid h-14 w-14 place-items-center border border-ok/40 bg-ok/10 text-ok">
                <Check size={26} />
            </span>
            <h2 className="mt-6 font-display text-2xl font-semibold text-white sm:text-3xl">
                Submission received.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-dim">
                Your node is in the review queue. An administrator will probe it before it
                appears in the public directory. Join the Discord for status updates.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <ActionLink href="/">Back to the directory</ActionLink>
                <ActionLink href="https://discord.vexanode.cloud" variant="secondary">
                    <MessageSquare size={14} />
                    Join Discord
                </ActionLink>
            </div>
        </Panel>
    );
}

export function SubmitNodeForm() {
    const { data: session, status } = useSession();
    const { submitNode } = useNodes();

    const [formData, setFormData] = useState(INITIAL);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const endpoint = useMemo(() => {
        const host = formData.host.trim() || "node.example.com";
        const port = formData.port || "2333";
        return `${formData.secure ? "wss" : "ws"}://${host}:${port}`;
    }, [formData.host, formData.port, formData.secure]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            await submitNode(formData);
            setSuccess(true);
        } catch (err) {
            setError(err.message || "Failed to submit node.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <Panel className="space-y-4 p-8">
                <div className="h-4 w-40 animate-pulse bg-ink-800" />
                <div className="h-11 w-full animate-pulse bg-ink-800" />
                <div className="h-11 w-full animate-pulse bg-ink-800" />
                <div className="h-11 w-2/3 animate-pulse bg-ink-800" />
            </Panel>
        );
    }

    if (!session) return <AuthGate />;
    if (success) return <SuccessPanel />;

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
                <Panel className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 border-b border-line pb-4">
                        <Server size={14} className="text-signal" />
                        <h2 className="font-display text-lg font-semibold text-white">
                            Node endpoint
                        </h2>
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <Field label="Identifier" htmlFor="identifier" className="sm:col-span-2">
                            <div className="relative">
                                <Hash
                                    size={14}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim"
                                />
                                <input
                                    id="identifier"
                                    name="identifier"
                                    required
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    placeholder="eu-node-01"
                                    className={inputClasses("pl-9")}
                                    autoComplete="off"
                                />
                            </div>
                        </Field>

                        <Field
                            label="Host"
                            htmlFor="host"
                            className="sm:col-span-2"
                            hint="Use the public hostname, not a local IP or a resolved address."
                        >
                            <div className="relative">
                                <Globe
                                    size={14}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim"
                                />
                                <input
                                    id="host"
                                    name="host"
                                    required
                                    value={formData.host}
                                    onChange={handleChange}
                                    placeholder="node.example.com"
                                    className={inputClasses("pl-9")}
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            </div>
                        </Field>

                        <Field label="Port" htmlFor="port">
                            <input
                                id="port"
                                name="port"
                                type="number"
                                inputMode="numeric"
                                min="1"
                                max="65535"
                                required
                                value={formData.port}
                                onChange={handleChange}
                                className={inputClasses()}
                            />
                        </Field>

                        <Field label="REST version" htmlFor="restVersion">
                            <select
                                id="restVersion"
                                name="restVersion"
                                value={formData.restVersion}
                                onChange={handleChange}
                                className={inputClasses("appearance-none")}
                            >
                                <option value="v4">Lavalink v4</option>
                                <option value="v3">Lavalink v3</option>
                            </select>
                        </Field>

                        <Field
                            label="Auth key"
                            htmlFor="password"
                            className="sm:col-span-2"
                            hint="The password your node accepts in the Authorization header."
                        >
                            <div className="relative">
                                <Lock
                                    size={14}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim"
                                />
                                <input
                                    id="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={inputClasses("pl-9")}
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            </div>
                        </Field>
                    </div>
                </Panel>

                <Panel className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 border-b border-line pb-4">
                        <Shield size={14} className="text-signal" />
                        <h2 className="font-display text-lg font-semibold text-white">
                            Transport
                        </h2>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <button
                            type="button"
                            aria-pressed={!formData.secure}
                            onClick={() => setFormData((p) => ({ ...p, secure: false }))}
                            className={`border p-4 text-left transition-colors ${
                                !formData.secure
                                    ? "border-signal/60 bg-signal/10"
                                    : "border-line bg-ink-950 hover:border-signal/40"
                            }`}
                        >
                            <span className="font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                                Plain WebSocket
                            </span>
                            <span className="mt-1 block font-display text-sm font-medium text-white">
                                ws:// + http://
                            </span>
                        </button>

                        <button
                            type="button"
                            aria-pressed={formData.secure}
                            onClick={() => setFormData((p) => ({ ...p, secure: true }))}
                            className={`border p-4 text-left transition-colors ${
                                formData.secure
                                    ? "border-ok/60 bg-ok/10"
                                    : "border-line bg-ink-950 hover:border-ok/40"
                            }`}
                        >
                            <span className="font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                                TLS / SSL
                            </span>
                            <span className="mt-1 block font-display text-sm font-medium text-white">
                                wss:// + https://
                            </span>
                        </button>
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-dim">
                        Choose TLS if the node terminates HTTPS/WSS with a valid certificate,
                        usually on port 443.
                    </p>
                </Panel>

                <Panel className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 border-b border-line pb-4">
                        <User size={14} className="text-signal" />
                        <h2 className="font-display text-lg font-semibold text-white">
                            Operator
                        </h2>
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <Field
                            label="Display name"
                            htmlFor="authorId"
                            className="sm:col-span-2"
                            hint="Shown publicly on the node card."
                        >
                            <div className="relative">
                                <User
                                    size={14}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim"
                                />
                                <input
                                    id="authorId"
                                    name="authorId"
                                    required
                                    value={formData.authorId}
                                    onChange={handleChange}
                                    placeholder="your-name"
                                    className={inputClasses("pl-9")}
                                    autoComplete="off"
                                />
                            </div>
                        </Field>

                        <Field label="Website (optional)" htmlFor="website">
                            <input
                                id="website"
                                name="website"
                                type="url"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className={inputClasses()}
                                autoComplete="url"
                            />
                        </Field>

                        <Field label="Discord invite (optional)" htmlFor="discord">
                            <input
                                id="discord"
                                name="discord"
                                type="url"
                                value={formData.discord}
                                onChange={handleChange}
                                placeholder="https://discord.gg/..."
                                className={inputClasses()}
                                autoComplete="url"
                            />
                        </Field>
                    </div>
                </Panel>

                {error && (
                    <div
                        role="alert"
                        className="flex items-start gap-3 border border-bad/40 bg-bad/10 p-4 text-sm text-bad"
                    >
                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{error}</span>
                    </div>
                )}
            </div>

            <aside className="lg:col-span-4">
                <div className="sticky top-24 space-y-4">
                    <Panel className="p-5">
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                                Connection preview
                            </span>
                            <Badge tone={formData.secure ? "ok" : "dim"}>
                                {formData.secure ? "TLS" : "WS"}
                            </Badge>
                        </div>

                        <div className="mt-4 border border-line bg-ink-950 p-3 font-data text-[11px] leading-relaxed">
                            <div className="text-dim">// websocket</div>
                            <div className="mt-1 break-all text-white">{endpoint}</div>
                        </div>

                        <div className="mt-3 border border-line bg-ink-950 p-3 font-data text-[11px] leading-relaxed">
                            <div className="text-dim">// rest</div>
                            <div className="mt-1 break-all text-white">
                                {formData.secure ? "https" : "http"}://
                                {formData.host.trim() || "node.example.com"}:
                                {formData.port || "2333"}/{formData.restVersion}/stats
                            </div>
                        </div>

                        <ActionButton
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Submitting
                                </>
                            ) : (
                                <>
                                    Submit for review
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </ActionButton>
                    </Panel>

                    <Panel className="p-5">
                        <p className="font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                            Before you submit
                        </p>
                        <ul className="mt-3 space-y-2.5">
                            {[
                                "The node is publicly reachable.",
                                "The auth key is safe to publish.",
                                "You own the node or have permission.",
                                "The endpoint responds on /v4/stats or /v3/stats.",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center border border-ok/40 bg-ok/10 text-ok">
                                        <Check size={10} />
                                    </span>
                                    <span className="text-xs leading-relaxed text-dim">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </Panel>

                    <p className="px-1 text-xs leading-relaxed text-dim">
                        By submitting you agree to the{" "}
                        <Link href="/terms" className="text-white underline decoration-line underline-offset-4 hover:text-signal">
                            terms
                        </Link>{" "}
                        and confirm you can share these credentials publicly.
                    </p>
                </div>
            </aside>
        </form>
    );
}
