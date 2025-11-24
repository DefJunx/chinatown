"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { db, id } from "@/lib/instant";
import { X } from "lucide-react";
import { toast } from "sonner";

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { items, totalPrice, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) return;

    setIsSubmitting(true);

    try {
      // Submit order to InstantDB
      await db.transact([
        db.tx.orders[id()].update({
          customerName,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            category: item.category,
          })),
          totalPrice,
          status: "pending",
          createdAt: Date.now(),
        }),
      ]);

      // Clear cart and show success
      clearCart();
      setShowSuccess(true);

      // Reset form
      setCustomerName("");

      // Close after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error("Failed to submit order:", error);
      toast.error("Impossibile inviare l'ordine. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            aria-label="Chiudi"
          >
            <X size={24} />
          </button>

          {showSuccess ? (
            <div className="py-8 text-center">
              <div className="mb-4 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-5xl font-bold text-white">
                  ✓
                </div>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-800">
                Ordine Effettuato!
              </h2>
              <p className="text-gray-600">
                Il tuo ordine è stato inviato con successo.
              </p>
            </div>
          ) : (
            <>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Completa il Tuo Ordine
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="customerName"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Il Tuo Nome
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Inserisci il tuo nome"
                  />
                </div>

                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Totale:</span>
                    <span className="text-xl font-bold text-primary-700">
                      €{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-primary-600 py-3 font-semibold text-white transition-colors duration-200 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Invio in corso..." : "Conferma Ordine"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};
