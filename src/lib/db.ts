import { supabase } from "./supabase";
import { Product, ProductCategory } from "@/types";

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
