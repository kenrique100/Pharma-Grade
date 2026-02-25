import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Support — FAQ, Tickets & Live Chat",
  description:
    "Get help with your Pharma Grade order. Browse frequently asked questions, submit a support ticket, or chat live with our team — available 24/7.",
  keywords: [
    "pharma grade support",
    "contact pharma grade",
    "order help",
    "faq",
    "live chat support",
  ],
  openGraph: {
    title: "Customer Support | Pharma Grade",
    description:
      "24/7 support via FAQ, ticket system, and live chat. Average response time under 2 hours.",
  },
  alternates: { canonical: "/support" },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
