"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/categories", label: "Categories", icon: "🗂️" },
  { href: "/admin/orders", label: "Orders", icon: "🛒" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/chat", label: "Live Chat", icon: "💬" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (
    <nav className="space-y-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setMobileOpen(false)}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            pathname === link.href
              ? "bg-red-600 text-white"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <span>{link.icon}</span>
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 transform transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900 dark:text-white font-bold text-lg">Admin Panel</h2>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white p-1"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {navLinks}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <span>🏪</span>
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen flex-shrink-0">
        <div className="p-6">
          <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-6">Admin Panel</h2>
          {navLinks}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <Link
              href="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <span>🏪</span>
              <span>Back to Store</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile hamburger button - floating action button, hidden when drawer is open */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed bottom-4 right-4 z-30 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors"
          aria-label="Open admin menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </>
  );
}
