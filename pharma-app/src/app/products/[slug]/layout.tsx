import type { Metadata } from "next";
import { products } from "@/lib/products";

const SITE_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "https://pharmagrade.com";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) {
    return { title: "Product Not Found" };
  }

  const imageUrl = product.image.startsWith("/")
    ? `${SITE_URL}${product.image}`
    : product.image;

  return {
    title: `${product.name} — Buy Online`,
    description: product.description,
    keywords: [
      product.name,
      product.category,
      "buy online",
      "pharmaceutical grade",
      "lab tested",
      product.dosePerUnit ?? "",
    ].filter(Boolean),
    openGraph: {
      title: `${product.name} | Pharma Grade`,
      description: product.description,
      url: `${SITE_URL}/products/${product.slug}`,
      images: [{ url: imageUrl, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Pharma Grade`,
      description: product.description,
      images: [imageUrl],
    },
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default function ProductSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return <>{children}</>;
  }

  const imageUrl = product.image.startsWith("/")
    ? `${SITE_URL}${product.image}`
    : product.image;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: imageUrl,
    brand: { "@type": "Brand", name: "Pharma Grade" },
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${product.slug}`,
      seller: { "@type": "Organization", name: "Pharma Grade" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {children}
    </>
  );
}
