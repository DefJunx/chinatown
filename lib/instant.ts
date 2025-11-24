import { init, id } from "@instantdb/react";
import type { Order, ConsolidatedOrder } from "@/types";

export interface SystemSettings {
  id: string;
  allowAdminRegistration: boolean;
  updatedAt: number;
}

// Define the schema for InstantDB
export const schema = {
  orders: {} as Order,
  consolidatedOrders: {} as ConsolidatedOrder,
  systemSettings: {} as SystemSettings,
};

// Get the app ID from environment variables
const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID || "";

if (!APP_ID) {
  console.warn(
    "NEXT_PUBLIC_INSTANT_APP_ID is not set. Please add it to your .env.local file."
  );
}

// Initialize InstantDB
export const db = init({
  appId: APP_ID,
});

// Export the id function for generating unique IDs
export { id };

// Export useful types
export type Schema = typeof schema;
