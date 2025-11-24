'use client';

import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { OrderForm } from './OrderForm';

export const MiniCart: React.FC = () => {
  const { items, updateQuantity, removeItem, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  const handlePlaceOrder = () => {
    setIsOrderFormOpen(true);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="bg-primary-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-bold">Your Cart</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="hover:bg-primary-800 p-1 rounded-md transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 flex-1">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded-md p-1 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded-md p-1 transition-colors"
                        aria-label="Increase quantity"
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
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary-700">
                €{totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-md font-semibold transition-colors duration-200"
            >
              Place Order
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

