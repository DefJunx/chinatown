"use client";

import React from "react";
import { Header } from "@/components/Header";
import { MiniCart } from "@/components/MiniCart";
import { AdminFloatingButton } from "@/components/AdminFloatingButton";
import { Footer } from "@/components/Footer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header showCart={true} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Cart Sidebar */}
      <MiniCart />

      {/* Admin Floating Button */}
      <AdminFloatingButton />
    </div>
  );
}
