export const SITE = {
    name: "Lavalink Grid",
    shortName: "Lavalink",
    url: "https://lavalink.vexanode.cloud",
    description:
        "A community-run directory of free public Lavalink nodes for Discord music bots. Live health checks, TLS and non-TLS endpoints, and copy-ready connection details.",
    tagline: "Free public Lavalink nodes, verified live.",
    discord: "https://discord.vexanode.cloud",
    github: "https://github.com/stackryze/lavalink-list",
    locale: "en_US",
    themeColor: "#07090c",
    backgroundColor: "#07090c",
    logo: "/stackryze_logo_white.png",
};

export const SITE_KEYWORDS = [
    "free lavalink",
    "lavalink nodes",
    "public lavalink",
    "lavalink server list",
    "discord music bot",
    "discord lavalink",
    "shoukaku node",
    "wavelink node",
    "lavalink v4",
    "lavalink v3",
    "free music bot hosting",
];

export const PUBLIC_PATHS = [
    { path: "/", label: "Node directory", priority: 1, changeFrequency: "hourly" },
    { path: "/ssl", label: "SSL Lavalink nodes", priority: 0.9, changeFrequency: "hourly" },
    { path: "/non-ssl", label: "Non-SSL Lavalink nodes", priority: 0.9, changeFrequency: "hourly" },
    { path: "/leaderboard", label: "Operator leaderboard", priority: 0.7, changeFrequency: "daily" },
    { path: "/submit", label: "Submit a node", priority: 0.7, changeFrequency: "monthly" },
    { path: "/privacy", label: "Privacy policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", label: "Terms of service", priority: 0.3, changeFrequency: "yearly" },
];

export const FAQS = [
    {
        question: "Are these Lavalink nodes free to use?",
        answer:
            "Yes. Every approved node is hosted by a volunteer or sponsor and can be used by any Discord bot without an account or payment.",
    },
    {
        question: "How often is node health checked?",
        answer:
            "The directory probes each node's Lavalink REST API when the directory loads and refreshes the client every two minutes. A node that fails the probe is marked offline.",
    },
    {
        question: "Which Lavalink versions are supported?",
        answer:
            "Most nodes run Lavalink v4 and some still expose v3. The REST version is shown on every node card and included in the copy-ready connection block.",
    },
    {
        question: "Should I use an SSL node or a non-SSL node?",
        answer:
            "Use a TLS node (WSS/HTTPS) whenever your bot connects over a public network. Non-TLS nodes are fine for local testing or trusted private networks.",
    },
    {
        question: "Can I run a large bot on public nodes?",
        answer:
            "Public nodes are shared. For bots in thousands of servers, self-host a node or configure failover across several nodes instead of relying on one endpoint.",
    },
    {
        question: "How do I get my node listed?",
        answer:
            "Sign in with Discord, open the submit page, and provide the host, port, auth key, and REST version. Submissions are reviewed manually before they appear in the directory.",
    },
    {
        question: "How do I report a broken or abusive node?",
        answer:
            "Open a ticket in the community Discord with the node identifier and what you observed. Reported nodes are reviewed and removed when necessary.",
    },
];
