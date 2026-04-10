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
    title: "Lavalink List — Free Public Lavalink Nodes",
    description: "A comprehensive list of free and public Lavalink nodes for Discord music bots.",
    icons: {
        icon: "/stackryze_logo_white.png",
        apple: "/stackryze_logo_white.png",
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