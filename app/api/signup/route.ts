import { NextRequest, NextResponse } from "next/server";
import { signupUser } from "@/server/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    const result = await signupUser(name, email, password);
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
      return NextResponse.json(result, { status: 400 });
    }
  } catch (err: unknown) {
    let message = "Signup failed";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
} 