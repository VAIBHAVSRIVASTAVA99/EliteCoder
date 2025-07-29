"use server"
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
 
  if (request.nextUrl.pathname.startsWith("/editor")) {

    const session = request.cookies.get("session");
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/editor"],
}; 