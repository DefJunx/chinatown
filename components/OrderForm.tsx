"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { db } from "@/lib/instant";
import { id } from "@instantdb/react";
import { X } from "lucide-react";

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
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsSubmitting(true);

    try {
      // Submit order to InstantDB
      await db.transact([
        db.tx.orders[id()].update({
          customerName,
          customerPhone,
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
      setCustomerPhone("");

      // Close after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error("Failed to submit order:", error);
      alert("Failed to submit order. Please try again.");
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
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {showSuccess ? (
            <div className="py-8 text-center">
              <div className="mb-4 text-6xl text-green-500">✓</div>
              <h2 className="mb-2 text-2xl font-bold text-gray-800">
                Order Placed!
              </h2>
              <p className="text-gray-600">
                Your order has been successfully submitted.
              </p>
            </div>
          ) : (
            <>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Complete Your Order
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="customerName"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customerPhone"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Total:</span>
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
                  {isSubmitting ? "Submitting..." : "Confirm Order"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};
