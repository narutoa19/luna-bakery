import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, notes, items, total_amount } = body;

    if (!customer_name || !customer_phone || !items?.length || !total_amount) {
      return NextResponse.json({ error: "缺少必填信息" }, { status: 400 });
    }

    const result = await createOrder({ customer_name, customer_phone, notes, items, total_amount });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "提交失败，请重试" }, { status: 500 });
  }
}
