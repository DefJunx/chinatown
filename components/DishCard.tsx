'use client';

import React from 'react';
import type { MenuItem } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Plus } from 'lucide-react';

interface DishCardProps {
  item: MenuItem;
}

export const DishCard: React.FC<DishCardProps> = ({ item }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-primary-700">
            €{item.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus size={18} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

