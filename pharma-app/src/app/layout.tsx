import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import CookieBanner from "@/components/CookieBanner";

const SITE_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "https://pharmagrade.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pharma Grade — Premium Pharmaceutical Grade Supplements",
    template: "%s | Pharma Grade",
  },
  description:
    "Buy lab-tested, pharmaceutical grade steroids, HGH, peptides, and supplements. 99% purity guaranteed. Worldwide discreet shipping. Crypto payments accepted.",
  keywords: [
    "pharmaceutical grade",
    "anabolic steroids",
    "buy steroids online",
    "HGH",
    "peptides",
    "testosterone",
    "lab tested supplements",
    "pharma grade",
    "performance compounds",
    "injectable steroids",
    "fat loss",
    "bulking steroids",
    "post cycle therapy",
  ],
  authors: [{ name: "Pharma Grade", url: SITE_URL }],
  creator: "Pharma Grade",
  publisher: "Pharma Grade",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Pharma Grade",
    title: "Pharma Grade — Premium Pharmaceutical Grade Supplements",
    description:
      "Buy lab-tested, pharmaceutical grade steroids, HGH, peptides, and supplements. 99% purity guaranteed. Worldwide discreet shipping.",
    images: [
      {
        url: "/images/logo.webp",
        width: 800,
        height: 800,
        alt: "Pharma Grade Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pharma Grade — Premium Pharmaceutical Grade Supplements",
    description:
      "Buy lab-tested, pharmaceutical grade steroids, HGH, peptides, and supplements. 99% purity guaranteed.",
    images: ["/images/logo.webp"],
  },
  icons: {
    icon: "/images/logo.webp",
    shortcut: "/images/logo.webp",
    apple: "/images/logo.webp",
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen flex flex-col font-sans transition-colors duration-200">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
