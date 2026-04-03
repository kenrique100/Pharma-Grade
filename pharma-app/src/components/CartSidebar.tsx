'use client';

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Shopping Cart Sidebar Component
 * 
 * Features:
 * - Display cart items with images and prices
 * - Adjust quantities
 * - Remove items
 * - Calculate total
 * - Checkout button
 */
export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();

  const handleCheckout = () => {
    // TODO: Implement checkout flow
    alert('Checkout feature coming soon!');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-lg z-50 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Shopping Cart
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Add some products to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-red-600 font-bold mt-1">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Shipping (placeholder) */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                $0.00
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-900 dark:text-white">Total:</span>
              <span className="text-2xl font-bold text-red-600">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Proceed to Checkout
            </button>

            {/* Continue Shopping Button */}
            <button
              onClick={onClose}
              className="w-full border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-900 dark:text-white font-bold py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 py-2 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
