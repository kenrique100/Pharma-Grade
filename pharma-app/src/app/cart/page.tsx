"use client";

import { useCart } from "@/lib/cart";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const count = itemCount();
  const cartTotal = total();

  if (count === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Add some products to get started</p>
        <Link href="/products" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Shopping <span className="text-red-600">Cart</span></h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">💊</div>
              <div className="flex-1">
                <h3 className="text-gray-900 dark:text-white font-semibold">{item.name}</h3>
                <p className="text-red-600 dark:text-red-400 font-bold">${item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg flex items-center justify-center">-</button>
                <span className="text-gray-900 dark:text-white w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg flex items-center justify-center">+</button>
              </div>
              <div className="text-gray-900 dark:text-white font-bold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</div>
              <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors ml-2">✕</button>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-fit shadow-sm">
          <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Subtotal ({count} items)</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Shipping</span>
              <span className="text-green-600 dark:text-green-400">Free</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-gray-900 dark:text-white font-bold text-lg">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          <Link href="/checkout" className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors">Proceed to Checkout</Link>
          <Link href="/products" className="block w-full text-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white text-sm mt-3 py-2 transition-colors">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
