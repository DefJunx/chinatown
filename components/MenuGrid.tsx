'use client';

import React, { useState, useMemo } from 'react';
import { SearchBar } from './SearchBar';
import { DishCard } from './DishCard';
import { menuData, getAllCategories } from '@/lib/menu-data';

export const MenuGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = getAllCategories();

  // Filter menu items based on search and category
  const filteredMenuData = useMemo(() => {
    return menuData
      .map((category) => {
        // Filter by category
        if (selectedCategory !== 'All' && category.name !== selectedCategory) {
          return null;
        }

        // Filter items by search query
        const filteredItems = category.items.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filteredItems.length === 0) {
          return null;
        }

        return {
          ...category,
          items: filteredItems,
        };
      })
      .filter(Boolean);
  }, [searchQuery, selectedCategory]);

  return (
    <div>
      <SearchBar
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {filteredMenuData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No dishes found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredMenuData.map((category) => (
            <div key={category!.name}>
              <h2 className="text-3xl font-bold text-primary-800 mb-4 pb-2 border-b-2 border-primary-600">
                {category!.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category!.items.map((item) => (
                  <DishCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

