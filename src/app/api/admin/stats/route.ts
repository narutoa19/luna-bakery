import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getDashboardStats } from "@/lib/db";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "获取数据失败" }, { status: 500 });
  }
}
