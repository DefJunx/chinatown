"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ShoppingCart,
  BarChart3,
  User,
  Package,
  LogOut,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { db } from "@/lib/instant";
import type { UserProfile } from "@/types";

interface HeaderProps {
  showCart?: boolean;
}

export function Header({ showCart = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, setIsCartOpen, isHydrated, lastItemAdded } = useCart();
  const { user } = db.useAuth();
  const { data: profileData } = db.useQuery(
    user ? { userProfiles: { $: { where: { userId: user.id } } } } : null
  );

  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profile = (profileData?.userProfiles?.[0] as UserProfile) || null;
  const isAdmin = profile?.isAdmin || false;
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    if (lastItemAdded > 0) {
      setShouldAnimate(true);
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [lastItemAdded]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await db.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="transition-opacity duration-200 hover:opacity-80"
          >
            <h1 className="text-2xl font-bold sm:text-3xl">Ristorante Cinese</h1>
            <p className="text-sm text-primary-100">
              Ordina i tuoi piatti preferiti
            </p>
          </Link>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation Links */}
            {user && !isAdminRoute && (
              <nav className="hidden md:flex items-center gap-2">
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
                  href="/orders"
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === "/orders"
                      ? "bg-primary-600 text-white"
                      : "text-primary-100 hover:bg-primary-600"
                  }`}
                >
                  <Package size={16} />
                  I Miei Ordini
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
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === "/profile"
                      ? "bg-primary-600 text-white"
                      : "text-primary-100 hover:bg-primary-600"
                  }`}
                >
                  <User size={16} />
                  Profilo
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-primary-100 transition-colors hover:bg-primary-600"
                >
                  <LogOut size={16} />
                  Esci
                </button>
              </nav>
            )}

            {/* Mobile Menu Button */}
            {user && !isAdminRoute && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden rounded-full p-2 transition-colors hover:bg-primary-600"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
            )}

            {/* Cart Button */}
            {showCart && (
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative rounded-full bg-white p-3 text-primary-700 transition-all duration-200 hover:bg-gray-100 hover:scale-110 ${
                  shouldAnimate ? "animate-wiggle" : ""
                }`}
                aria-label="Apri carrello"
              >
                <ShoppingCart size={24} />
                {isHydrated && totalItems > 0 && (
                  <span
                    className={`absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-primary-900 transition-transform ${
                      shouldAnimate ? "animate-cart-badge-bounce" : ""
                    }`}
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {user && !isAdminRoute && mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-primary-600 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  pathname === "/"
                    ? "bg-primary-600 text-white"
                    : "text-primary-100 hover:bg-primary-600"
                }`}
              >
                Menu
              </Link>
              <Link
                href="/orders"
                className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  pathname === "/orders"
                    ? "bg-primary-600 text-white"
                    : "text-primary-100 hover:bg-primary-600"
                }`}
              >
                <Package size={16} />
                I Miei Ordini
              </Link>
              <Link
                href="/statistics"
                className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  pathname === "/statistics"
                    ? "bg-primary-600 text-white"
                    : "text-primary-100 hover:bg-primary-600"
                }`}
              >
                <BarChart3 size={16} />
                Statistiche
              </Link>
              <Link
                href="/profile"
                className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  pathname === "/profile"
                    ? "bg-primary-600 text-white"
                    : "text-primary-100 hover:bg-primary-600"
                }`}
              >
                <User size={16} />
                Profilo
              </Link>
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-primary-100 transition-colors hover:bg-primary-600"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-primary-100 transition-colors hover:bg-primary-600 text-left"
              >
                <LogOut size={16} />
                Esci
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

