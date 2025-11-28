"use client";

import React from "react";
import { MenuGrid } from "@/components/MenuGrid";
import { db } from "@/lib/instant";

export default function HomePage() {
  const { data, isLoading } = db.useQuery({ systemSettings: {} });

  // Wait for data to load before rendering to prevent flicker
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Get allowOrdering setting, default to true if no settings exist
  const allowOrdering = data?.systemSettings && data.systemSettings.length > 0
    ? (data.systemSettings[0] as any).allowOrdering ?? true
    : true;

  if (!allowOrdering) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="animate-fade-in">
          <h2 className="mb-4 text-4xl font-bold text-primary-800 sm:text-5xl">
            Ordinazioni chiuse!
          </h2>
          <p className="text-lg text-gray-600 sm:text-xl">
            Ci scusiamo per il disagio. Torneremo presto con nuovi sapori! 🍜
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <MenuGrid />
    </div>
  );
}
