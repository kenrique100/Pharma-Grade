import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma 7: datasource `url` is no longer supported in schema files.
// Connection URLs for Migrate must be declared here instead.
export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
