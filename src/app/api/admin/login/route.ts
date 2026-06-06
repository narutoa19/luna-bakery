import { NextRequest, NextResponse } from "next/server";
import { validatePassword, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = body?.password;

    if (!password || !(await validatePassword(password))) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    const token = await signToken();
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
}
