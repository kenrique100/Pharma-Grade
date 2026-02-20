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
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/auth/     # NextAuth API route
│   │   ├── admin/        # Admin dashboard
│   │   ├── categories/   # Category pages
│   │   ├── products/     # Product pages
│   │   ├── cart/         # Shopping cart
│   │   ├── checkout/     # Checkout flow
│   │   ├── account/      # User account
│   │   ├── login/        # Authentication
│   │   └── register/     # Registration
│   ├── components/       # Reusable components
│   ├── lib/              # Utilities (auth, cart, products)
│   ├── types/            # TypeScript types
│   └── middleware.ts     # Route protection
```
