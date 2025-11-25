"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/instant";
import { Settings } from "lucide-react";

export function AdminFloatingButton() {
  const router = useRouter();
  const { isLoading, user } = db.useAuth();

  // Only show button if user is authenticated (admin)
  if (isLoading || !user) {
    return null;
  }

  return (
    <button
      onClick={() => router.push("/admin/dashboard")}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-700 text-white shadow-lg transition-all duration-200 hover:bg-primary-800 hover:scale-110 hover:shadow-2xl hover:rotate-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 animate-bounce-in"
      aria-label="Vai alla Dashboard Admin"
      title="Dashboard Admin"
    >
      <Settings size={24} />
    </button>
  );
}

