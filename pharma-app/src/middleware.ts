/**
 * Next.js Middleware
 *
 * Uses better-auth session cookie to protect routes.
 * Route-level protection:
 *   • /checkout, /account  — require any logged-in user
 *   • /admin/*             — require logged-in user (role check is inside admin/layout.tsx)
 */
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout", "/account", "/admin/:path*"],
};
