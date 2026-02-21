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
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
