import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products — Buy Pharmaceutical Grade Supplements Online",
  description:
    "Browse our full catalogue of lab-tested pharmaceutical grade steroids, HGH, peptides, fat-loss agents, and post-cycle therapy products. Worldwide discreet shipping.",
  keywords: [
    "buy steroids online",
    "pharmaceutical grade supplements",
    "lab tested steroids",
    "HGH for sale",
    "injectable steroids",
    "oral steroids",
    "fat burners",
    "PCT products",
  ],
  openGraph: {
    title: "All Products | Pharma Grade",
    description:
      "Lab-tested pharmaceutical grade supplements. Injectable steroids, HGH, peptides, fat-loss, and PCT — all in one place.",
  },
  alternates: { canonical: "/products" },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
