# 🏥 Pharma Grade — Production Setup Guide

A Next.js 14 pharmaceutical e-commerce app with PostgreSQL (Prisma), better-auth, live chat, and Resend email.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone & install](#1-clone--install)
3. [Database setup](#2-database-setup-postgresql)
4. [Environment variables](#3-environment-variables)
5. [Prisma setup](#4-prisma-setup)
6. [Seed the admin account](#5-seed-the-admin-account)
7. [Local development](#6-local-development)
8. [Production deployment (Vercel)](#7-production-deployment-vercel)
9. [All npm scripts](#8-all-npm-scripts)
10. [Architecture overview](#9-architecture-overview)

---

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| Node.js | 18.x |
| npm | 9.x |
| PostgreSQL | 14 (or use a managed service — see below) |

---

## 1. Clone & install

```bash
git clone https://github.com/kenrique100/Pharma-Grade.git
cd Pharma-Grade/pharma-app
npm install
```

> `npm install` automatically runs `prisma generate` (via `postinstall`) to create the TypeScript client.

---

## 2. Database setup (PostgreSQL)

### ✅ Recommended: Neon (free managed PostgreSQL)

1. Sign up at **https://neon.tech** (free tier — 0.5 GB storage, serverless, auto-scales to zero)
2. Create a new project → copy the **Connection string** (format below)
3. Use it as your `DATABASE_URL`

**Connection string format:**
```
postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

### Alternative providers

| Provider | Free tier | Notes |
|----------|-----------|-------|
| [Supabase](https://supabase.com) | 500 MB | Also includes Auth, Storage |
| [Railway](https://railway.app) | $5 credit/month | Simple UI, instant deploy |
| [Vercel Postgres](https://vercel.com/storage/postgres) | 256 MB | Tight Vercel integration |
| Local PostgreSQL | unlimited | `postgresql://postgres:password@localhost:5432/pharmagrade` |

### Local PostgreSQL (optional)

```bash
# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16
createdb pharmagrade

# Ubuntu / Debian
sudo apt install postgresql
sudo -u postgres createdb pharmagrade
```

---

## 3. Environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in **all** values:

```dotenv
# ── Required ────────────────────────────────────────────────────────
DATABASE_URL=postgresql://USER:PASSWORD@HOST/pharmagrade?sslmode=require
BETTER_AUTH_SECRET=replace-with-a-random-32-char-secret

# ⚠️  For local development always use http://localhost:3000 here.
#     Setting this to the production URL while running locally causes 403 errors.
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# ── Optional: Google OAuth ─────────────────────────────────────────
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=

# ── Optional: Resend (live-chat email notifications) ──────────────
# RESEND_API_KEY=re_...
# ADMIN_EMAIL=admin@yourdomain.com
# FROM_EMAIL=support@yourdomain.com

# ── Optional: Override seed-script passwords ───────────────────────
# ADMIN_PASSWORD=change-me-in-production
# USER_PASSWORD=change-me-in-production
```

Generate `BETTER_AUTH_SECRET`:
```bash
openssl rand -base64 32
# or visit https://generate-secret.vercel.app/32
```

---

## 4. Prisma setup

### First time (development)

```bash
# Create the database tables from the schema
npm run db:push

# Or, to create a tracked migration (recommended for production):
npx prisma migrate dev --name init
```

### First time (production / Vercel)

```bash
# Apply all pending migrations on the production database
npm run db:migrate
```

> On **Vercel**, add a `Build & Development Settings` → Build Command override:
> `npm run build` already runs `prisma generate && next build` automatically.

---

## 5. Seed the admin account

```bash
npm run db:seed
```

This creates (or updates) two users in the database:

| Email | Password | Role |
|-------|----------|------|
| `admin@pharmagrade.com` | `admin123` | admin |
| `user@pharmagrade.com` | `user123` | user |

**⚠️ Change these passwords before going live!**
Set `ADMIN_PASSWORD` and `USER_PASSWORD` in `.env.local` before seeding, or update directly in the database.

---

## 6. Local development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)
- Prisma Studio (visual DB editor): `npm run db:studio`

---

## 7. Production deployment (Vercel)

### Step-by-step

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → import the repo
3. Set **Root Directory** to `pharma-app`
4. Add these **Environment Variables** in Vercel Dashboard → Settings → Environment Variables:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Neon / Supabase connection string |
   | `BETTER_AUTH_SECRET` | Random 32-char secret (`openssl rand -base64 32`) |
   | `BETTER_AUTH_URL` | `https://your-app.vercel.app` |
   | `NEXT_PUBLIC_BETTER_AUTH_URL` | `https://your-app.vercel.app` |
   | `BETTER_AUTH_TRUSTED_ORIGINS` | `https://your-app.vercel.app` (same as above) |
   | `RESEND_API_KEY` | Your Resend key (optional) |
   | `ADMIN_EMAIL` | Admin email for chat notifications (optional) |
   | `FROM_EMAIL` | Sender address — must be a verified Resend domain (optional) |

5. Deploy → after deployment, run the seed **once** via a local terminal pointed at the production DB:

```bash
# 1. Apply all pending migrations to the production database
npm run db:migrate

# 2. Seed the admin and demo users (only needed once)
npm run db:seed

# 3. Start the production server (on a self-hosted machine)
npm run build
npm run start
```

> On **Vercel** the build step runs automatically on every push.
> Run `db:migrate` and `db:seed` locally with `DATABASE_URL` pointed at the production DB.

---

## 8. All npm scripts

```bash
npm run dev          # Start Next.js in development mode (http://localhost:3000)
npm run build        # prisma generate + next build (production build)
npm run start        # Start production server
npm run lint         # ESLint

npm run db:generate  # (Re-)generate Prisma TypeScript client
npm run db:push      # Push schema to DB without migrations (quick dev setup)
npm run db:migrate   # Apply pending migrations (production-safe)
npm run db:seed      # Seed admin + demo users into the database
npm run db:studio    # Open Prisma Studio visual editor at http://localhost:5555
npm run db:reset     # ⚠️  Drop & recreate DB, re-run all migrations + seed
```

---

## 9. Architecture overview

```
pharma-app/
├── prisma/
│   ├── schema.prisma   # Database schema (User, ChatMessage)
│   └── seed.ts         # Admin + demo user seed script
│
├── src/
│   ├── lib/
│   │   ├── db.ts           # Prisma client singleton (dev-safe)
│   │   ├── auth.config.ts  # Edge-safe NextAuth config (no Prisma/Node.js)
│   │   ├── auth.ts         # Full NextAuth config (Prisma + bcrypt, Node.js only)
│   │   ├── adminStore.ts   # Zustand store for products/categories (localStorage)
│   │   └── cart.ts         # Zustand cart store (localStorage)
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/   # NextAuth API handler
│   │   │   └── chat/                 # Live-chat API (persisted in PostgreSQL)
│   │   ├── admin/                    # Admin panel (protected server components)
│   │   ├── login/                    # Sign-in page
│   │   └── register/                 # Registration page
│   │
│   └── middleware.ts   # Edge middleware — uses auth.config.ts (no Node.js)
│
└── .env.example        # All environment variables documented
```

### Database tables

| Table | Purpose |
|-------|---------|
| `User` | Authentication — stores hashed passwords and roles |
| `ChatMessage` | Live support chat — persisted across server restarts |

### Auth flow

```
Login form → /api/auth/signin (Node.js)
           → auth.ts authorize() → prisma.user.findUnique()
           → bcrypt.compare() → JWT cookie set
           → redirect to /

Middleware (Edge) → reads JWT from cookie via auth.config.ts
                  → no Prisma / bcrypt in edge
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `403 FORBIDDEN` / `Invalid origin: http://localhost:3000` | `BETTER_AUTH_URL` is set to the production URL. Change it to `http://localhost:3000` in `.env.local` for local development |
| `SASL: client password must be a string` | `DATABASE_URL` is not set — copy `.env.example` to `.env.local` and fill in the value |
| `PrismaClientInitializationError` | Check `DATABASE_URL` is set and the DB is reachable |
| `Can't reach database server` | For Neon: enable **pooled connection** mode in the dashboard |
| Build fails with `prisma generate` | Run `npm install` first, then `npm run db:generate` |
| Admin login fails | Run `npm run db:seed` to create the admin user |
| `BETTER_AUTH_SECRET` error | Generate with `openssl rand -base64 32` and add to `.env.local` |
| Edge runtime error | Ensure `middleware.ts` does not import from `auth.ts` (Node.js only) |

