import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json({ success: true, message: "Logged out successfully" });
    res.cookies.set("session", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch (err: unknown) {
    let message = "Logout failed";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 