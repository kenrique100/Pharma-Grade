/**
 * Next.js Middleware (Edge Runtime)
 *
 * Uses the edge-safe NextAuth config (no Prisma / Node.js modules).
 * Route-level protection:
 *   • /checkout, /account  — require any logged-in user
 *   • /admin/*             — require logged-in user (role check is inside admin/layout.tsx)
 */
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/checkout", "/account", "/admin/:path*"],
};
