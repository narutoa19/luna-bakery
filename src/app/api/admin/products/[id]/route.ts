import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { updateProduct, deleteProduct } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    const body = await request.json();
    await updateProduct(params.id, body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新产品失败" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    await deleteProduct(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "删除产品失败" }, { status: 500 });
  }
}
