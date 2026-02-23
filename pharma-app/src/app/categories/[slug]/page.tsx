"use client";

import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useAdminStore } from "@/lib/adminStore";
import Link from "next/link";
import Image from "next/image";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { products, categories } = useAdminStore();
  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = category
    ? products.filter((p) => p.category === category.name)
    : products.filter(
        (p) =>
          p.category.toLowerCase() === slug ||
          p.category.toLowerCase().replace(/\s+/g, "-") === slug
      );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link href="/products" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">← All Products</Link>
      </div>
      {category && (
        <div className="mb-8 flex items-center gap-4">
          {category.image ? (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
              <Image src={category.image} alt={category.name} fill className="object-cover" priority />
            </div>
          ) : (
            <div className="text-5xl">{category.icon}</div>
          )}
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{category.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{category.description}</p>
          </div>
        </div>
      )}
      {categoryProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No products found in this category.</p>
          <Link href="/products" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mt-4 block">Browse all products</Link>
        </div>
      ) : (
        <>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{categoryProducts.length} products</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
