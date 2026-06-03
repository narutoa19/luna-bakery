import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getAdminOrders } from "@/lib/db";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    const orders = await getAdminOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "获取订单失败" }, { status: 500 });
  }
}
