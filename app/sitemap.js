export default function sitemap() {
  return [
    {
      url: "https://lavalink.vexanode.cloud",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://lavalink.vexanode.cloud/ssl",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://lavalink.vexanode.cloud/non-ssl",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://lavalink.vexanode.cloud/submit",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
