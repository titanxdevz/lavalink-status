import { ClipboardList } from "lucide-react";
import { LegalPage } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";

const title = "Terms of service";
const description =
    "The rules for using the Lavalink Grid directory, submitting nodes, and relying on community-hosted Lavalink endpoints.";

export const metadata = {
    title,
    description,
    alternates: { canonical: "/terms" },
    openGraph: { title, description, url: "/terms", type: "website" },
    twitter: { card: "summary", title, description },
};

const sections = [
    {
        id: "acceptance",
        number: "01",
        title: "Acceptance",
        content: [
            "By accessing Lavalink Grid, you agree to these terms. If you do not agree, do not use the directory or submit a node.",
        ],
    },
    {
        id: "directory-role",
        number: "02",
        title: "What this service is",
        content: [
            "Lavalink Grid is a directory. The nodes listed here are hosted by independent volunteers and sponsors, not by the directory.",
            "We verify that a node responded to a status probe at review time. We do not guarantee future uptime, performance, capacity, or security.",
        ],
    },
    {
        id: "acceptable-use",
        number: "03",
        title: "Acceptable use",
        content: ["You agree not to:"],
        list: [
            "Flood, DDoS, or intentionally overload listed nodes.",
            "Use nodes for illegal streaming or copyright infringement.",
            "Repackage node credentials behind a paywall.",
            "Scrape the directory in a way that degrades service for others.",
            "Submit nodes you do not own or have permission to share.",
        ],
    },
    {
        id: "submissions",
        number: "04",
        title: "Node submissions",
        content: [
            "By submitting a node, you confirm that you are the operator or have explicit permission to publish its credentials.",
            "You are responsible for keeping the submitted auth key accurate. We may remove any node at our discretion, including for abuse, downtime, or security concerns.",
        ],
    },
    {
        id: "availability",
        number: "05",
        title: "Availability and warranty",
        content: [
            'The directory and the JSON API are provided "as is" without warranties of any kind, express or implied.',
            "We may change, suspend, or discontinue any part of the service without notice.",
        ],
    },
    {
        id: "liability",
        number: "06",
        title: "Limitation of liability",
        content: [
            "To the maximum extent permitted by law, Lavalink Grid, its maintainers, and contributors are not liable for damages arising from the use of, or inability to use, listed nodes or the directory itself.",
        ],
    },
    {
        id: "changes",
        number: "07",
        title: "Changes",
        content: [
            "These terms may be updated as the directory evolves. The updated date on this page reflects the latest revision.",
        ],
    },
    {
        id: "contact",
        number: "08",
        title: "Contact",
        content: [
            "Questions about these terms can be raised in the community Discord.",
            `Community: ${SITE.discord}`,
        ],
    },
];

export default function TermsPage() {
    return (
        <LegalPage
            eyebrow="Legal"
            title={title}
            description="The rules for using the directory, submitting nodes, and relying on community-hosted endpoints."
            updated="November 2026"
            icon={ClipboardList}
            intro="These terms cover the website, the submission flow, and the public JSON API. Individual nodes may have their own operator policies."
            sections={sections}
            jsonLd={[
                webPageJsonLd({ title, description, path: "/terms" }),
                breadcrumbJsonLd([
                    { label: "Home", href: "/" },
                    { label: "Terms of service", href: "/terms" },
                ]),
            ]}
        />
    );
}
