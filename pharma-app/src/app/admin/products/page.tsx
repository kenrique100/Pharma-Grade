"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAdminStore, AdminProduct, PromotionType } from "@/lib/adminStore";
import toast from "react-hot-toast";

const EMOJI_MAP: Record<string, string> = {
  Orals: "💊", Injectables: "💉", Peptides: "🧬", PCT: "🛡️", "Fat Loss": "🔥", "Sexual Health": "❤️",
};

type FormState = {
  name: string; description: string; price: string; originalPrice: string;
  category: string; inStock: boolean; badge: string;
  promotionType: PromotionType; promotionValue: string; image: string;
  licenceUrl: string;
};

const emptyForm: FormState = {
  name: "", description: "", price: "", originalPrice: "", category: "Orals",
  inStock: true, badge: "", promotionType: "none", promotionValue: "", image: "",
  licenceUrl: "",
};

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [search, setSearch] = useState("");
  const licenceInputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };

  const openEdit = (p: AdminProduct) => {
    setEditing(p.id);
    setForm({
      name: p.name, description: p.description, price: String(p.price),
      originalPrice: String(p.originalPrice || ""), category: p.category,
      inStock: p.inStock, badge: p.badge || "",
      promotionType: p.promotionType || "none",
      promotionValue: String(p.promotionValue || ""), image: p.image,
      licenceUrl: p.licenceUrl || "",
    });
    setShowForm(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    deleteProduct(id);
    toast.success(`${name} deleted.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Omit<AdminProduct, "id" | "slug"> = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      category: form.category,
      inStock: form.inStock,
      badge: (form.badge as AdminProduct["badge"]) || undefined,
      promotionType: form.promotionType,
      promotionValue: form.promotionValue ? parseFloat(form.promotionValue) : 0,
      image: form.image || `/images/products/placeholder.webp`,
      licenceUrl: form.licenceUrl || undefined,
      rating: 4.5,
      reviews: 0,
    };
    if (editing) {
      updateProduct(editing, data);
      toast.success(`${form.name} updated!`);
    } else {
      addProduct(data);
      toast.success(`${form.name} added!`);
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditing(null);
  };

  const handleLicenceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, licenceUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showForm) { setShowForm(false); setEditing(null); }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showForm]);

  const inputCls = "w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 text-sm";
  const labelCls = "block text-gray-700 dark:text-gray-300 text-xs font-medium mb-1";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Manage <span className="text-red-600">Products</span></h1>
        <div className="flex flex-wrap gap-3">
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 w-full sm:w-48"
          />
          <button onClick={openAdd} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">+ Add Product</button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 w-full max-w-2xl my-8 shadow-xl">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-5">{editing ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className={labelCls}>Product Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} placeholder="e.g. Testosterone Enanthate 250" />
                </div>
                <div>
                  <label className={labelCls}>Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                    {categories.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Badge</label>
                  <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className={inputCls}>
                    <option value="">None</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="New">New</option>
                    <option value="Sale">Sale</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Price (USD) *</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className={inputCls} placeholder="0.00" />
                </div>
                <div>
                  <label className={labelCls}>Original Price (if on sale)</label>
                  <input type="number" min="0" step="0.01" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className={inputCls} placeholder="0.00" />
                </div>
                <div>
                  <label className={labelCls}>Promotion Type</label>
                  <select value={form.promotionType} onChange={(e) => setForm({ ...form, promotionType: e.target.value as PromotionType })} className={inputCls}>
                    <option value="none">None</option>
                    <option value="percentage">Percentage Off (%)</option>
                    <option value="fixed">Fixed Amount Off ($)</option>
                    <option value="bogo">Buy One Get One</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Promotion Value</label>
                  <input type="number" min="0" step="0.01" value={form.promotionValue} onChange={(e) => setForm({ ...form, promotionValue: e.target.value })}
                    disabled={form.promotionType === "none" || form.promotionType === "bogo"}
                    className={inputCls + " disabled:opacity-50"} placeholder={form.promotionType === "percentage" ? "e.g. 15" : "e.g. 10"} />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className={labelCls}>Product Image URL</label>
                  <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} placeholder="/images/products/product-name.webp" />
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Use /images/products/filename.webp for uploaded images, or an external URL.</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className={labelCls}>Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className={inputCls} placeholder="Detailed product description..." />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className={labelCls}>Product Licence (optional)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={form.licenceUrl.startsWith("data:") ? "" : form.licenceUrl}
                      onChange={(e) => setForm({ ...form, licenceUrl: e.target.value })}
                      className={inputCls}
                      placeholder="Paste licence URL, or upload a file below"
                    />
                    <button type="button" onClick={() => licenceInputRef.current?.click()}
                      className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap">
                      📎 Upload
                    </button>
                  </div>
                  <input ref={licenceInputRef} type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleLicenceFile} />
                  {form.licenceUrl && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-green-600 dark:text-green-400">
                        {form.licenceUrl.startsWith("data:image") ? "🖼️ Image uploaded" :
                         form.licenceUrl.startsWith("data:") ? "📄 File uploaded" : "🔗 URL set"}
                      </span>
                      <button type="button" onClick={() => setForm({ ...form, licenceUrl: "" })} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                    </div>
                  )}
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Accepted: images, PDF, Word docs. Users can view this on the product page.</p>
                </div>
                <div className="col-span-1 sm:col-span-2 flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{form.inStock ? "In Stock" : "Out of Stock"}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-colors text-sm">{editing ? "Update Product" : "Add Product"}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-2.5 rounded-lg transition-colors text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400 text-sm">{filtered.length} products</span>
          <Link href="/admin/categories" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium">Manage Categories →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs">
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Promo</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700/50 text-sm hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {EMOJI_MAP[product.category] || "📦"}
                      </div>
                      <div>
                        <div className="text-gray-900 dark:text-white font-medium text-sm">{product.name}</div>
                        {product.badge && <span className="text-xs text-red-600 dark:text-red-400">{product.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{product.category}</td>
                  <td className="p-4">
                    <div className="text-green-600 dark:text-green-400 font-semibold">${product.price}</div>
                    {product.originalPrice && <div className="text-gray-400 text-xs line-through">${product.originalPrice}</div>}
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-xs">
                    {product.promotionType !== "none" ? (
                      <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                        {product.promotionType === "percentage" ? `${product.promotionValue}% off` :
                         product.promotionType === "fixed" ? `$${product.promotionValue} off` : "BOGO"}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.inStock ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400"}`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link href={`/products/${product.slug}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium">View</Link>
                      <button onClick={() => openEdit(product)} className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 text-xs font-medium">Edit</button>
                      <button onClick={() => handleDelete(product.id, product.name)} className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs font-medium">Delete</button>
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
