/**
 * Full NextAuth configuration — Node.js only (NOT edge-compatible).
 *
 * Extends the edge-safe authConfig with the Credentials provider (which
 * needs Prisma + bcrypt) and the optional Google OAuth provider.
 *
 * ⚠️  Import this file only in:
 *   • src/app/api/auth/[...nextauth]/route.ts
 *   • Server components / layouts (e.g. admin/layout.tsx)
 *
 *   The middleware (Edge Runtime) imports from auth.config.ts instead.
 */
import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { prisma } from "./db";

const providers: NextAuthConfig["providers"] = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string },
        select: { id: true, name: true, email: true, password: true, role: true },
      });

      if (!user || !user.password) return null;

      const isValid = await bcrypt.compare(
        credentials.password as string,
        user.password
      );
      if (!isValid) return null;

      return { id: user.id, name: user.name, email: user.email, role: user.role };
    },
  }),
];

// Add Google provider only when OAuth credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }) as any
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  secret: process.env.AUTH_SECRET,
});
