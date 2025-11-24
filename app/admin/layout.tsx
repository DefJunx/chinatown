"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { db } from "@/lib/instant";
import { Header } from "@/components/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, user } = db.useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Allow access to login and setup pages without authentication
    const publicPaths = ["/admin/login", "/admin/setup"];
    if (publicPaths.includes(pathname)) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/admin/login");
    }
  }, [isMounted, isLoading, user, router, pathname]);

  // Show loading state during SSR and until auth is checked
  if (!isMounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // For protected routes, show nothing until auth is confirmed
  const publicPaths = ["/admin/login", "/admin/setup"];
  if (!publicPaths.includes(pathname) && !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {children}
    </div>
  );
}
