"use client";

import React from "react";
import { AdminOrderList } from "@/components/AdminOrderList";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-primary-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-primary-100">
            Manage and consolidate customer orders
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <AdminOrderList />
      </div>
    </div>
  );
}
