"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";

export default function CheckoutPage() {
  const { items, total, clearCart, itemCount } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", address: "",
    city: "", country: "US", zip: "", cardNumber: "", expiry: "", cvv: "",
  });

  const count = itemCount();
  const cartTotal = total();

  if (count === 0 && !submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Cart is empty</h1>
        <a href="/products" className="text-red-400 hover:text-red-300">Browse Products</a>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-white mb-4">Order Placed!</h1>
        <p className="text-gray-400 mb-8">Thank you for your order. You will receive a confirmation email shortly.</p>
        <a href="/products" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">Continue Shopping</a>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      clearCart();
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black text-white mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-white font-bold text-lg mb-4">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">First Name</label>
                <input type="text" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Last Name</label>
                <input type="text" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-300 text-sm mb-1">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
            </div>
            <div className="mt-4">
              <label className="block text-gray-300 text-sm mb-1">Address</label>
              <input type="text" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="col-span-2">
                <label className="block text-gray-300 text-sm mb-1">City</label>
                <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">ZIP</label>
                <input type="text" required value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-white font-bold text-lg mb-4">Payment Information</h2>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Card Number</label>
              <input type="text" required placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Expiry</label>
                <input type="text" required placeholder="MM/YY" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">CVV</label>
                <input type="text" required placeholder="123" value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white font-bold py-4 rounded-xl text-lg transition-colors">
            {loading ? "Processing..." : `Place Order - $${cartTotal.toFixed(2)}`}
          </button>
        </form>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-fit">
          <h2 className="text-white font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-400 text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 pt-3 flex justify-between text-white font-bold text-lg">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
