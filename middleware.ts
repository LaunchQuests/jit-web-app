import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jit_portal_session")?.value;
  const { pathname } = request.nextUrl;

  if ((pathname.startsWith("/follow-ups") || pathname.startsWith("/admin")) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/follow-ups/:path*", "/admin/:path*"]
};