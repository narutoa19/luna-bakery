import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getAdminProducts, createProduct } from "@/lib/db";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    const products = await getAdminProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "获取产品失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const id = await createProduct(body);
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: "创建产品失败" }, { status: 500 });
  }
}
