import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/server/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const result = await loginUser(email, password);
    if (result.success) {
      const res = NextResponse.json(result);
      res.cookies.set("session", email, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    } else {
      return NextResponse.json(result, { status: 401 });
    }
  } catch (err: unknown) {
    let message = "Login failed";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
} 