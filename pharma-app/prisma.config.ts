import path from "node:path";
import { defineConfig } from "prisma/config";
import { loadEnvConfig } from "@next/env";

// Load Next.js env files (.env, .env.local, etc.) so that DATABASE_URL is
// available to Prisma CLI commands (migrate, push, reset) even when they run
// outside of the Next.js runtime (which normally handles env loading).
loadEnvConfig(path.join(__dirname));

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not defined. Copy .env.example to .env.local and fill in the value."
  );
}

export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),

  migrations: {
    path: "prisma/migrations",
    // Used by `prisma migrate reset` and `prisma db seed`
    seed: "tsx prisma/seed.ts",
  },

  datasource: {
    // Prefer DIRECT_URL (non-pooled) for migrations so that Prisma can use
    // DDL transactions that are incompatible with PgBouncer in transaction mode.
    // Falls back to DATABASE_URL if DIRECT_URL is not set.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
