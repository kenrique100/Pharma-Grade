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
}
