'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartButtonProps {
  onClick: () => void;
}

/**
 * Cart Button Component
 * 
 * Displays cart icon with item count badge
 */
export default function CartButton({ onClick }: CartButtonProps) {
  const { itemCount } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      aria-label="Open shopping cart"
    >
      <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
