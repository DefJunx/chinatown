"use client";

import React, { useMemo } from "react";
import { db } from "@/lib/instant";
import type { Order } from "@/types";
import { TrendingUp, Award, BarChart3 } from "lucide-react";

export default function StatisticsPage() {
  const { isLoading, error, data } = db.useQuery({
    orders: {},
  });

  // Calculate dish statistics from all orders
  const dishStats = useMemo(() => {
    const orders = (data?.orders || []) as Order[];

    // Aggregate all dishes across all orders
    const dishMap: {
      [key: string]: {
        name: string;
        totalQuantity: number;
        category: string;
        totalRevenue: number;
      }
    } = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (dishMap[item.id]) {
          dishMap[item.id].totalQuantity += item.quantity;
          dishMap[item.id].totalRevenue += item.price * item.quantity;
        } else {
          dishMap[item.id] = {
            name: item.name,
            totalQuantity: item.quantity,
            category: item.category,
            totalRevenue: item.price * item.quantity,
          };
        }
      });
    });

    // Convert to array and sort by quantity
    return Object.entries(dishMap)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity);
  }, [data?.orders]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const orders = (data?.orders || []) as Order[];
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalDishes = dishStats.reduce((sum, dish) => sum + dish.totalQuantity, 0);

    return { totalOrders, totalRevenue, totalDishes };
  }, [data?.orders, dishStats]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="text-gray-600">Caricamento statistiche...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        Errore durante il caricamento delle statistiche: {error.message}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <BarChart3 size={40} className="text-primary-600" />
          <h1 className="text-4xl font-bold text-gray-800">Statistiche Piatti</h1>
        </div>
        <p className="text-lg text-gray-600">
          Scopri cosa preferiscono i nostri clienti
        </p>
      </div>

      {/* Overall Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          icon={<BarChart3 size={32} />}
          title="Ordini Totali"
          value={overallStats.totalOrders.toLocaleString()}
          color="bg-blue-500"
        />
        <StatCard
          icon={<TrendingUp size={32} />}
          title="Piatti Venduti"
          value={overallStats.totalDishes.toLocaleString()}
          color="bg-green-500"
        />
        <StatCard
          icon={<Award size={32} />}
          title="Fatturato Totale"
          value={`€${overallStats.totalRevenue.toFixed(2)}`}
          color="bg-yellow-500"
        />
      </div>

      {/* Most Popular Dishes */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800">
          <TrendingUp className="text-primary-600" />
          Piatti Più Popolari
        </h2>

        {dishStats.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            Nessun ordine ancora. Le statistiche appariranno quando i clienti inizieranno a ordinare!
          </p>
        ) : (
          <div className="space-y-4">
            {dishStats.map((dish, index) => (
              <DishStatCard
                key={dish.id}
                dish={dish}
                rank={index + 1}
                maxQuantity={dishStats[0]?.totalQuantity || 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}

function StatCard({ icon, title, value, color }: StatCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105">
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-full ${color} p-3 text-white`}>{icon}</div>
      </div>
      <p className="mb-1 text-sm font-medium text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

interface DishStatCardProps {
  dish: {
    id: string;
    name: string;
    totalQuantity: number;
    category: string;
    totalRevenue: number;
  };
  rank: number;
  maxQuantity: number;
}

function DishStatCard({ dish, rank, maxQuantity }: DishStatCardProps) {
  const percentage = (dish.totalQuantity / maxQuantity) * 100;

  // Medal colors for top 3
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-400 text-yellow-900";
      case 2:
        return "bg-gray-300 text-gray-700";
      case 3:
        return "bg-amber-600 text-white";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="group rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-primary-300 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Rank Badge */}
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getMedalColor(rank)} font-bold`}
          >
            {rank <= 3 ? <Award size={20} /> : rank}
          </div>

          {/* Dish Info */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">{dish.name}</h3>
            <p className="text-sm text-gray-600">{dish.category}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="text-right">
          <p className="text-2xl font-bold text-primary-700">
            {dish.totalQuantity}
          </p>
          <p className="text-sm text-gray-600">ordini</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2 h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Revenue */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Fatturato</span>
        <span className="font-semibold text-gray-800">
          €{dish.totalRevenue.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

