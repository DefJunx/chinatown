"use client";

import React, { useState, useMemo } from "react";
import { db } from "@/lib/instant";
import type { Order } from "@/types";
import { Check, Copy, LogOut, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export const AdminOrderList: React.FC = () => {
  const router = useRouter();
  const { user } = db.useAuth();
  const { isLoading, error, data } = db.useQuery({ orders: {} });
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [copiedText, setCopiedText] = useState("");

  // Group orders by status
  const ordersByStatus = useMemo(() => {
    const orders = (data?.orders || []) as Order[];
    return {
      pending: orders.filter((o) => o.status === "pending"),
      consolidated: orders.filter((o) => o.status === "consolidated"),
      completed: orders.filter((o) => o.status === "completed"),
    };
  }, [data?.orders]);

  const handleSelectOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleConsolidateOrders = async () => {
    if (selectedOrders.size === 0) return;

    const allOrders = [
      ...ordersByStatus.pending,
      ...ordersByStatus.consolidated,
      ...ordersByStatus.completed,
    ];
    const ordersToConsolidate = allOrders.filter((o) =>
      selectedOrders.has(o.id)
    );

    // Aggregate items
    const itemsMap: {
      [key: string]: { name: string; quantity: number; price: number };
    } = {};
    let totalPrice = 0;

    ordersToConsolidate.forEach((order) => {
      order.items.forEach((item) => {
        if (itemsMap[item.id]) {
          itemsMap[item.id].quantity += item.quantity;
        } else {
          itemsMap[item.id] = {
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          };
        }
      });
      totalPrice += order.totalPrice;
    });

    try {
      // Create consolidated order
      const consolidatedId = db.id();
      await db.transact([
        db.tx.consolidatedOrders[consolidatedId].update({
          orderIds: Array.from(selectedOrders),
          items: itemsMap,
          totalPrice,
          status: "pending",
          createdAt: Date.now(),
          adminId: user?.id || "unknown",
        }),
        // Mark orders as consolidated
        ...ordersToConsolidate.map((order) =>
          db.tx.orders[order.id].update({ status: "consolidated" })
        ),
      ]);

      setSelectedOrders(new Set());
      alert("Orders consolidated successfully!");
    } catch (err) {
      console.error("Failed to consolidate orders:", err);
      alert("Failed to consolidate orders. Please try again.");
    }
  };

  const handleMarkAsCompleted = async (orderId: string) => {
    try {
      await db.transact([
        db.tx.orders[orderId].update({ status: "completed" }),
      ]);
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status.");
    }
  };

  const handleCopyConsolidated = () => {
    const allOrders = [
      ...ordersByStatus.pending,
      ...ordersByStatus.consolidated,
      ...ordersByStatus.completed,
    ];
    const ordersToConsolidate = allOrders.filter((o) =>
      selectedOrders.has(o.id)
    );

    if (ordersToConsolidate.length === 0) return;

    const itemsMap: { [key: string]: { name: string; quantity: number } } = {};
    ordersToConsolidate.forEach((order) => {
      order.items.forEach((item) => {
        if (itemsMap[item.id]) {
          itemsMap[item.id].quantity += item.quantity;
        } else {
          itemsMap[item.id] = {
            name: item.name,
            quantity: item.quantity,
          };
        }
      });
    });

    const text = Object.values(itemsMap)
      .map((item) => `${item.quantity}x ${item.name}`)
      .join("\n");

    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(""), 3000);
  };

  const handleLogout = async () => {
    await db.auth.signOut();
    router.push("/admin/login");
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        Error loading orders: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Consolidate Actions */}
      {selectedOrders.size > 0 && (
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-medium text-primary-800">
              {selectedOrders.size} order(s) selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCopyConsolidated}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
              >
                <Copy size={18} />
                Copy List
              </button>
              <button
                onClick={handleConsolidateOrders}
                className="flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
              >
                <Package size={18} />
                Consolidate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copied notification */}
      {copiedText && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="mb-2 font-medium text-green-800">
            Copied to clipboard:
          </p>
          <pre className="whitespace-pre-wrap text-sm text-green-700">
            {copiedText}
          </pre>
        </div>
      )}

      {/* Pending Orders */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-700">
          <span className="rounded bg-yellow-500 px-2 py-1 text-sm text-white">
            {ordersByStatus.pending.length}
          </span>
          Pending Orders
        </h3>
        {ordersByStatus.pending.length === 0 ? (
          <p className="rounded-lg bg-gray-50 py-8 text-center text-gray-500">
            No pending orders
          </p>
        ) : (
          <div className="space-y-4">
            {ordersByStatus.pending.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={selectedOrders.has(order.id)}
                onSelect={handleSelectOrder}
                onMarkCompleted={handleMarkAsCompleted}
                showSelect={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Consolidated Orders */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-700">
          <span className="rounded bg-blue-500 px-2 py-1 text-sm text-white">
            {ordersByStatus.consolidated.length}
          </span>
          Consolidated Orders
        </h3>
        {ordersByStatus.consolidated.length === 0 ? (
          <p className="rounded-lg bg-gray-50 py-8 text-center text-gray-500">
            No consolidated orders
          </p>
        ) : (
          <div className="space-y-4">
            {ordersByStatus.consolidated.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={false}
                onSelect={handleSelectOrder}
                onMarkCompleted={handleMarkAsCompleted}
                showSelect={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Orders */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-700">
          <span className="rounded bg-green-500 px-2 py-1 text-sm text-white">
            {ordersByStatus.completed.length}
          </span>
          Completed Orders
        </h3>
        {ordersByStatus.completed.length === 0 ? (
          <p className="rounded-lg bg-gray-50 py-8 text-center text-gray-500">
            No completed orders
          </p>
        ) : (
          <div className="space-y-4">
            {ordersByStatus.completed.slice(0, 10).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={false}
                onSelect={handleSelectOrder}
                onMarkCompleted={handleMarkAsCompleted}
                showSelect={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface OrderCardProps {
  order: Order;
  isSelected: boolean;
  onSelect: (orderId: string) => void;
  onMarkCompleted: (orderId: string) => void;
  showSelect: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isSelected,
  onSelect,
  onMarkCompleted,
  showSelect,
}) => {
  return (
    <div
      className={`rounded-lg border-2 bg-white shadow-md transition-all ${
        isSelected ? "border-primary-500" : "border-gray-200"
      }`}
    >
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex flex-1 items-start gap-3">
            {showSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(order.id)}
                className="mt-1 h-5 w-5 rounded text-primary-600 focus:ring-primary-500"
              />
            )}
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-800">
                {order.customerName}
              </h4>
              <p className="text-gray-600">{order.customerPhone}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <span className="text-xl font-bold text-primary-700">
            €{order.totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="mb-3 rounded bg-gray-50 p-3">
          <h5 className="mb-2 font-semibold text-gray-700">Items:</h5>
          <ul className="space-y-1">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between text-gray-700">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">
                  €{(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {order.status === "pending" && (
          <button
            onClick={() => onMarkCompleted(order.id)}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 py-2 text-white transition-colors hover:bg-green-700"
          >
            <Check size={18} />
            Mark as Completed
          </button>
        )}
      </div>
    </div>
  );
};
