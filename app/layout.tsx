import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ristorante Cinese - Ordina Online",
  description: "Ordina deliziosi piatti cinesi online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        <CartProvider>{children}</CartProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
