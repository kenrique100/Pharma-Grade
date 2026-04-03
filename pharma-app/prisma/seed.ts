/**
 * Prisma seed script — run with: npm run db:seed
 *
 * Creates the admin account and a regular demo user in the database.
 * Change the passwords via ADMIN_PASSWORD / USER_PASSWORD env vars,
 * or update the defaults below before running in production.
 */

import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// better-auth uses scrypt for password hashing — import it here for consistent hashes
import { hashPassword } from "better-auth/crypto";

// Load Next.js env files (.env, .env.local, etc.) so DATABASE_URL is available
// when the seed script runs outside of the Next.js runtime (e.g. `tsx prisma/seed.ts`).
loadEnvConfig(path.join(__dirname, ".."));

if (!process.env.DATABASE_URL) {
  console.error(
    "❌ DATABASE_URL is not set. Copy .env.example to .env.local and fill in the value."
  );
  process.exit(1);
}

// Prefer DIRECT_URL (non-pooled) so that the seed script bypasses PgBouncer,
// which can hide freshly-migrated tables when running in transaction mode.
const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Admin user ────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@pharmagrade.com";
  const adminRawPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const adminPasswordHash = await hashPassword(adminRawPassword);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "admin", emailVerified: true },
    create: {
      id: crypto.randomUUID(),
      name: "Admin User",
      email: adminEmail,
      emailVerified: true,
      role: "admin",
    },
  });

  // Create or update the credential account for admin
  const existingAdminAccount = await prisma.account.findFirst({
    where: { userId: admin.id, providerId: "credential" },
  });
  if (existingAdminAccount) {
    await prisma.account.update({
      where: { id: existingAdminAccount.id },
      data: { password: adminPasswordHash },
    });
  } else {
    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: adminEmail,
        providerId: "credential",
        userId: admin.id,
        password: adminPasswordHash,
      },
    });
  }

  console.log(`✅  Admin user upserted: ${admin.email}  (id: ${admin.id})`);

  // ── Demo regular user ─────────────────────────────────────────────────────
  const userEmail = "user@pharmagrade.com";
  const userRawPassword = process.env.USER_PASSWORD ?? "user123";
  const userPasswordHash = await hashPassword(userRawPassword);

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: { emailVerified: true },
    create: {
      id: crypto.randomUUID(),
      name: "Demo User",
      email: userEmail,
      emailVerified: true,
      role: "user",
    },
  });

  const existingUserAccount = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
  });
  if (existingUserAccount) {
    await prisma.account.update({
      where: { id: existingUserAccount.id },
      data: { password: userPasswordHash },
    });
  } else {
    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: userEmail,
        providerId: "credential",
        userId: user.id,
        password: userPasswordHash,
      },
    });
  }

  console.log(`✅  Demo user  upserted: ${user.email}   (id: ${user.id})`);

  // ── Seed products ─────────────────────────────────────────────────────────
  const products = [
    {
      name: 'Vitamin Supplement',
      description: 'Premium pharmaceutical grade vitamin supplement with 99% purity',
      price: 29.99,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663441035103/W4T3ujXrmJtV596ssnAB6c/pharma-vitamin-bottle-nog5rqckT7ioVSkN4Htksg.webp',
      category: 'vitamins',
      badge: 'Best Seller',
      stock: 150,
      featured: true,
    },
    {
      name: 'Capsule Pills',
      description: 'High-potency pharmaceutical capsules for daily wellness',
      price: 34.99,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663441035103/W4T3ujXrmJtV596ssnAB6c/pharma-capsule-pills-fd7Qb953X9K79r74QvuPqi.webp',
      category: 'capsules',
      badge: 'Lab Tested',
      stock: 120,
      featured: true,
    },
    {
      name: 'Tablet Blister Pack',
      description: 'Pharmaceutical grade tablets in convenient blister packaging',
      price: 24.99,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663441035103/W4T3ujXrmJtV596ssnAB6c/pharma-tablet-blister-8wYgjAySkMBcQzjJkMtFSs.webp',
      category: 'tablets',
      badge: null,
      stock: 200,
      featured: false,
    },
    {
      name: 'Powder Container',
      description: 'Pure pharmaceutical powder for precise dosing',
      price: 39.99,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663441035103/W4T3ujXrmJtV596ssnAB6c/pharma-powder-container-bpuVNuXhZycUXkFDb26f69.webp',
      category: 'powders',
      badge: 'Premium',
      stock: 80,
      featured: true,
    },
    {
      name: 'Liquid Medicine',
      description: 'Pharmaceutical liquid medicine with dropper applicator',
      price: 44.99,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663441035103/W4T3ujXrmJtV596ssnAB6c/pharma-liquid-medicine-V2ihHjzvxneMkNpAV7yQNj.webp',
      category: 'liquids',
      badge: 'New',
      stock: 100,
      featured: true,
    },
  ];

  // Clear existing products
  await prisma.product.deleteMany();

  // Create new products
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`✅  Created ${products.length} pharmaceutical products`);
  console.log("\n⚠️  Remember to change the default passwords before going live!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

