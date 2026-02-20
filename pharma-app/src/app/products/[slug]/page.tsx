"use client";

import { useParams } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { useCart } from "@/lib/cart";
import Link from "next/link";
import { useState } from "react";

export default function ProductPage() {
  const params = useParams();
  const product = getProductBySlug(params.slug as string);
  const addItem = useCart((state) => state.addItem);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
        <Link href="/products" className="text-red-400 hover:text-red-300">← Back to Products</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link href="/products" className="text-gray-400 hover:text-white text-sm">← Back to Products</Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-gray-800 rounded-2xl flex items-center justify-center h-96 text-8xl border border-gray-700">
          {product.category === "Orals" ? "💊" :
           product.category === "Injectables" ? "💉" :
           product.category === "Peptides" ? "🧬" :
           product.category === "PCT" ? "🛡️" :
           product.category === "Fat Loss" ? "🔥" : "❤️"}
        </div>
        <div>
          {product.badge && (
            <span className={`inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-3 ${
              product.badge === "Best Seller" ? "bg-red-600" :
              product.badge === "New" ? "bg-green-600" : "bg-orange-600"
            }`}>{product.badge}</span>
          )}
          <div className="text-red-400 text-sm font-medium mb-2">{product.category}</div>
          <h1 className="text-3xl font-black text-white mb-4">{product.name}</h1>
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex text-yellow-400">{"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}</div>
            <span className="text-gray-400 text-sm">{product.rating} ({product.reviews} reviews)</span>
          </div>
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl font-black text-white">${product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-gray-500 text-xl line-through">${product.originalPrice}</span>
                <span className="bg-green-900 text-green-400 text-sm font-bold px-2 py-1 rounded">Save ${product.originalPrice - product.price}</span>
              </>
            )}
          </div>
          <p className="text-gray-400 mb-8 leading-relaxed">{product.description}</p>
          <div className="flex items-center space-x-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className={`text-sm ${product.inStock ? "text-green-400" : "text-red-400"}`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <button onClick={handleAddToCart} disabled={!product.inStock}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              added ? "bg-green-600 text-white" :
              product.inStock ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}>
            {added ? "✓ Added to Cart!" : product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
          <Link href="/cart" className="block w-full text-center py-4 rounded-xl font-bold text-lg border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white transition-colors mt-3">
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
