import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, Category } from "@/types";
import { products as defaultProducts, categories as defaultCategories } from "@/lib/products";

export type PromotionType = "none" | "percentage" | "fixed" | "bogo";

export interface AdminProduct extends Product {
  promotionType: PromotionType;
  promotionValue: number;
}

interface AdminStore {
  products: AdminProduct[];
  categories: Category[];
  addProduct: (p: Omit<AdminProduct, "id" | "slug">) => void;
  updateProduct: (id: string, p: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (c: Omit<Category, "slug">) => void;
  updateCategory: (slug: string, c: Partial<Category>) => void;
  deleteCategory: (slug: string) => void;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const adminProducts: AdminProduct[] = defaultProducts.map((p) => ({
  ...p,
  promotionType: (p.originalPrice ? "percentage" : "none") as PromotionType,
  promotionValue: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
}));

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      products: adminProducts,
      categories: defaultCategories,

      addProduct: (p) => {
        const id = (Date.now()).toString();
        const slug = slugify(p.name);
        set({ products: [...get().products, { ...p, id, slug }] });
      },

      updateProduct: (id, p) => {
        set({
          products: get().products.map((prod) =>
            prod.id === id ? { ...prod, ...p } : prod
          ),
        });
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
      },

      addCategory: (c) => {
        const slug = slugify(c.name);
        set({ categories: [...get().categories, { ...c, slug }] });
      },

      updateCategory: (slug, c) => {
        set({
          categories: get().categories.map((cat) =>
            cat.slug === slug ? { ...cat, ...c } : cat
          ),
        });
      },

      deleteCategory: (slug) => {
        set({ categories: get().categories.filter((c) => c.slug !== slug) });
      },
    }),
    { name: "pharma-admin" }
  )
);
