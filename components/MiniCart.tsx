"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { OrderForm } from "./OrderForm";

export const MiniCart: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  const handlePlaceOrder = () => {
    setIsOrderFormOpen(true);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Panel */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full animate-slide-in flex-col bg-white shadow-2xl sm:w-96">
        {/* Header */}
        <div className="flex items-center justify-between bg-primary-700 p-4 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-bold">Il Tuo Carrello</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="rounded-md p-1 transition-colors hover:bg-primary-800"
            aria-label="Chiudi carrello"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="mt-8 text-center text-gray-500">
              <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Il tuo carrello è vuoto</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="flex-1 font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="rounded-md bg-gray-200 p-1 transition-colors hover:bg-gray-300"
                        aria-label="Diminuisci quantità"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="rounded-md bg-gray-200 p-1 transition-colors hover:bg-gray-300"
                        aria-label="Aumenta quantità"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="font-bold text-primary-700">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-semibold">Totale:</span>
              <span className="text-2xl font-bold text-primary-700">
                €{totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full rounded-md bg-primary-600 py-3 font-semibold text-white transition-colors duration-200 hover:bg-primary-700"
            >
              Effettua Ordine
            </button>
          </div>
        )}
      </div>

      {/* Order Form Modal */}
      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        onSuccess={() => {
          setIsOrderFormOpen(false);
          setIsCartOpen(false);
        }}
      />
    </>
  );
};
