'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { MiniCart } from '@/components/MiniCart';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { totalItems, setIsCartOpen, isHydrated } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-700 text-white shadow-lg sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Chinese Takeaway</h1>
              <p className="text-primary-100 text-sm">Order your favorite dishes</p>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-white text-primary-700 hover:bg-gray-100 p-3 rounded-full transition-colors duration-200"
              aria-label="Open cart"
            >
              <ShoppingCart size={24} />
              {isHydrated && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-primary-900 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Cart Sidebar */}
      <MiniCart />
    </div>
  );
}

