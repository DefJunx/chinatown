"use client";

import React, { useState, useEffect } from "react";
import type { MenuItem } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { Plus, Check } from "lucide-react";

interface DishCardProps {
  item: MenuItem;
}

export const DishCard: React.FC<DishCardProps> = ({ item }) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(item);

    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(true);
    }, 200);
  };

  return (
    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-fade-in-up">
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-800 transition-colors group-hover:text-primary-700">
          {item.name}
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-700">
            €{item.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || showSuccess}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-white transition-all duration-300 ${
              showSuccess
                ? "bg-green-600 animate-success-bounce"
                : isAdding
                ? "bg-primary-700 scale-95"
                : "bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-95"
            }`}
            aria-label={`Aggiungi ${item.name} al carrello`}
          >
            {showSuccess ? (
              <>
                <Check size={18} className="animate-scale-in" />
                <span>Aggiunto!</span>
              </>
            ) : (
              <>
                <Plus size={18} className={isAdding ? "animate-spin" : ""} />
                <span>Aggiungi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
