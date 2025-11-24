"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { MiniCart } from "@/components/MiniCart";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { totalItems, setIsCartOpen, isHydrated } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-primary-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Chinese Takeaway
              </h1>
              <p className="text-sm text-primary-100">
                Order your favorite dishes
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full bg-white p-3 text-primary-700 transition-colors duration-200 hover:bg-gray-100"
              aria-label="Open cart"
            >
              <ShoppingCart size={24} />
              {isHydrated && totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-primary-900">
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
