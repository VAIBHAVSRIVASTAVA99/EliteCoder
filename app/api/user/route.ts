import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserByEmail } from "@/server/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const email = session.value;
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (err: unknown) {
    let message = "Fetch user failed";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 