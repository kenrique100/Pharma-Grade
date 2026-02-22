import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "Pharma Grade - Premium Supplements & Steroids",
  description: "Lab tested, pharmaceutical grade supplements and anabolic steroids. Trusted worldwide.",
  icons: { icon: "/images/logo.webp" },
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
