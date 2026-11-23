import { Shield } from "lucide-react";
import { LegalPage } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";

const title = "Privacy policy";
const description =
    "How Lavalink Grid handles node submissions, telemetry, local storage, and analytics. No tracking cookies and no audio interception.";

export const metadata = {
    title,
    description,
    alternates: { canonical: "/privacy" },
    openGraph: { title, description, url: "/privacy", type: "website" },
    twitter: { card: "summary", title, description },
};

const sections = [
    {
        id: "overview",
        number: "01",
        title: "Overview",
        content: [
            "Lavalink Grid is a public directory of community-hosted Lavalink nodes. This policy explains what information the site stores and how it is used.",
            "Using the directory does not require an account. Discord authentication is only required when you submit or manage a node.",
        ],
    },
    {
        id: "data",
        number: "02",
        title: "Data we store",
        content: [
            "For node submissions, the directory stores the following fields:",
        ],
        list: [
            "The public host and port of the node.",
            "The Lavalink auth key / password, because it must be published for bots to connect.",
            "The operator display name and optional website or Discord links.",
            "The Discord account id of the owner, so the submission can be managed.",
        ],
    },
    {
        id: "telemetry",
        number: "03",
        title: "Node telemetry",
        content: [
            "The directory periodically calls each node's Lavalink REST API to read player counts, heap memory, CPU load, uptime, and build information.",
            "The directory does not connect to your bot, intercept audio packets, read track metadata, or monitor connected guilds.",
        ],
    },
    {
        id: "storage",
        number: "04",
        title: "Local storage",
        content: [
            "The browser stores a short-lived cache of node status so repeat visits render quickly. The cache expires automatically and can be cleared at any time.",
            "No advertising cookies or third-party tracking pixels are used.",
        ],
    },
    {
        id: "analytics",
        number: "05",
        title: "Analytics",
        content: [
            "The site may use privacy-friendly, aggregate analytics to understand traffic and performance. These measurements are not used to build advertising profiles.",
        ],
    },
    {
        id: "contact",
        number: "06",
        title: "Contact",
        content: [
            "For privacy questions or removal requests, contact the team through the community Discord.",
            `Community: ${SITE.discord}`,
        ],
    },
];

export default function PrivacyPage() {
    return (
        <LegalPage
            eyebrow="Legal"
            title={title}
            description="What the directory stores, why it stores it, and what it deliberately does not collect."
            updated="November 2026"
            icon={Shield}
            intro="This policy applies to the public directory, the node submission flow, and the JSON API. It does not cover third-party nodes, which are operated independently."
            sections={sections}
            jsonLd={[
                webPageJsonLd({ title, description, path: "/privacy" }),
                breadcrumbJsonLd([
                    { label: "Home", href: "/" },
                    { label: "Privacy policy", href: "/privacy" },
                ]),
            ]}
        />
    );
}
