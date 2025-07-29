import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCodeSnippetsByEmail } from "@/server/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const email = session.value;
    const snippets = await getCodeSnippetsByEmail(email);
    return NextResponse.json({
      success: true,
      snippets
    });
  } catch (err: unknown) {
    let message = "Fetch saved codes failed";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 