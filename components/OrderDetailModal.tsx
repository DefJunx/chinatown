"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Trash2 } from "lucide-react";
import { db } from "@/lib/instant";
import { toast } from "sonner";
import type { Order, ConsolidatedOrder } from "@/types";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  consolidatedOrderId: string;
  allConsolidatedOrders: ConsolidatedOrder[];
  allOrders: Order[];
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  consolidatedOrderId,
  allConsolidatedOrders,
  allOrders,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  // Find consolidated order from real-time data
  const consolidatedOrder = useMemo(() => {
    return allConsolidatedOrders.find((co) => co.id === consolidatedOrderId);
  }, [allConsolidatedOrders, consolidatedOrderId]);

  // Filter orders by consolidated order IDs
  const individualOrders = useMemo(() => {
    if (!consolidatedOrder || !allOrders) return [];
    return allOrders.filter((order) =>
      consolidatedOrder.orderIds.includes(order.id)
    );
  }, [consolidatedOrder, allOrders]);

  const handleRemoveOrder = async (order: Order) => {
    if (!consolidatedOrder) return;

    try {
      // Remove order ID from consolidated order
      const updatedOrderIds = consolidatedOrder.orderIds.filter(
        (id) => id !== order.id
      );

      // Subtract order's items from consolidated order items
      const updatedItems = { ...consolidatedOrder.items };
      order.items.forEach((item) => {
        if (updatedItems[item.id]) {
          updatedItems[item.id].quantity -= item.quantity;
          // Remove item if quantity reaches 0 or below
          if (updatedItems[item.id].quantity <= 0) {
            delete updatedItems[item.id];
          }
        }
      });

      // Subtract order total price
      const updatedTotalPrice = consolidatedOrder.totalPrice - order.totalPrice;

      // Subtract forks and chopsticks
      const updatedForks = Math.max(0, (consolidatedOrder.forks || 0) - (order.forks || 0));
      const updatedChopsticks = Math.max(0, (consolidatedOrder.chopsticks || 0) - (order.chopsticks || 0));

      // Prepare transactions
      const transactions = [];

      // If consolidated order becomes empty, delete it
      if (updatedOrderIds.length === 0) {
        transactions.push(
          db.tx.consolidatedOrders[consolidatedOrder.id].delete()
        );
      } else {
        // Update consolidated order
        transactions.push(
          db.tx.consolidatedOrders[consolidatedOrder.id].update({
            orderIds: updatedOrderIds,
            items: updatedItems,
            totalPrice: updatedTotalPrice,
            forks: updatedForks,
            chopsticks: updatedChopsticks,
          })
        );
      }

      // Update order status back to pending
      transactions.push(
        db.tx.orders[order.id].update({ status: "pending" })
      );

      // Execute all transactions atomically
      await db.transact(transactions);

      toast.success("Ordine rimosso dall'ordine consolidato");

      // Close modal if consolidated order was deleted
      if (updatedOrderIds.length === 0) {
        onClose();
      }
    } catch (error) {
      console.error("Failed to remove order from consolidated order:", error);
      toast.error("Impossibile rimuovere l'ordine. Riprova.");
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!shouldRender || !consolidatedOrder) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 ${
          isClosing ? "animate-fade-out" : "animate-fade-in"
        }`}
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className={`relative w-full max-w-2xl max-h-[90vh] rounded-lg bg-white shadow-xl ${
            isClosing ? "animate-fade-out" : "animate-scale-in"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 text-gray-400 transition-all hover:text-gray-600 hover:rotate-90 hover:scale-110"
            aria-label="Chiudi"
          >
            <X size={24} />
          </button>

          <div className="p-6">
            <h3 className="mb-4 text-2xl font-bold text-gray-800">
              Dettagli Ordine Consolidato
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              {individualOrders.length} ordine/i - Totale: €
              {consolidatedOrder.totalPrice.toFixed(2)}
            </p>

            {/* Scrollable content */}
            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
              {individualOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  {/* Customer Name as Heading with Remove Button */}
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-lg font-bold text-gray-800">
                      {order.customerName}
                    </h4>
                    <button
                      onClick={() => handleRemoveOrder(order)}
                      className="rounded-md p-2 text-red-600 transition-all hover:bg-red-50 hover:scale-110 active:scale-95"
                      aria-label="Rimuovi ordine"
                      title="Rimuovi ordine dall'ordine consolidato"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {order.customerPhone && (
                    <p className="mb-3 text-sm text-gray-600">
                      {order.customerPhone}
                    </p>
                  )}

                  {/* Dishes List */}
                  <div className="rounded bg-white p-3">
                    <ul className="space-y-2">
                      {order.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between text-gray-700"
                        >
                          <span className="ml-2">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-medium">
                            €{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {((order.forks ?? 0) > 0) || ((order.chopsticks ?? 0) > 0) ? (
                      <div className="mt-3 border-t border-gray-200 pt-2">
                        <h6 className="mb-1 text-sm font-semibold text-gray-700">Posate:</h6>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {(order.forks ?? 0) > 0 && (
                            <li>Forchette: {order.forks}</li>
                          )}
                          {(order.chopsticks ?? 0) > 0 && (
                            <li>Bacchette: {order.chopsticks}</li>
                          )}
                        </ul>
                      </div>
                    ) : null}
                    <div className="mt-3 border-t border-gray-200 pt-2">
                      <div className="flex justify-between font-semibold text-gray-800">
                        <span>Totale Ordine:</span>
                        <span>€{order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleClose}
                className="rounded-md border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

