"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { MiniCart } from "@/components/MiniCart";
import { AdminFloatingButton } from "@/components/AdminFloatingButton";
import { Footer } from "@/components/Footer";
import { db } from "@/lib/instant";
import {
  UserProfileProvider,
  useUserProfile,
} from "@/contexts/UserProfileContext";

function CustomerLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isAuthenticated, hasProfile } = useUserProfile();
  const { data } = db.useQuery({ systemSettings: {} });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isMounted || isLoading) return;

    // Skip redirect for statistics page (public)
    if (pathname === "/statistics") return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!hasProfile) {
      router.push("/profile");
      return;
    }
  }, [isMounted, isLoading, isAuthenticated, hasProfile, router, pathname]);

  // Get allowOrdering setting, default to true if no settings exist
  const allowOrdering =
    data?.systemSettings && data.systemSettings.length > 0
      ? (data.systemSettings[0] as any).allowOrdering ?? true
      : true;

  // Show loading state
  if (!isMounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-600">Caricamento...</div>
      </div>
    );
  }

  // Don't render content until auth is confirmed (except for statistics)
  if (pathname !== "/statistics" && (!isAuthenticated || !hasProfile)) {
    return null;
  }

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

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProfileProvider>
      <CustomerLayoutContent>{children}</CustomerLayoutContent>
    </UserProfileProvider>
  );
}
