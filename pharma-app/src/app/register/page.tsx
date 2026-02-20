"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setError("Registration is in demo mode. Use demo credentials to login.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-1 mb-2">
            <span className="text-red-600 font-black text-3xl">PHARMA</span>
            <span className="text-white font-black text-3xl">GRADE</span>
          </div>
          <p className="text-gray-400">Create your account</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-yellow-900/30 border border-yellow-800 text-yellow-400 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                placeholder="Enter your full name" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                placeholder="Enter your email" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                placeholder="Create a password (min 6 chars)" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white font-bold py-3 rounded-lg transition-colors">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">Already have an account?{" "}
              <Link href="/login" className="text-red-400 hover:text-red-300 font-medium">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
