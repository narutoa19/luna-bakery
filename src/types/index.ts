export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  image_url: string;
  images: string[];
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

export type ProductCategory = "蛋糕" | "面包" | "饼干" | "甜点" | "饮品";

export const CATEGORIES: ProductCategory[] = ["蛋糕", "面包", "饼干", "甜点", "饮品"];

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  "蛋糕": "🎂",
  "面包": "🥐",
  "饼干": "🍪",
  "甜点": "🍮",
  "饮品": "☕",
};

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

export type OrderStatus = "pending" | "confirmed" | "completed";

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  notes: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  created_at: string;
}

export interface AdminAuth {
  token: string;
  expires_at: number;
}
