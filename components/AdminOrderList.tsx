'use client';

import React, { useState, useMemo } from 'react';
import { db } from '@/lib/instant';
import type { Order } from '@/types';
import { Check, Copy, LogOut, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const AdminOrderList: React.FC = () => {
  const router = useRouter();
  const { user } = db.useAuth();
  const { isLoading, error, data } = db.useQuery({ orders: {} });
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [copiedText, setCopiedText] = useState('');

  const orders = (data?.orders || []) as Order[];

  // Group orders by status
  const ordersByStatus = useMemo(() => {
    return {
      pending: orders.filter((o) => o.status === 'pending'),
      consolidated: orders.filter((o) => o.status === 'consolidated'),
      completed: orders.filter((o) => o.status === 'completed'),
    };
  }, [orders]);

  const handleSelectOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleConsolidateOrders = async () => {
    if (selectedOrders.size === 0) return;

    const ordersToConsolidate = orders.filter((o) => selectedOrders.has(o.id));

    // Aggregate items
    const itemsMap: { [key: string]: { name: string; quantity: number; price: number } } = {};
    let totalPrice = 0;

    ordersToConsolidate.forEach((order) => {
      order.items.forEach((item) => {
        if (itemsMap[item.id]) {
          itemsMap[item.id].quantity += item.quantity;
        } else {
          itemsMap[item.id] = {
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          };
        }
      });
      totalPrice += order.totalPrice;
    });

    try {
      // Create consolidated order
      const consolidatedId = db.id();
      await db.transact([
        db.tx.consolidatedOrders[consolidatedId].update({
          orderIds: Array.from(selectedOrders),
          items: itemsMap,
          totalPrice,
          status: 'pending',
          createdAt: Date.now(),
          adminId: user?.id || 'unknown',
        }),
        // Mark orders as consolidated
        ...ordersToConsolidate.map((order) =>
          db.tx.orders[order.id].update({ status: 'consolidated' })
        ),
      ]);

      setSelectedOrders(new Set());
      alert('Orders consolidated successfully!');
    } catch (err) {
      console.error('Failed to consolidate orders:', err);
      alert('Failed to consolidate orders. Please try again.');
    }
  };

  const handleMarkAsCompleted = async (orderId: string) => {
    try {
      await db.transact([db.tx.orders[orderId].update({ status: 'completed' })]);
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status.');
    }
  };

  const handleCopyConsolidated = () => {
    const ordersToConsolidate = orders.filter((o) => selectedOrders.has(o.id));

    if (ordersToConsolidate.length === 0) return;

    const itemsMap: { [key: string]: { name: string; quantity: number } } = {};
    ordersToConsolidate.forEach((order) => {
      order.items.forEach((item) => {
        if (itemsMap[item.id]) {
          itemsMap[item.id].quantity += item.quantity;
        } else {
          itemsMap[item.id] = {
            name: item.name,
            quantity: item.quantity,
          };
        }
      });
    });

    const text = Object.values(itemsMap)
      .map((item) => `${item.quantity}x ${item.name}`)
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 3000);
  };

  const handleLogout = async () => {
    await db.auth.signOut();
    router.push('/admin/login');
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        Error loading orders: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Consolidate Actions */}
      {selectedOrders.size > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-primary-800 font-medium">
              {selectedOrders.size} order(s) selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCopyConsolidated}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300 transition-colors"
              >
                <Copy size={18} />
                Copy List
              </button>
              <button
                onClick={handleConsolidateOrders}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Package size={18} />
                Consolidate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copied notification */}
      {copiedText && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium mb-2">Copied to clipboard:</p>
          <pre className="text-sm text-green-700 whitespace-pre-wrap">{copiedText}</pre>
        </div>
      )}

      {/* Pending Orders */}
      <div>
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
            {ordersByStatus.pending.length}
          </span>
          Pending Orders
        </h3>
        {ordersByStatus.pending.length === 0 ? (
          <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
            No pending orders
          </p>
        ) : (
          <div className="space-y-4">
            {ordersByStatus.pending.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={selectedOrders.has(order.id)}
                onSelect={handleSelectOrder}
                onMarkCompleted={handleMarkAsCompleted}
                showSelect={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Consolidated Orders */}
      <div>
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
            {ordersByStatus.consolidated.length}
          </span>
          Consolidated Orders
        </h3>
        {ordersByStatus.consolidated.length === 0 ? (
          <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
            No consolidated orders
          </p>
        ) : (
          <div className="space-y-4">
            {ordersByStatus.consolidated.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={false}
                onSelect={handleSelectOrder}
                onMarkCompleted={handleMarkAsCompleted}
                showSelect={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Orders */}
      <div>
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
            {ordersByStatus.completed.length}
          </span>
          Completed Orders
        </h3>
        {ordersByStatus.completed.length === 0 ? (
          <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
            No completed orders
          </p>
        ) : (
          <div className="space-y-4">
            {ordersByStatus.completed.slice(0, 10).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={false}
                onSelect={handleSelectOrder}
                onMarkCompleted={handleMarkAsCompleted}
                showSelect={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface OrderCardProps {
  order: Order;
  isSelected: boolean;
  onSelect: (orderId: string) => void;
  onMarkCompleted: (orderId: string) => void;
  showSelect: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isSelected,
  onSelect,
  onMarkCompleted,
  showSelect,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 transition-all ${
        isSelected ? 'border-primary-500' : 'border-gray-200'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            {showSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(order.id)}
                className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
            )}
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-800">{order.customerName}</h4>
              <p className="text-gray-600">{order.customerPhone}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <span className="text-xl font-bold text-primary-700">
            €{order.totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="bg-gray-50 rounded p-3 mb-3">
          <h5 className="font-semibold text-gray-700 mb-2">Items:</h5>
          <ul className="space-y-1">
            {order.items.map((item) => (
              <li key={item.id} className="text-gray-700 flex justify-between">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {order.status === 'pending' && (
          <button
            onClick={() => onMarkCompleted(order.id)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <Check size={18} />
            Mark as Completed
          </button>
        )}
      </div>
    </div>
  );
};

