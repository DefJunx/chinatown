"use client";

import React, { useState, useMemo } from "react";
import { SearchBar } from "./SearchBar";
import { DishCard } from "./DishCard";
import { menuData, getAllCategories } from "@/lib/menu-data";

export const MenuGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = getAllCategories();

  // Filter menu items based on search and category
  const filteredMenuData = useMemo(() => {
    return menuData
      .map((category) => {
        // Filter by category
        if (selectedCategory !== "All" && category.name !== selectedCategory) {
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
        <div className="py-12 text-center animate-fade-in">
          <p className="text-lg text-gray-500">
            Nessun piatto trovato con i criteri specificati.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredMenuData.map((category, categoryIndex) => (
            <div
              key={category!.name}
              className="animate-fade-in-up"
              style={{ animationDelay: `${categoryIndex * 100}ms` }}
            >
              <h2 className="mb-4 border-b-2 border-primary-600 pb-2 text-3xl font-bold text-primary-800">
                {category!.name}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category!.items.map((item, itemIndex) => (
                  <div
                    key={item.id}
                    style={{ animationDelay: `${(categoryIndex * 100) + (itemIndex * 50)}ms` }}
                  >
                    <DishCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
