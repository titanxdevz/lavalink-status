import { FAQS, PUBLIC_PATHS, SITE } from "@/lib/site";

export const revalidate = 3600;

function pageLine(entry) {
    const url = `${SITE.url}${entry.path === "/" ? "" : entry.path}`;
    return `- [${entry.label}](${url})`;
}

export function GET() {
    const body = `# ${SITE.name}

> ${SITE.description}

Canonical site: ${SITE.url}
Primary language: English (en)
Last generated: ${new Date().toISOString()}

## What this site is

${SITE.name} is a community-run directory of free, public Lavalink nodes for Discord
music bots. Every approved node exposes a Lavalink REST API and WebSocket endpoint.
The directory probes each node and publishes players, memory, CPU load, uptime,
transport (TLS or plain WS), and REST version.

No account is required to browse or connect. Discord authentication is only needed
to submit a node or manage an existing submission.

## Pages

${PUBLIC_PATHS.map(pageLine).join("\n")}

## JSON API

- GET ${SITE.url}/api/nodes
  Returns an array of approved nodes with live telemetry. Never requires auth.
- GET ${SITE.url}/api/nodes?all=true
  Returns pending and rejected nodes too. Intended for administrators.
- GET ${SITE.url}/api/leaderboard
  Returns operators ranked by approved node count.
- GET ${SITE.url}/api/users/{id}
  Returns a public operator profile and their approved nodes.

### Node object

Each node includes:

- identifier: human-readable node name
- host: public hostname
- port: TCP port
- password: Lavalink auth key (published intentionally)
- secure: true for WSS/HTTPS, false for WS/HTTP
- restVersion: "v3" or "v4"
- region: operator-reported region, when present
- ownerId: operator account id
- authorId: operator display name
- isConnected: result of the latest health probe
- memory, cpu, systemLoad, connections, uptime, uptimeMillis, latencyMs: live telemetry

## Connection example

\`\`\`json
{
  "identifier": "example-node",
  "password": "youshallnotpass",
  "host": "node.example.com",
  "port": 443,
  "secure": true
}
\`\`\`

Use the same values with Shoukaku, Wavelink, Magma, or any Lavalink client.

## FAQ

${FAQS.map((faq) => `### ${faq.question}\n\n${faq.answer}`).join("\n\n")}

## Machine-readable resources

- Sitemap: ${SITE.url}/sitemap.xml
- Robots: ${SITE.url}/robots.txt
- Manifest: ${SITE.url}/manifest.webmanifest
- Open Graph image: ${SITE.url}/opengraph-image

## Notes for AI agents and crawlers

- Node names, regions, transports, endpoints, and operators are rendered in the
  initial HTML on the directory pages, so no JavaScript execution is required to
  read the registry.
- Live telemetry (players, load, memory, uptime) is refreshed by client-side probes;
  use the JSON API for current values.
- Auth keys in this directory are public by design. Do not treat them as secrets.
- Prefer linking to canonical pages rather than mirroring node credentials.
- The admin area is not public and is excluded in robots.txt.
`;

    return new Response(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}
