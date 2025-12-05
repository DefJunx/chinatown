export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  totalPrice: number;
  status: "pending" | "consolidated" | "completed";
  createdAt: number;
  forks?: number;
  chopsticks?: number;
}

export interface ConsolidatedOrder {
  id: string;
  orderIds: string[];
  items: { [key: string]: { name: string; quantity: number; price: number } };
  totalPrice: number;
  status: "pending" | "completed";
  createdAt: number;
  adminId: string;
  forks?: number;
  chopsticks?: number;
}
