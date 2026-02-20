"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import CartButton from "./CartButton";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-red-600 font-black text-2xl">PHARMA</span>
            <span className="text-white font-black text-2xl">GRADE</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">All Products</Link>
            <Link href="/categories/orals" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Orals</Link>
            <Link href="/categories/injectables" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Injectables</Link>
            <Link href="/categories/peptides" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Peptides</Link>
            <Link href="/categories/pct" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">PCT</Link>
          </nav>

          <div className="flex items-center space-x-2">
            <CartButton />

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-2"
                >
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {session.user?.name?.[0] || "U"}
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1">
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setUserMenuOpen(false)}>My Account</Link>
                    {(session.user as any)?.role === "admin" && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300" onClick={() => setUserMenuOpen(false)}>Admin Dashboard</Link>
                    )}
                    <button onClick={() => { signOut(); setUserMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium px-3 py-2">Login</Link>
                <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">Register</Link>
              </div>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-300 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 space-y-2">
            <Link href="/products" className="block px-2 py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>All Products</Link>
            <Link href="/categories/orals" className="block px-2 py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Orals</Link>
            <Link href="/categories/injectables" className="block px-2 py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Injectables</Link>
            <Link href="/categories/peptides" className="block px-2 py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Peptides</Link>
            <Link href="/categories/pct" className="block px-2 py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>PCT</Link>
            <Link href="/categories/fat-loss" className="block px-2 py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Fat Loss</Link>
            <Link href="/categories/sexual-health" className="block px-2 py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Sexual Health</Link>
            {!session && (
              <>
                <Link href="/login" className="block px-2 py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/register" className="block px-2 py-2 text-red-400 hover:text-red-300" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
