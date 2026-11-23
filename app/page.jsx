import { HomePageClient } from "@/components/landing/HomePageClient";
import { JsonLd } from "@/components/site/JsonLd";
import { getPublicNodeIndex, nodeIndexToSeoItems } from "@/lib/node-index";
import { FAQS, SITE } from "@/lib/site";
import {
    breadcrumbJsonLd,
    faqJsonLd,
    itemListJsonLd,
    webPageJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

const title = "Free public Lavalink nodes — live directory";
const description = SITE.description;

export const metadata = {
    title,
    description,
    alternates: {
        canonical: "/",
        types: { "application/json": "/api/nodes" },
    },
    openGraph: {
        title,
        description,
        url: "/",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
    },
};

export default async function HomePage() {
    const nodes = await getPublicNodeIndex();

    return (
        <>
            <JsonLd
                data={[
                    webPageJsonLd({ title, description, path: "/" }),
                    breadcrumbJsonLd([{ label: "Home", href: "/" }]),
                    itemListJsonLd({
                        name: "Approved public Lavalink nodes",
                        description:
                            "Live directory of free, community-hosted Lavalink nodes for Discord music bots.",
                        items: nodeIndexToSeoItems(nodes),
                    }),
                    faqJsonLd(FAQS),
                ]}
            />
            <HomePageClient nodeIndex={nodes} />
        </>
    );
}
