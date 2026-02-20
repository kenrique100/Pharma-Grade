"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import toast from "react-hot-toast";

const CRYPTO_ADDRESSES = {
  BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ETH: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  USDC: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  LTC: "LYQAfYFmfkCFV9PVTiVCXuWQ1oPGBjJkzE",
};

type CryptoType = keyof typeof CRYPTO_ADDRESSES;

export default function CheckoutPage() {
  const { items, total, clearCart, itemCount } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>("BTC");
  const [txHash, setTxHash] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", address: "", city: "", country: "US", zip: "",
  });

  const count = itemCount();
  const cartTotal = total();

  const copyAddress = () => {
    navigator.clipboard.writeText(CRYPTO_ADDRESSES[selectedCrypto]);
    toast.success("Wallet address copied!");
  };

  if (count === 0 && !submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cart is empty</h1>
        <a href="/products" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">Browse Products</a>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Submitted!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">Your payment is being verified on the blockchain.</p>
        <p className="text-gray-500 dark:text-gray-400 mb-8">You will receive a confirmation email once confirmed (typically 10-30 min).</p>
        <a href="/products" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">Continue Shopping</a>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash.trim()) {
      toast.error("Please enter your transaction hash.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      clearCart();
      setSubmitted(true);
      setLoading(false);
      toast.success("Order submitted! Awaiting blockchain confirmation.");
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipping */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">First Name</label>
                <input type="text" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">Last Name</label>
                <input type="text" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
            </div>
            <div className="mt-4">
              <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">Address</label>
              <input type="text" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="col-span-2">
                <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">City</label>
                <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">ZIP</label>
                <input type="text" required value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
              </div>
            </div>
          </div>

          {/* Crypto Payment */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-1">Crypto Payment</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">We accept cryptocurrency payments only for privacy and security.</p>
            
            <div className="flex gap-2 mb-4">
              {(Object.keys(CRYPTO_ADDRESSES) as CryptoType[]).map((crypto) => (
                <button
                  key={crypto}
                  type="button"
                  onClick={() => setSelectedCrypto(crypto)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    selectedCrypto === crypto
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {crypto}
                </button>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">{selectedCrypto} Address</p>
                <button type="button" onClick={copyAddress} className="text-red-600 dark:text-red-400 text-xs font-medium hover:underline">Copy</button>
              </div>
              <p className="text-gray-900 dark:text-white font-mono text-xs break-all">{CRYPTO_ADDRESSES[selectedCrypto]}</p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
              <p className="text-amber-700 dark:text-amber-400 text-sm font-medium">⚠️ Send exactly <strong>${cartTotal.toFixed(2)}</strong> worth of {selectedCrypto}</p>
              <p className="text-amber-600 dark:text-amber-500 text-xs mt-1">Use current market rate. Order will be confirmed after 1 network confirmation.</p>
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">Transaction Hash (after sending)</label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 font-mono text-sm"
                placeholder="0x... or txid..."
              />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 rounded-xl text-lg transition-colors">
            {loading ? "Submitting..." : `Confirm Order — $${cartTotal.toFixed(2)}`}
          </button>
        </form>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm h-fit">
          <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-gray-900 dark:text-white font-bold text-lg">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-xs">💡 Accepted: Bitcoin (BTC), Ethereum (ETH), USDC, Litecoin (LTC)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
