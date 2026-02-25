import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Testimonials & Reviews",
  description:
    "Read real reviews from thousands of verified Pharma Grade customers worldwide. Athletes and researchers share their honest experiences with our pharmaceutical grade products.",
  keywords: [
    "pharma grade reviews",
    "customer testimonials",
    "steroid reviews",
    "hgh reviews",
    "verified customer reviews",
  ],
  openGraph: {
    title: "Customer Testimonials & Reviews | Pharma Grade",
    description:
      "Real reviews from verified customers. Join thousands of satisfied athletes and researchers worldwide.",
  },
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
