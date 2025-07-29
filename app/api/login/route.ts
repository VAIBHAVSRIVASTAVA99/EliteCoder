import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/server/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const result = await loginUser(email, password);
    if (result.success) {
      const cookieStore = await cookies();
      cookieStore.set("session", email, { httpOnly: true, path: "/" });
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 401 });
    }
  } catch (err: unknown) {
    let message = "Login failed";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
} 