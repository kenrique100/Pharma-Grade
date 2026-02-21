import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma client for Next.js.
 *
 * In development, hot-reloading would create a new PrismaClient on every
 * module reload, exhausting the connection pool.  We attach the instance to
 * the global object so it persists across HMR reloads.
 *
 * In production each serverless function gets its own process, so we always
 * create a fresh client (and it is NOT attached to global).
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
