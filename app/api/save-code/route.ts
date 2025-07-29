import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { saveCodeSnippet } from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const { code, language, filename } = await req.json();
    if (!code || !language || !filename) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const email = session.value;
    const snippet = await saveCodeSnippet({
      email,
      language,
      code,
      filename,
    });
    return NextResponse.json({
      success: true,
      message: "Code saved successfully",
      snippet
    });
  } catch (err: unknown) {
    let message = "Save code failed";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 