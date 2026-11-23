import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NodesProvider } from "@/contexts/NodesContext";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { Orbitron, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { JsonLd } from "@/components/site/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE, SITE_KEYWORDS } from "@/lib/site";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-data",
  weight: ["400", "500", "600", "700"],
});

const defaultTitle = "Free public Lavalink nodes — live directory";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: defaultTitle,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  generator: "Next.js",
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "technology",
  classification: "Lavalink node directory",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
    types: {
      "application/json": "/api/nodes",
      "text/plain": "/llms.txt",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: "ouRCE7TwOlmYzYZcQseFITvGq7okszK_7eqqvpERRJ0",
  },
  icons: {
    icon: [{ url: "/stackryze_logo_white.png", type: "image/png" }],
    apple: [{ url: "/stackryze_logo_white.png", type: "image/png" }],
    shortcut: "/stackryze_logo_white.png",
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: "/",
    siteName: SITE.name,
    title: defaultTitle,
    description: SITE.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: SITE.description,
    images: ["/opengraph-image"],
  },
  other: {
    "format-detection": "telephone=no",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: SITE.themeColor,
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-display antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProviderWrapper>
            <NodesProvider>
              <AnnouncementBanner />
              {children}
            </NodesProvider>
          </SessionProviderWrapper>
          <Analytics />
        </ThemeProvider>
        <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      </body>
    </html>
  );
}
