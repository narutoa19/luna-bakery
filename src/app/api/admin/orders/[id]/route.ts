import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { updateOrderStatus } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    const { status } = await request.json();
    await updateOrderStatus(params.id, status);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新订单失败" }, { status: 500 });
  }
}
