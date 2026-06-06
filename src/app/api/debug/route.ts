import { NextResponse } from "next/server";
import { getAllActiveProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const all = await getAllActiveProducts();
    const featured = all.filter((p) => p.is_featured).slice(0, 4);
    return NextResponse.json({
      count: featured.length,
      products: featured.map((p) => ({
        id: p.id,
        name: p.name,
        is_active: p.is_active,
        is_featured: p.is_featured,
      })),
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...",
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
