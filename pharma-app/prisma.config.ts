import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma 7: prisma.config.ts can override the datasource URL for CLI commands
// (migrate, push, reset). The schema.prisma still declares url = env("DATABASE_URL")
// for Prisma Client and other tooling.
export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
