import { ClipboardCheck, Radio, Server, ShieldCheck, Terminal } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SubmitNodeForm } from "@/components/forms/SubmitNodeForm";
import { JsonLd } from "@/components/site/JsonLd";
import {
    Breadcrumbs,
    PageHeader,
    Section,
    SectionHeader,
} from "@/components/site/ui";
import { SITE } from "@/lib/site";
import {
    breadcrumbJsonLd,
    faqJsonLd,
    howToJsonLd,
    webPageJsonLd,
} from "@/lib/seo";

const title = "Submit a Lavalink node";
const description =
    "Add a free public Lavalink node to the directory. Sign in with Discord, provide the endpoint and auth key, and an administrator will review the node before it goes live.";

const STEPS = [
    {
        icon: Server,
        name: "Provide the endpoint",
        text: "Enter the public host, port, auth key, and REST version of your Lavalink node.",
    },
    {
        icon: ShieldCheck,
        name: "Pick the transport",
        text: "Mark the node as TLS if it serves HTTPS/WSS with a valid certificate.",
    },
    {
        icon: Radio,
        name: "Automatic probe",
        text: "The directory calls the node's stats endpoint and reads players, memory, load, and uptime.",
    },
    {
        icon: ClipboardCheck,
        name: "Manual review",
        text: "An administrator reviews the submission and approves or rejects it before it appears publicly.",
    },
];

const FAQS = [
    {
        question: "Who can submit a Lavalink node?",
        answer:
            "Anyone signed in with Discord who owns the node or has explicit permission from its operator. Submissions are tied to the signed-in account.",
    },
    {
        question: "Is the auth key published?",
        answer:
            "Yes. Public nodes in this directory expose their connection details, including the auth key, so bots can connect. Never submit a private or production-only key.",
    },
    {
        question: "How long does review take?",
        answer:
            "Review is manual. Most submissions are checked when an administrator is available; joining the community Discord is the fastest way to follow up.",
    },
    {
        question: "What if my node is rejected?",
        answer:
            "You will receive a reason when a rejection notification is sent. Fix the endpoint or credentials and submit again, or ask in Discord.",
    },
];

export const metadata = {
    title,
    description,
    alternates: { canonical: "/submit" },
    openGraph: { title, description, url: "/submit", type: "website" },
    twitter: { card: "summary_large_image", title, description },
};

export default function SubmitPage() {
    return (
        <div className="min-h-screen bg-ink-950 font-display text-white selection:bg-signal selection:text-ink-950">
            <Navbar />

            <main>
                <PageHeader
                    breadcrumbs={
                        <Breadcrumbs
                            items={[{ label: "Home", href: "/" }, { label: "Submit a node" }]}
                        />
                    }
                    eyebrow="Node submission"
                    title="Add your node to the grid."
                    description="Share a public Lavalink node with the community. Submissions are probed and reviewed before they appear in the directory."
                    icon={Terminal}
                    meta={[
                        { label: "Auth", value: "Discord" },
                        { label: "Review", value: "Manual" },
                        { label: "Cost", value: "Free" },
                        { label: "Indexed", value: "Live" },
                    ]}
                />

                <Section>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {STEPS.map((step, index) => (
                            <div key={step.name} className="border border-line bg-ink-900 p-5">
                                <div className="flex items-center justify-between">
                                    <span className="grid h-9 w-9 place-items-center border border-signal/30 bg-signal/10 text-signal">
                                        <step.icon size={16} />
                                    </span>
                                    <span className="font-data text-[10px] tracking-[0.14em] text-dim">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>
                                <h2 className="mt-4 font-display text-base font-semibold text-white">
                                    {step.name}
                                </h2>
                                <p className="mt-2 text-sm leading-relaxed text-dim">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section tone="raised">
                    <SectionHeader
                        eyebrow="Submission form"
                        title="Node details."
                        description="Everything except the optional links is required. The connection preview updates as you type."
                    />
                    <div className="mt-8">
                        <SubmitNodeForm />
                    </div>
                </Section>

                <Section>
                    <SectionHeader
                        eyebrow="Review"
                        title="What happens next."
                        description="A short, predictable review process keeps the directory useful."
                    />

                    <div className="mt-8 grid gap-4 lg:grid-cols-12">
                        <div className="border border-line bg-ink-900 p-6 lg:col-span-7">
                            <ol className="space-y-5">
                                {[
                                    "Your node is stored with a pending status.",
                                    "The directory probes the stats and info endpoints.",
                                    "An administrator checks reachability, transport, and credentials.",
                                    "Approved nodes appear in the live directory and the crawlable index.",
                                ].map((item, index) => (
                                    <li key={item} className="flex gap-4">
                                        <span className="grid h-7 w-7 shrink-0 place-items-center border border-line bg-ink-950 font-data text-[10px] text-signal">
                                            {index + 1}
                                        </span>
                                        <span className="text-sm leading-relaxed text-dim">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="border border-line bg-ink-900 p-6 lg:col-span-5">
                            <p className="font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                                Requirements
                            </p>
                            <ul className="mt-4 space-y-3">
                                {[
                                    "Publicly reachable hostname and port.",
                                    "Lavalink v3 or v4 REST API enabled.",
                                    "Auth key safe to publish.",
                                    "Permission from the node owner.",
                                    "Stable uptime if possible.",
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="border-b border-line/70 pb-3 text-sm leading-relaxed text-dim last:border-0 last:pb-0"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Section>

                <Section tone="raised">
                    <SectionHeader eyebrow="FAQ" title="Submission questions." />
                    <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
                        {FAQS.map((faq, index) => (
                            <div key={faq.question} className="border-t border-line pt-5">
                                <div className="flex items-baseline gap-3">
                                    <span className="font-data text-[10px] tracking-[0.14em] text-signal">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <h3 className="font-display text-base font-medium text-white">
                                        {faq.question}
                                    </h3>
                                </div>
                                <p className="mt-3 max-w-prose pl-7 text-sm leading-relaxed text-dim">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </Section>
            </main>

            <Footer />

            <JsonLd
                data={[
                    webPageJsonLd({ title, description, path: "/submit" }),
                    breadcrumbJsonLd([
                        { label: "Home", href: "/" },
                        { label: "Submit a node", href: "/submit" },
                    ]),
                    howToJsonLd({
                        name: `Submit a public Lavalink node to ${SITE.name}`,
                        description,
                        steps: STEPS.map((step) => ({ name: step.name, text: step.text })),
                    }),
                    faqJsonLd(FAQS),
                ]}
            />
        </div>
    );
}
