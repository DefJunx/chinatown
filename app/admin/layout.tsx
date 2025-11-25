"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { db } from "@/lib/instant";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, user } = db.useAuth();
  const { data: settingsData } = db.useQuery({ systemSettings: {} });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Check if trying to access setup page
    if (pathname === "/admin/setup") {
      // Allow setup if no settings exist yet (first time setup)
      if (settingsData?.systemSettings && settingsData.systemSettings.length > 0) {
        const settings = settingsData.systemSettings[0] as any;
        if (!settings.allowAdminRegistration) {
          // Registration is disabled, redirect to login
          router.push("/admin/login");
          return;
        }
      }
      // Allow access to setup page
      return;
    }

    // Allow access to login page without authentication
    const publicPaths = ["/admin/login"];
    if (publicPaths.includes(pathname)) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/admin/login");
    }
  }, [isMounted, isLoading, user, router, pathname, settingsData]);

  // Show loading state during SSR and until auth is checked
  if (!isMounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-600">Caricamento...</div>
      </div>
    );
  }

  // For protected routes, show nothing until auth is confirmed
  const publicPaths = ["/admin/login", "/admin/setup"];
  if (!publicPaths.includes(pathname) && !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
