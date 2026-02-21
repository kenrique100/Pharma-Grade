# Pharma Grade E-Commerce Application

A complete Next.js 14 e-commerce application for pharmaceutical grade supplements.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5 (Beta)
- **State Management**: Zustand (with persistence)
- **Password Hashing**: bcryptjs

## Features

- 🛍️ **Product Catalog**: 21 products across 6 categories
- 🔍 **Search & Filter**: Real-time search, category filter, and sorting
- 🛒 **Shopping Cart**: Persistent cart with quantity management
- 💳 **Checkout**: Complete checkout flow with order confirmation
- 🔐 **Authentication**: Login/register with NextAuth credentials
- 👤 **User Account**: Profile page with account management
- 🔧 **Admin Dashboard**: Product, order, and user management

## Categories

- 💊 Orals
- 💉 Injectables
- 🧬 Peptides
- 🛡️ PCT (Post Cycle Therapy)
- 🔥 Fat Loss
- ❤️ Sexual Health

## Getting Started

```bash
cd pharma-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

- **Admin**: admin@pharmagrade.com / admin123
- **User**: user@pharmagrade.com / user123

## Project Structure

```
pharma-app/
├── public/
│   └── images/
│       ├── logo.webp
│       └── products/     # Product images (copied from original site)
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/auth/     # NextAuth API route
│   │   ├── admin/        # Admin dashboard (admin role only)
│   │   │   ├── products/ # Product management
│   │   │   ├── orders/   # Order management
│   │   │   └── users/    # User management
│   │   ├── categories/   # Category pages
│   │   ├── products/     # Product pages + [slug] detail
│   │   ├── cart/         # Shopping cart
│   │   ├── checkout/     # Checkout flow (protected)
│   │   ├── account/      # User account (protected)
│   │   ├── login/        # Authentication
│   │   └── register/     # Registration
│   ├── components/       # Reusable components
│   ├── lib/              # Utilities (auth, cart, products)
│   ├── types/            # TypeScript types
│   └── middleware.ts     # Route protection
```

## Environment Setup

```bash
cd pharma-app
cp .env.example .env.local
# Edit .env.local — set AUTH_SECRET (generate at https://generate-secret.vercel.app/32)
# and set NEXTAUTH_URL to http://localhost:3000 for local dev
```

## 🔮 Future Recommendations

### High Priority (Implement Next)
- **Real Database** — PostgreSQL + Prisma ORM to replace JSON data store
- **Payment Integration** — Stripe or PayPal for real payments
- **Email Notifications** — Order confirmations via Resend or SendGrid
- **Product Search** — Algolia or PostgreSQL full-text search
- **Image Upload** — Admin product image management with Cloudinary or AWS S3

### Medium Priority
- **Order Tracking** — Real status updates with tracking numbers
- **Inventory Management** — Live stock tracking per product/variant
- **Discount Codes** — Coupon and promotional code system
- **Product Reviews** — User reviews with admin moderation
- **Wishlist** — Save products for later
- **Related Products** — AI-driven "You may also like" recommendations

### Advanced Features
- **Analytics Dashboard** — Real revenue/sales charts (Recharts or Chart.js)
- **SMS Notifications** — Twilio for shipping updates
- **Multi-Currency** — Currency conversion for international customers
- **PWA** — Progressive Web App support (offline-first)
- **SEO Optimization** — Dynamic sitemaps, JSON-LD structured data
- **Redis Cache** — Cache product listings for performance

## 🛠️ Extra Tools Needed (Not Included)

```bash
# Database (ORM)
npm install prisma @prisma/client
npx prisma init

# Payments
npm install stripe @stripe/stripe-js

# Email
npm install resend

# Image storage
npm install cloudinary

# Charts for admin analytics
npm install recharts

# Form validation
npm install zod react-hook-form @hookform/resolvers

# Search
npm install algoliasearch react-instantsearch

# Testing
npm install --save-dev jest @testing-library/react @testing-library/jest-dom cypress

# SMS
npm install twilio
```

## 🚢 Deployment

### Vercel (Recommended)

The Next.js app lives in the `pharma-app/` subdirectory. The `vercel.json` at the repo root already handles this automatically — just connect the repository to Vercel and it will build correctly.

**Required environment variables** (Vercel Dashboard → Settings → Environment Variables):

| Variable | Value |
|---|---|
| `AUTH_SECRET` | A random 32-byte secret. Generate one at [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) or run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your production URL, e.g. `https://your-app.vercel.app` |

**Step-by-step:**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import this repo
3. In **Settings → Environment Variables**, add `AUTH_SECRET` and `NEXTAUTH_URL`
4. Click **Deploy**

> **Getting `AUTH_SECRET`**: Visit [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) to generate a secure random secret, or run `openssl rand -base64 32` in your terminal.

### Local Production Build
```bash
cd pharma-app
cp .env.example .env.local
# Fill in AUTH_SECRET and NEXTAUTH_URL in .env.local
npm install
npm run build
npm start
```

### Docker
```bash
docker build -t pharma-grade .
docker run -p 3000:3000 --env-file pharma-app/.env.local pharma-grade
```
