"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/contexts/CartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <CartProvider>
        {children}
      </CartProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: "#1f2937", color: "#f9fafb", border: "1px solid #374151" },
          success: { style: { background: "#14532d", color: "#bbf7d0", border: "1px solid #166534" } },
          error: { style: { background: "#7f1d1d", color: "#fecaca", border: "1px solid #991b1b" } },
        }}
      />
    </ThemeProvider>
  );
}
