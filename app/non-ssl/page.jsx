import { Server } from "lucide-react";
import { NodesPageClient } from "@/components/nodes/NodesPageClient";
import { JsonLd } from "@/components/site/JsonLd";
import { getPublicNodeIndex, nodeIndexToSeoItems } from "@/lib/node-index";
import { SITE } from "@/lib/site";
import {
    breadcrumbJsonLd,
    faqJsonLd,
    itemListJsonLd,
    webPageJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

const title = "Non-SSL Lavalink nodes — free WS/HTTP directory";
const description =
    "Browse free public non-SSL Lavalink nodes with live health, players, load, and uptime. Copy a ready WS/HTTP connection block for local or trusted-network bots.";

const FAQS = [
    {
        question: "What is a non-SSL Lavalink node?",
        answer:
            "A non-SSL node exposes plain HTTP for REST and WS for the WebSocket. Traffic is not encrypted by the node itself and typically runs on a custom port such as 2333.",
    },
    {
        question: "When is plain WS acceptable?",
        answer:
            "Plain WS is fine for local development, private networks, or when a trusted reverse proxy terminates TLS in front of Lavalink.",
    },
    {
        question: "Can I switch a node from WS to WSS?",
        answer:
            "Most wrappers expose a secure flag or accept a wss:// URL. If the node supports TLS, you can switch without changing the rest of your config.",
    },
    {
        question: "Are non-SSL nodes less reliable?",
        answer:
            "Reliability depends on the operator, not the transport. Check live status, load, and uptime on each card before connecting.",
    },
];

export const metadata = {
    title,
    description,
    alternates: { canonical: "/non-ssl", types: { "application/json": "/api/nodes" } },
    openGraph: { title, description, url: "/non-ssl", type: "website" },
    twitter: { card: "summary_large_image", title, description },
};

export default async function NonSSLNodesPage() {
    const nodes = await getPublicNodeIndex({ secure: false });

    return (
        <>
            <JsonLd
                data={[
                    webPageJsonLd({
                        title,
                        description,
                        path: "/non-ssl",
                        type: "CollectionPage",
                    }),
                    breadcrumbJsonLd([
                        { label: "Home", href: "/" },
                        { label: "Non-SSL nodes", href: "/non-ssl" },
                    ]),
                    itemListJsonLd({
                        name: "Non-SSL Lavalink nodes",
                        description: `Free public plain-WS Lavalink nodes from ${SITE.name}.`,
                        items: nodeIndexToSeoItems(nodes),
                    }),
                    faqJsonLd(FAQS),
                ]}
            />
            <NodesPageClient
                secure={false}
                eyebrow="WS / HTTP directory"
                title="Non-SSL Lavalink nodes"
                description="Free public nodes using plain WebSocket transport, live telemetry, and copy-ready connection details."
                icon={Server}
                nodeIndex={nodes}
                indexTitle="Non-SSL node registry"
                indexDescription="Every approved plain-WS node with its endpoint, region, protocol version, and operator."
            />
        </>
    );
}
