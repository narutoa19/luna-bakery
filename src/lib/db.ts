import { supabase, supabaseAdmin } from "./supabase";
import { Product, ProductCategory, OrderStatus, Order } from "@/types";
import { generateOrderId } from "./utils";

// -- Public Read --

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(4);
  if (error) throw error;
  return data as Product[];
}

export async function getAllActiveProducts(category?: ProductCategory): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return data as Product;
}

export async function createOrder(data: {
  customer_name: string;
  customer_phone: string;
  notes: string;
  items: { product_id: string; name: string; price: number; quantity: number; size?: string }[];
  total_amount: number;
}): Promise<{ id: string }> {
  const id = generateOrderId();
  const { error } = await supabase
    .from("orders")
    .insert({
      id,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      notes: data.notes,
      items: JSON.stringify(data.items),
      total_amount: data.total_amount,
      status: "pending",
    });
  if (error) throw error;
  return { id };
}

// -- Admin Queries --

export async function getAdminProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Product[];
}

export async function getAdminOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Order[];
}

export async function getAdminOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Order;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function createProduct(product: Omit<Product, "id" | "created_at">): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .insert(product)
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const { error } = await supabaseAdmin
    .from("products")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function getDashboardStats(): Promise<{
  newOrders: number;
  activeProducts: number;
  todayRevenue: number;
  recentOrders: Order[];
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [ordersResult, productsResult] = await Promise.all([
    supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("products").select("*").eq("is_active", true),
  ]);

  const orders = (ordersResult.data || []) as Order[];
  const activeProducts = (productsResult.data || []).length;

  const newOrders = orders.filter((o) => o.status === "pending").length;
  const todayRevenue = orders
    .filter((o) => o.status !== "pending" && new Date(o.created_at) >= today)
    .reduce((sum, o) => sum + o.total_amount, 0);

  return {
    newOrders,
    activeProducts,
    todayRevenue,
    recentOrders: orders.slice(0, 5),
  };
}
