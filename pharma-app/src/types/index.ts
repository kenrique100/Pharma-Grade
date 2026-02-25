export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  badge?: "Best Seller" | "New" | "Sale";
  licenceUrl?: string;
  /** Number of tablets / capsules / vials per pack */
  unitsPerPack?: number;
  /** Dose per unit, e.g. "20mg", "100mg/mL", "10IU" */
  dosePerUnit?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  image?: string;
}
