import type { Metadata } from "next";
import { categories, products } from "@/lib/products";

const SITE_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "https://pharmagrade.com";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) {
    return { title: "Category Not Found" };
  }

  const count = products.filter((p) => p.category === category.name).length;

  return {
    title: `${category.name} — ${category.description}`,
    description: `Buy pharmaceutical grade ${category.name.toLowerCase()} products online. ${count} products available. Lab-tested, 99% purity guaranteed. Worldwide discreet shipping.`,
    keywords: [
      category.name,
      `buy ${category.name.toLowerCase()} online`,
      "pharmaceutical grade",
      "lab tested",
      category.description,
    ],
    openGraph: {
      title: `${category.name} | Pharma Grade`,
      description: `${count} pharmaceutical grade ${category.name.toLowerCase()} products. ${category.description}.`,
      url: `${SITE_URL}/categories/${category.slug}`,
    },
    alternates: { canonical: `/categories/${category.slug}` },
  };
}

export default function CategorySlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
