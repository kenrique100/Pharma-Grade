/**
 * Prisma seed script — run with: npm run db:seed
 *
 * Creates the admin account and a regular demo user in the database.
 * Change the passwords via ADMIN_PASSWORD / USER_PASSWORD env vars,
 * or update the defaults below before running in production.
 */

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// better-auth uses scrypt for password hashing — import it here for consistent hashes
import { hashPassword } from "better-auth/crypto";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
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

