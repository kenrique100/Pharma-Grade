import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PurchaseStore {
  /** userId -> set of purchased productIds */
  purchases: Record<string, string[]>;
  addPurchase: (userId: string, productIds: string[]) => void;
  hasPurchased: (userId: string, productId: string) => boolean;
}

export const usePurchaseStore = create<PurchaseStore>()(
  persist(
    (set, get) => ({
      purchases: {},

      addPurchase: (userId, productIds) => {
        const existing = get().purchases[userId] ?? [];
        const merged = Array.from(new Set([...existing, ...productIds]));
        set({ purchases: { ...get().purchases, [userId]: merged } });
      },

      hasPurchased: (userId, productId) => {
        return (get().purchases[userId] ?? []).includes(productId);
      },
    }),
    { name: "pharma-purchases" }
  )
);
