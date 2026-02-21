"use client";

import { useParams } from "next/navigation";
import { useAdminStore } from "@/lib/adminStore";
import { useCart } from "@/lib/cart";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const categoryEmoji: Record<string, string> = {
  "Strength": "💪",
  "Short Cycle": "⚡",
  "Sex": "❤️",
  "Post Cycle Therapy": "🛡️",
  "Insulin": "💉",
  "Injectable Steroids": "🔬",
  "HGH": "🧬",
  "Fat Loss": "🔥",
  "Bulking Steroids": "🏋️",
  "Bac Water": "💧",
  "Botox": "✨",
};

const IMAGE_URL_RE = /\.(jpg|jpeg|png|webp|gif)(\?|$)/i;

function isImageLicence(url: string) {
  return url.startsWith("data:image") || IMAGE_URL_RE.test(url);
}

export default function ProductPage() {
  const params = useParams();
  const { products } = useAdminStore();
  const product = products.find((p) => p.slug === (params.slug as string));
  const addItem = useCart((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showLicence, setShowLicence] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
        <Link href="/products" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">← Back to Products</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const emoji = categoryEmoji[product.category] ?? "💊";

  const renderLicence = () => {
    if (!product.licenceUrl) return null;
    if (isImageLicence(product.licenceUrl)) {
      return (
        <div className="mt-4">
          <Image src={product.licenceUrl} alt="Product Licence" width={600} height={400} className="rounded-xl border border-gray-200 dark:border-gray-700 max-w-full object-contain" unoptimized />
        </div>
      );
    }
    return (
      <div className="mt-4">
        <a href={product.licenceUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          📄 View / Download Licence
        </a>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link href="/products" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">← Back to Products</Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden h-96 border border-gray-200 dark:border-gray-700">
          {!imgError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">
              {emoji}
            </div>
          )}
        </div>
        <div>
          {product.badge && (
            <span className={`inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-3 ${
              product.badge === "Best Seller" ? "bg-red-600" :
              product.badge === "New" ? "bg-green-600" : "bg-orange-600"
            }`}>{product.badge}</span>
          )}
          <div className="text-red-600 dark:text-red-400 text-sm font-medium mb-2">{product.category}</div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">{product.name}</h1>
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex text-yellow-500">{"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}</div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">{product.rating} ({product.reviews} reviews)</span>
          </div>
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl font-black text-gray-900 dark:text-white">${product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-gray-400 text-xl line-through">${product.originalPrice}</span>
                <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 text-sm font-bold px-2 py-1 rounded">Save ${product.originalPrice - product.price}</span>
              </>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{product.description}</p>
          <div className="flex items-center space-x-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className={`text-sm ${product.inStock ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <button onClick={handleAddToCart} disabled={!product.inStock}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              added ? "bg-green-600 text-white" :
              product.inStock ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}>
            {added ? "✓ Added to Cart!" : product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
          <Link href="/cart" className="block w-full text-center py-4 rounded-xl font-bold text-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mt-3">
            View Cart
          </Link>

          {/* Product Licence Section */}
          {product.licenceUrl && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowLicence(!showLicence)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-gray-900 dark:text-white font-semibold text-sm">📋 Product Licence / Certificate</span>
                <span className="text-gray-400 text-xs">{showLicence ? "▲ Hide" : "▼ View"}</span>
              </button>
              {showLicence && renderLicence()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
