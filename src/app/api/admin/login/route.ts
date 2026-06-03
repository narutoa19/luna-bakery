import { NextRequest, NextResponse } from "next/server";
import { validatePassword, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!password || !(await validatePassword(password))) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }

  const token = await signToken();
  return NextResponse.json({ token });
}
