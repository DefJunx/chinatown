"use client";

import React from "react";
import { Header } from "@/components/Header";
import { MiniCart } from "@/components/MiniCart";
import { AdminFloatingButton } from "@/components/AdminFloatingButton";
import { Footer } from "@/components/Footer";
import { db } from "@/lib/instant";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = db.useQuery({ systemSettings: {} });

  // Get allowOrdering setting, default to true if no settings exist
  const allowOrdering = data?.systemSettings && data.systemSettings.length > 0
    ? (data.systemSettings[0] as any).allowOrdering ?? true
    : true;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header showCart={allowOrdering} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Cart Sidebar */}
      {allowOrdering && <MiniCart />}

      {/* Admin Floating Button */}
      <AdminFloatingButton />
    </div>
  );
}
