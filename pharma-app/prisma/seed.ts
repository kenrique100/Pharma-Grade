/**
 * Prisma seed script — run with: npm run db:seed
 *
 * Creates the admin account and a regular demo user in the database.
 * Change the passwords via ADMIN_PASSWORD / USER_PASSWORD env vars,
 * or update the defaults below before running in production.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const SALT_ROUNDS = 12;

  // ── Admin user ────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@pharmagrade.com";
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? "admin123",
    SALT_ROUNDS
  );

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword, role: "admin" },
    create: {
      name: "Admin User",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    },
  });

  console.log(`✅  Admin user upserted: ${admin.email}  (id: ${admin.id})`);

  // ── Demo regular user ─────────────────────────────────────────────────────
  const userPassword = await bcrypt.hash(
    process.env.USER_PASSWORD ?? "user123",
    SALT_ROUNDS
  );

  const user = await prisma.user.upsert({
    where: { email: "user@pharmagrade.com" },
    update: { password: userPassword },
    create: {
      name: "Demo User",
      email: "user@pharmagrade.com",
      password: userPassword,
      role: "user",
    },
  });

  console.log(`✅  Demo user  upserted: ${user.email}   (id: ${user.id})`);
  console.log("\n⚠️  Remember to change the default passwords before going live!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
