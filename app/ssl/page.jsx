import { Shield } from "lucide-react";
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

const title = "SSL Lavalink nodes — free WSS/HTTPS directory";
const description =
    "Browse free public SSL Lavalink nodes with live health, players, load, and uptime. Copy a ready WSS/HTTPS connection block for Shoukaku, Wavelink, or JDA.";

const FAQS = [
    {
        question: "What is an SSL Lavalink node?",
        answer:
            "An SSL Lavalink node exposes its REST API over HTTPS and its WebSocket over WSS. The transport is encrypted with TLS and usually runs on port 443.",
    },
    {
        question: "Why should a Discord bot use WSS?",
        answer:
            "WSS encrypts the auth key and control traffic between your bot and the node, which prevents packet sniffing and man-in-the-middle attacks on public networks.",
    },
    {
        question: "Do SSL nodes add latency?",
        answer:
            "TLS adds a small handshake cost when the connection is established. Continuous audio streaming and playback are not meaningfully affected.",
    },
    {
        question: "Can I use an IP address with an SSL node?",
        answer:
            "Certificates are bound to hostnames, so use the domain shown in the directory rather than a resolved IP address.",
    },
];

export const metadata = {
    title,
    description,
    alternates: { canonical: "/ssl", types: { "application/json": "/api/nodes" } },
    openGraph: { title, description, url: "/ssl", type: "website" },
    twitter: { card: "summary_large_image", title, description },
};

export default async function SSLNodesPage() {
    const nodes = await getPublicNodeIndex({ secure: true });

    return (
        <>
            <JsonLd
                data={[
                    webPageJsonLd({ title, description, path: "/ssl", type: "CollectionPage" }),
                    breadcrumbJsonLd([
                        { label: "Home", href: "/" },
                        { label: "SSL nodes", href: "/ssl" },
                    ]),
                    itemListJsonLd({
                        name: "SSL Lavalink nodes",
                        description: `Free public TLS Lavalink nodes from ${SITE.name}.`,
                        items: nodeIndexToSeoItems(nodes),
                    }),
                    faqJsonLd(FAQS),
                ]}
            />
            <NodesPageClient
                secure
                eyebrow="TLS / WSS directory"
                title="SSL Lavalink nodes"
                description="Free public nodes with encrypted WSS/HTTPS transport, live telemetry, and copy-ready connection details."
                icon={Shield}
                nodeIndex={nodes}
                indexTitle="SSL node registry"
                indexDescription="Every approved TLS node with its endpoint, region, protocol version, and operator."
            />
        </>
    );
}
