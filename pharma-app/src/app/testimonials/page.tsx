"use client";

import { useState } from "react";
import { useTestimonialsStore } from "@/lib/testimonials";
import { useUser } from "@/hooks/use-user";
import toast from "react-hot-toast";

export default function TestimonialsPage() {
  const { testimonials, addTestimony } = useTestimonialsStore();
  const { user } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, text: "", product: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.text || !form.product) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    addTestimony({ name: form.name, avatar: user?.image ?? "", rating: form.rating, text: form.text, product: form.product });
    toast.success("Thank you for your review!");
    setForm({ name: "", rating: 5, text: "", product: "" });
    setShowForm(false);
    setSubmitting(false);
  };

  const inputCls = "w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors";

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-950 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Customer <span className="text-red-600">Testimonials</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-6">
          Real reviews from our valued customers worldwide. Join thousands of satisfied athletes and researchers.
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          {showForm ? "Cancel" : "✍️ Write a Review"}
        </button>
      </section>

      {/* Submission Form */}
      {showForm && (
        <section className="py-10 px-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 text-center">Share Your Experience</h2>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Your Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} placeholder="e.g. John D." />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Product *</label>
                <input type="text" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} required className={inputCls} placeholder="e.g. Testosterone Enanthate 250" />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className={`text-2xl transition-transform hover:scale-110 ${star <= form.rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Your Review *</label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  required
                  rows={4}
                  className={inputCls}
                  placeholder="Share your experience with this product..."
                />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 rounded-lg transition-colors">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Testimonials Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonials.length} reviews</p>
            <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
              ★★★★★ <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">4.9 average</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-red-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {t.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      t.name[0]
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-semibold">{t.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{t.date}</p>
                  </div>
                </div>
                <div className="flex text-yellow-500 text-sm mb-3">
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm flex-1 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-red-600 dark:text-red-400 text-xs font-medium">📦 {t.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
