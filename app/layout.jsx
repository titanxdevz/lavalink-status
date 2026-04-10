
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NodesProvider } from "@/contexts/NodesContext";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '700', '900']
});

export const metadata = {
  title: "Free Lavalink Nodes — Vexanode",
  description: "Free public Lavalink nodes for Discord music bots. Always online, always expanding. Powered by Vexanode.",
  keywords: ["free lavalink", "lavalink nodes", "discord music bot", "public lavalink", "vexanode lavalink"],
  metadataBase: new URL("https://lavalink.vexanode.cloud"),
  verification: {
    google: "ouRCE7TwOlmYzYZcQseFITvGq7okszK_7eqqvpERRJ0",
  },
  icons: {
    icon: "/stackryze_logo_white.png",
    apple: "/stackryze_logo_white.png",
  },
  openGraph: {
    title: "Free Lavalink Nodes — Vexanode",
    description: "Free public Lavalink nodes for Discord music bots. Always online, always expanding. Powered by Vexanode.",
    url: "https://lavalink.vexanode.cloud",
    siteName: "Vexanode Lavalink",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Free Lavalink Nodes — Vexanode",
    description: "Free public Lavalink nodes for Discord music bots. Powered by Vexanode.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${orbitron.variable} font-orbitron antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NodesProvider>
            {children}
          </NodesProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
