import { init } from "@instantdb/react";
import type { Order, ConsolidatedOrder } from "@/types";

// Define the schema for InstantDB
export const schema = {
  orders: {} as Order,
  consolidatedOrders: {} as ConsolidatedOrder,
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

// Export useful types
export type Schema = typeof schema;
