/**
 * Edge-safe NextAuth configuration.
 *
 * This file MUST NOT import Prisma, bcrypt, or any other Node.js-only module.
 * It is used by middleware.ts (Edge Runtime) and extended by auth.ts (Node.js).
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" as const },
  callbacks: {
    /**
     * Called every time a JWT is created or updated.
     * We embed the user role so it is available in the session.
     */
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role ?? "user";
      return token;
    },
    /**
     * Makes `session.user.role` available in client components.
     */
    session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string;
      return session;
    },
    /**
     * Runs in the Edge Runtime (middleware).
     * Returns true to allow the request, false to redirect to signIn page.
     */
    authorized({ auth }) {
      // Simply require a valid session for all matched routes.
      // Admin-role enforcement is handled inside /admin/layout.tsx.
      return !!auth?.user;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
