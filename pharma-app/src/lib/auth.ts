
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/send-verification-email";
import { sendResetPasswordEmail } from "@/lib/send-reset-password-email";
import { ac, roles } from "@/lib/permissions";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    // Always trust the configured app URL (works in both dev and prod)
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    // Always trust localhost in non-production environments
    ...(process.env.NODE_ENV !== "production" ? ["http://localhost:3000"] : []),
    // Any additional origins supplied via env var (comma-separated)
    ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS
      ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((o) => o.trim())
      : []),
  ],

  session: {
    expiresIn: 60 * 60,       // 1 hour
    updateAge: 60 * 5,         // refresh every 5 minutes
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      if (!user?.email) throw new Error("User email is required for password reset");
      await sendResetPasswordEmail({
        to: user.email,
        subject: "Reset your Pharma Grade password",
        url,
      });
    },
  },

  // Rate limiting — race condition / brute-force protection
  rateLimit: {
    enabled: true,
    window: 60,   // seconds
    max: 10,      // max requests per window
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      if (!user?.email) throw new Error("User email is required for verification");
      const verificationUrl = new URL(url);
      verificationUrl.searchParams.set("callbackURL", "/");
      await sendVerificationEmail({
        to: user.email,
        verificationUrl: verificationUrl.toString(),
        userName: user.name,
      });
    },
  },

  user: {
    additionalFields: {
      gender: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectURI: `${process.env.BETTER_AUTH_URL ?? ""}/api/auth/callback/google`,
          },
        }
      : {}),
  },

  plugins: [
    admin({
      ac,
      roles,
      defaultRole: "user",
      adminRoles: ["admin", "superadmin"],
    }),

    // Sets the auth cookie automatically in Next.js server actions / route handlers
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
