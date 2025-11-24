"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, BarChart3 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { usePathname } from "next/navigation";

interface HeaderProps {
  showCart?: boolean;
}

export function Header({ showCart = false }: HeaderProps) {
  const { totalItems, setIsCartOpen, isHydrated } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="transition-opacity duration-200 hover:opacity-80"
          >
            <h1 className="text-2xl font-bold sm:text-3xl">
              Ristorante Cinese
            </h1>
            <p className="text-sm text-primary-100">
              Ordina i tuoi piatti preferiti
            </p>
          </Link>

          <div className="flex items-center gap-4">
            {/* Navigation Links */}
            <nav className="hidden sm:flex items-center gap-2">
              <Link
                href="/"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === "/"
                    ? "bg-primary-600 text-white"
                    : "text-primary-100 hover:bg-primary-600"
                }`}
              >
                Menu
              </Link>
              <Link
                href="/statistics"
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === "/statistics"
                    ? "bg-primary-600 text-white"
                    : "text-primary-100 hover:bg-primary-600"
                }`}
              >
                <BarChart3 size={16} />
                Statistiche
              </Link>
            </nav>

            {/* Mobile Stats Link */}
            <Link
              href="/statistics"
              className={`sm:hidden rounded-full p-2 transition-colors ${
                pathname === "/statistics"
                  ? "bg-primary-600"
                  : "hover:bg-primary-600"
              }`}
              aria-label="Visualizza statistiche"
            >
              <BarChart3 size={20} />
            </Link>

            {/* Cart Button */}
            {showCart && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative rounded-full bg-white p-3 text-primary-700 transition-colors duration-200 hover:bg-gray-100"
                aria-label="Apri carrello"
              >
                <ShoppingCart size={24} />
                {isHydrated && totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-primary-900">
                    {totalItems}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

