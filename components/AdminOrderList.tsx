"use client";

import React, { useState, useMemo, useEffect } from "react";
import { db, id } from "@/lib/instant";
import type { Order } from "@/types";
import { Copy, LogOut, MessageCircle, Package, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "./ConfirmDialog";

export const AdminOrderList: React.FC = () => {
  const router = useRouter();
  const { user } = db.useAuth();
  const { isLoading, error, data } = db.useQuery({
    orders: {},
    consolidatedOrders: {}
  });
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [copiedText, setCopiedText] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [copiedConsolidatedId, setCopiedConsolidatedId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Helper function to check if a date is today
  const isToday = (timestamp: number) => {
    const today = new Date();
    const date = new Date(timestamp);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Group orders by status and filter for today only
  const ordersByStatus = useMemo(() => {
    const orders = (data?.orders || []) as Order[];
    const consolidatedOrders = (data?.consolidatedOrders || []) as any[];

    // Filter only today's orders
    const todayOrders = orders.filter((o) => isToday(o.createdAt));
    const todayConsolidated = consolidatedOrders.filter((o) => isToday(o.createdAt));

    return {
      pending: todayOrders.filter((o) => o.status === "pending"),
      individualConsolidated: todayOrders.filter((o) => o.status === "consolidated"),
      consolidated: todayConsolidated,
    };
  }, [data?.orders, data?.consolidatedOrders]);

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
      ...ordersByStatus.individualConsolidated,
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
      const consolidatedId = id();
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
      toast.success("Ordini consolidati con successo!");
    } catch (err) {
      console.error("Failed to consolidate orders:", err);
      toast.error("Impossibile consolidare gli ordini. Riprova.");
    }
  };

  const handleCopyConsolidated = () => {
    const allOrders = [
      ...ordersByStatus.pending,
      ...ordersByStatus.individualConsolidated,
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

  const handleCopyConsolidatedOrder = (consolidatedOrder: any) => {
    const itemsArray = Object.entries(consolidatedOrder.items).map(([id, item]: [string, any]) => ({
      id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const text = itemsArray
      .map((item) => `${item.quantity}x ${item.name}`)
      .join("\n");

    navigator.clipboard.writeText(text);
    setCopiedConsolidatedId(consolidatedOrder.id);
    setTimeout(() => setCopiedConsolidatedId(null), 3000);
  };

  const handleWhatsAppConsolidatedOrder = (consolidatedOrder: any) => {
    const itemsArray = Object.entries(consolidatedOrder.items).map(([id, item]: [string, any]) => ({
      id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const orderText = itemsArray
      .map((item) => `${item.quantity}x ${item.name}`)
      .join("\n");

    const message = `*Ordine Consolidato*\n${consolidatedOrder.orderIds.length} ordini\nTotale: €${consolidatedOrder.totalPrice.toFixed(2)}\n\n*Piatti:*\n${orderText}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleClearAllOrders = () => {
    setShowConfirmDialog(true);
  };

  const confirmClearAllOrders = async () => {
    try {
      const allOrders = (data?.orders || []) as Order[];
      const allConsolidatedOrders = (data?.consolidatedOrders || []) as any[];

      // Create delete transactions for all orders and consolidated orders
      const deleteTransactions = [
        ...allOrders.map((order) => db.tx.orders[order.id].delete()),
        ...allConsolidatedOrders.map((consolidatedOrder) =>
          db.tx.consolidatedOrders[consolidatedOrder.id].delete()
        ),
      ];

      if (deleteTransactions.length === 0) {
        toast.info("Nessun ordine da eliminare.");
        return;
      }

      await db.transact(deleteTransactions);
      setSelectedOrders(new Set());
      toast.success(`Eliminati con successo ${allOrders.length} ordini e ${allConsolidatedOrders.length} ordini consolidati.`);
    } catch (err) {
      console.error("Failed to clear orders:", err);
      toast.error("Impossibile eliminare gli ordini. Riprova.");
    }
  };

  const handleLogout = async () => {
    await db.auth.signOut();
    router.push("/admin/login");
  };

  if (!isMounted || isLoading) {
    return <div className="py-8 text-center animate-pulse">Caricamento ordini...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        Errore durante il caricamento degli ordini: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800">Gestione Ordini</h2>
        <div className="flex gap-2">
          <button
            onClick={handleClearAllOrders}
            className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white transition-all hover:bg-red-700 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <Trash2 size={18} />
            Elimina Tutti gli Ordini
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-all hover:bg-gray-300 hover:scale-105 active:scale-95"
          >
            <LogOut size={18} />
            Esci
          </button>
        </div>
      </div>

      {/* Consolidate Actions */}
      {selectedOrders.size > 0 && (
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-4 animate-scale-in">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-medium text-primary-800">
              {selectedOrders.size} ordine/i selezionato/i
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCopyConsolidated}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-all hover:bg-gray-100 hover:scale-105 active:scale-95"
              >
                <Copy size={18} />
                Copia Lista
              </button>
              <button
                onClick={handleConsolidateOrders}
                className="flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-white transition-all hover:bg-primary-700 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <Package size={18} />
                Consolida
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copied notification */}
      {copiedText && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 animate-bounce-in">
          <p className="mb-2 font-medium text-green-800">
            Copiato negli appunti:
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
          Ordini di Oggi
        </h3>
        {ordersByStatus.pending.length === 0 ? (
          <p className="rounded-lg bg-gray-50 py-8 text-center text-gray-500">
            Nessun ordine oggi
          </p>
        ) : (
          <div className="space-y-4">
            {ordersByStatus.pending.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={selectedOrders.has(order.id)}
                onSelect={handleSelectOrder}
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
          Ordini Consolidati (Oggi)
        </h3>
        {ordersByStatus.consolidated.length === 0 ? (
          <p className="rounded-lg bg-gray-50 py-8 text-center text-gray-500">
            Nessun ordine consolidato oggi
          </p>
        ) : (
          <div className="space-y-4">
            {ordersByStatus.consolidated.map((consolidatedOrder: any) => (
              <ConsolidatedOrderCard
                key={consolidatedOrder.id}
                consolidatedOrder={consolidatedOrder}
                onCopy={handleCopyConsolidatedOrder}
                onWhatsApp={handleWhatsAppConsolidatedOrder}
                isCopied={copiedConsolidatedId === consolidatedOrder.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmClearAllOrders}
        title="Eliminare Tutti gli Ordini?"
        message="Sei sicuro di voler eliminare TUTTI gli ordini e gli ordini consolidati? Questa azione non può essere annullata!"
        confirmText="Elimina Tutti"
        cancelText="Annulla"
        variant="danger"
      />
    </div>
  );
};

interface OrderCardProps {
  order: Order;
  isSelected: boolean;
  onSelect: (orderId: string) => void;
  showSelect: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isSelected,
  onSelect,
  showSelect,
}) => {
  return (
    <div
      className={`rounded-lg border-2 bg-white shadow-md transition-all hover:shadow-lg animate-fade-in-up ${
        isSelected ? "border-primary-500 scale-[1.02]" : "border-gray-200"
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
                className="mt-1 h-5 w-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer transition-transform hover:scale-110"
              />
            )}
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-800">
                {order.customerName}
              </h4>
              <p className="text-gray-600">{order.customerPhone}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString('en-GB', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </p>
            </div>
          </div>
          <span className="text-xl font-bold text-primary-700">
            €{order.totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="rounded bg-gray-50 p-3">
          <h5 className="mb-2 font-semibold text-gray-700">Piatti:</h5>
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
      </div>
    </div>
  );
};

interface ConsolidatedOrderCardProps {
  consolidatedOrder: any;
  onCopy: (consolidatedOrder: any) => void;
  onWhatsApp: (consolidatedOrder: any) => void;
  isCopied: boolean;
}

const ConsolidatedOrderCard: React.FC<ConsolidatedOrderCardProps> = ({
  consolidatedOrder,
  onCopy,
  onWhatsApp,
  isCopied,
}) => {
  const itemsArray = Object.entries(consolidatedOrder.items).map(([id, item]: [string, any]) => ({
    id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  return (
    <div className="rounded-lg border-2 border-blue-400 bg-blue-50 shadow-md hover:shadow-xl transition-all animate-fade-in-up">
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-800">
              Ordine Consolidato ({consolidatedOrder.orderIds.length} ordini)
            </h4>
            <p className="text-sm text-gray-500">
              {new Date(consolidatedOrder.createdAt).toLocaleString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </p>
          </div>
          <span className="text-xl font-bold text-primary-700">
            €{consolidatedOrder.totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="mb-3 rounded bg-white p-3">
          <h5 className="mb-2 font-semibold text-gray-700">Piatti Aggregati:</h5>
          <ul className="space-y-1">
            {itemsArray.map((item) => (
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

        <div className="flex gap-2">
          <button
            onClick={() => onCopy(consolidatedOrder)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md border py-2 transition-all hover:scale-105 active:scale-95 ${
              isCopied
                ? "border-green-500 bg-green-50 text-green-700 animate-success-bounce"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Copy size={18} />
            {isCopied ? "Copiato!" : "Copia"}
          </button>
          <button
            onClick={() => onWhatsApp(consolidatedOrder)}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-green-600 bg-green-600 py-2 text-white transition-all hover:bg-green-700 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <MessageCircle size={18} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
