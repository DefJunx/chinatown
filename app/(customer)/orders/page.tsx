"use client";

import React from "react";
import { db } from "@/lib/instant";
import { ArrowLeft, Package, Clock, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/types";

export default function OrderHistoryPage() {
  const { user } = db.useAuth();
  const { data: ordersData, isLoading: ordersLoading } = db.useQuery(
    user ? { orders: { $: { where: { userId: user.id } } } } : null
  );

  const orders = (ordersData?.orders || []) as Order[];

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt);

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
            <Clock size={14} />
            In Attesa
          </span>
        );
      case "consolidated":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            <Loader2 size={14} />
            In Elaborazione
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            <CheckCircle2 size={14} />
            Completato
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (ordersLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="text-gray-600">Caricamento ordini...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Torna al Menu
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Package className="text-primary-600" />
          I Tuoi Ordini
        </h1>
        <p className="mt-2 text-gray-600">
          Visualizza lo storico dei tuoi ordini
        </p>
      </div>

      {sortedOrders.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-md">
          <Package size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="mb-2 text-xl font-semibold text-gray-700">
            Nessun ordine ancora
          </h2>
          <p className="mb-6 text-gray-500">
            Non hai ancora effettuato nessun ordine.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700 hover:scale-105 active:scale-95"
          >
            Sfoglia il Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg animate-fade-in-up"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="font-medium text-gray-700">
                    Ordine per: {order.customerName}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(order.status)}
                  <span className="text-xl font-bold text-primary-700">
                    €{order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="rounded-md bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold text-gray-700">Piatti:</h3>
                <ul className="space-y-1">
                  {order.items.map((item, index) => (
                    <li
                      key={`${item.id}-${index}`}
                      className="flex justify-between text-gray-600"
                    >
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">
                        €{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                {((order.forks ?? 0) > 0 || (order.chopsticks ?? 0) > 0) && (
                  <div className="mt-3 border-t border-gray-200 pt-3">
                    <h4 className="mb-1 text-sm font-semibold text-gray-700">
                      Posate:
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {(order.forks ?? 0) > 0 && (
                        <li>Forchette: {order.forks}</li>
                      )}
                      {(order.chopsticks ?? 0) > 0 && (
                        <li>Bacchette: {order.chopsticks}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

