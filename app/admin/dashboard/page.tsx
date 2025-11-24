"use client";

import React from "react";
import { AdminOrderList } from "@/components/AdminOrderList";

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage and consolidate customer orders
        </p>
      </div>

      <AdminOrderList />
    </div>
  );
}
