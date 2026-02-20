"use client";

import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory, categories } from "@/lib/products";
import Link from "next/link";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = getProductsByCategory(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link href="/products" className="text-gray-400 hover:text-white text-sm">← All Products</Link>
      </div>
      {category && (
        <div className="mb-8">
          <div className="text-5xl mb-4">{category.icon}</div>
          <h1 className="text-3xl font-black text-white mb-2">{category.name}</h1>
          <p className="text-gray-400">{category.description}</p>
        </div>
      )}
      {categoryProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No products found in this category.</p>
          <Link href="/products" className="text-red-400 hover:text-red-300 mt-4 block">Browse all products</Link>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-6">{categoryProducts.length} products</p>
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
