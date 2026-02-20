import { products } from "@/lib/products";
import Link from "next/link";

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Manage <span className="text-red-600">Products</span></h1>
        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">+ Add Product</button>
      </div>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-sm">
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Rating</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-700/50 text-sm">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-xl">
                        {product.category === "Orals" ? "💊" : product.category === "Injectables" ? "💉" :
                         product.category === "Peptides" ? "🧬" : product.category === "PCT" ? "🛡️" :
                         product.category === "Fat Loss" ? "🔥" : "❤️"}
                      </div>
                      <div>
                        <div className="text-white font-medium">{product.name}</div>
                        {product.badge && <span className="text-xs text-red-400">{product.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{product.category}</td>
                  <td className="p-4 text-green-400 font-semibold">${product.price}</td>
                  <td className="p-4 text-yellow-400">★ {product.rating}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.inStock ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link href={`/products/${product.slug}`} className="text-blue-400 hover:text-blue-300 text-xs font-medium">View</Link>
                      <button className="text-yellow-400 hover:text-yellow-300 text-xs font-medium">Edit</button>
                      <button className="text-red-400 hover:text-red-300 text-xs font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
