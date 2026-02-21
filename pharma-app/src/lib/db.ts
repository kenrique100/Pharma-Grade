import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

/**
 * Get or create a pg Pool singleton.
 * Race condition protection: only one pool is created even if multiple
 * module evaluations happen (e.g. Next.js hot-reload in development).
 * Validation happens here so runtime misconfigurations are caught early.
 */
const getPool = (): Pool => {
  if (globalForPrisma.pool) {
    return globalForPrisma.pool;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is not set. Please configure it before starting the application."
    );
  }

  const pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 20_000,
    allowExitOnIdle: false,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  });

  pool.on("error", (err) => {
    console.error("❌ Unexpected error on idle database client:", err);
  });

  // Persist pool across hot-reloads in development
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
  }

  return pool;
};

const getOrCreateClient = (): PrismaClient => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const pool = getPool();
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log: ["error", "warn"],
    errorFormat: "pretty",
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
};

/**
 * Lazy Prisma client — the pool and client are created on first use,
 * so importing this module during Next.js build does not require DATABASE_URL.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return (getOrCreateClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

/** @deprecated Use `db` instead */
export const prisma = db;

// ── Graceful shutdown ─────────────────────────────────────────────────────────

let isCleaningUp = false;

const cleanup = async () => {
  if (isCleaningUp) return;
  isCleaningUp = true;

  try {
    const client = globalForPrisma.prisma;
    if (client) await client.$disconnect();
    const pool = globalForPrisma.pool;
    if (pool) await pool.end();
  } catch (error) {
    console.error("❌ Error during database cleanup:", error);
  }
};

process.on("beforeExit", cleanup);
process.on("SIGINT", async () => {
  await cleanup();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await cleanup();
  process.exit(0);
});

