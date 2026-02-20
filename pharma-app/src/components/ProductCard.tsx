"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-red-600 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20">
        <div className="relative h-48 bg-gray-900 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-gray-800 to-gray-900">
            {product.category === "Orals" ? "💊" :
             product.category === "Injectables" ? "💉" :
             product.category === "Peptides" ? "🧬" :
             product.category === "PCT" ? "🛡️" :
             product.category === "Fat Loss" ? "🔥" : "❤️"}
          </div>
          {product.badge && (
            <span className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded ${
              product.badge === "Best Seller" ? "bg-red-600" :
              product.badge === "New" ? "bg-green-600" : "bg-orange-600"
            }`}>
              {product.badge}
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="text-xs text-red-400 font-medium mb-1">{product.category}</div>
          <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-red-400 transition-colors line-clamp-2">{product.name}</h3>
          <div className="flex items-center space-x-1 mb-3">
            <div className="flex text-yellow-400 text-xs">
              {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-gray-400 text-xs">({product.reviews})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white font-bold text-lg">${product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-500 text-sm line-through ml-2">${product.originalPrice}</span>
              )}
            </div>
            <button onClick={handleAddToCart} className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
