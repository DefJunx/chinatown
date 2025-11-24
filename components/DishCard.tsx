"use client";

import React from "react";
import type { MenuItem } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { Plus } from "lucide-react";

interface DishCardProps {
  item: MenuItem;
}

export const DishCard: React.FC<DishCardProps> = ({ item }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow duration-200 hover:shadow-lg">
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-800">
          {item.name}
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-700">
            €{item.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-primary-700"
            aria-label={`Aggiungi ${item.name} al carrello`}
          >
            <Plus size={18} />
            <span>Aggiungi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
