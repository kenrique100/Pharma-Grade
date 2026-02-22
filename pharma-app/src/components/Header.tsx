"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import CartButton from "./CartButton";
import GoogleTranslate from "./GoogleTranslate";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/logo.webp" alt="Pharma Grade" width={36} height={36} className="rounded-lg" />
            <span className="text-red-600 font-black text-xl">PHARMA</span>
            <span className="text-gray-900 dark:text-white font-black text-xl">GRADE</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">Products</Link>
            <Link href="/categories/injectable-steroids" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">Injectables</Link>
            <Link href="/categories/bulking-steroids" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">Bulking</Link>
            <Link href="/categories/fat-loss" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">Fat Loss</Link>
            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">About</Link>
            <Link href="/testimonials" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">Reviews</Link>
            <Link href="/support" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">Support</Link>
          </nav>

          <div className="flex items-center space-x-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}

            <GoogleTranslate />

            <CartButton />

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors p-2"
                >
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {session.user?.name?.[0] || "U"}
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white" onClick={() => setUserMenuOpen(false)}>My Account</Link>
                    {session.user?.role === "admin" && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setUserMenuOpen(false)}>Admin Dashboard</Link>
                    )}
                    <button onClick={() => { signOut(); setUserMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium px-3 py-2">Login</Link>
                <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">Register</Link>
              </div>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
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
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4 space-y-1">
            <Link href="/products" className="block px-2 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => setMenuOpen(false)}>All Products</Link>
            <Link href="/categories/injectable-steroids" className="block px-2 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => setMenuOpen(false)}>Injectable Steroids</Link>
            <Link href="/categories/bulking-steroids" className="block px-2 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => setMenuOpen(false)}>Bulking Steroids</Link>
            <Link href="/categories/fat-loss" className="block px-2 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => setMenuOpen(false)}>Fat Loss</Link>
            <Link href="/categories/post-cycle-therapy" className="block px-2 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => setMenuOpen(false)}>Post Cycle Therapy</Link>
            <Link href="/about" className="block px-2 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/testimonials" className="block px-2 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => setMenuOpen(false)}>Reviews</Link>
            <Link href="/support" className="block px-2 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => setMenuOpen(false)}>Support</Link>
            {!session && (
              <>
                <Link href="/login" className="block px-2 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/register" className="block px-2 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
