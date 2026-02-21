"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminStore } from "@/lib/adminStore";
import { Category } from "@/types";
import toast from "react-hot-toast";

type FormState = { name: string; description: string; icon: string; color: string };
const emptyForm: FormState = { name: "", description: "", icon: "💊", color: "bg-red-600" };

const colorOptions = [
  { value: "bg-red-600", label: "Red" },
  { value: "bg-blue-600", label: "Blue" },
  { value: "bg-green-600", label: "Green" },
  { value: "bg-purple-600", label: "Purple" },
  { value: "bg-orange-600", label: "Orange" },
  { value: "bg-pink-600", label: "Pink" },
  { value: "bg-yellow-600", label: "Yellow" },
  { value: "bg-teal-600", label: "Teal" },
];

const iconOptions = ["💊", "💉", "🧬", "🛡️", "🔥", "❤️", "⚗️", "🏋️", "🩺", "💪", "🧪", "⚡"];

export default function AdminCategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const productCountForCategory = (name: string) =>
    products.filter((p) => p.category === name).length;

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };

  const openEdit = (c: Category) => {
    setEditing(c.slug);
    setForm({ name: c.name, description: c.description, icon: c.icon, color: c.color });
    setShowForm(true);
  };

  const handleDelete = (slug: string, name: string) => {
    if (productCountForCategory(name) > 0) {
      toast.error(`Cannot delete "${name}" — it has products assigned to it.`);
      return;
    }
    if (!confirm(`Delete category "${name}"?`)) return;
    deleteCategory(slug);
    toast.success(`Category "${name}" deleted.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateCategory(editing, form);
      toast.success(`Category updated!`);
    } else {
      addCategory(form);
      toast.success(`Category "${form.name}" added!`);
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const inputCls = "w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 text-sm";
  const labelCls = "block text-gray-700 dark:text-gray-300 text-xs font-medium mb-1";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Manage <span className="text-red-600">Categories</span></h1>
        <div className="flex gap-3">
          <Link href="/admin/products" className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">← Products</Link>
          <button onClick={openAdd} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">+ Add Category</button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 w-full max-w-md shadow-xl">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-5">{editing ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelCls}>Category Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} placeholder="e.g. SARMs" />
              </div>
              <div>
                <label className={labelCls}>Description *</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className={inputCls} placeholder="Short description" />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-xs font-medium mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((icon) => (
                    <button key={icon} type="button" onClick={() => setForm({ ...form, icon })}
                      className={`text-2xl p-2 rounded-lg transition-colors ${form.icon === icon ? "bg-red-600" : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-xs font-medium mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setForm({ ...form, color: opt.value })}
                      className={`w-8 h-8 rounded-lg ${opt.value} ${form.color === opt.value ? "ring-2 ring-gray-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-gray-800" : ""}`}
                      title={opt.label}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg text-sm">{editing ? "Update" : "Add Category"}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-2.5 rounded-lg text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = productCountForCategory(cat.name);
          return (
            <div key={cat.slug} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center text-xl`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-bold">{cat.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{count} product{count !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(cat)} className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 text-xs font-medium">Edit</button>
                  <button onClick={() => handleDelete(cat.slug, cat.name)} className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs font-medium">Delete</button>
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{cat.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <Link href={`/categories/${cat.slug}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium">View Page →</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
