import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Review } from "@/types";

interface ReviewStore {
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "createdAt" | "updatedAt">) => void;
  updateReview: (id: string, updates: Pick<Review, "rating" | "comment">) => void;
  deleteReview: (id: string) => void;
  getProductReviews: (productId: string) => Review[];
  getUserReviewForProduct: (userId: string, productId: string) => Review | undefined;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set({ reviews: [...get().reviews, newReview] });
      },

      updateReview: (id, updates) => {
        set({
          reviews: get().reviews.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
          ),
        });
      },

      deleteReview: (id) => {
        set({ reviews: get().reviews.filter((r) => r.id !== id) });
      },

      getProductReviews: (productId) => {
        return get().reviews.filter((r) => r.productId === productId);
      },

      getUserReviewForProduct: (userId, productId) => {
        return get().reviews.find((r) => r.userId === userId && r.productId === productId);
      },
    }),
    { name: "pharma-reviews" }
  )
);
