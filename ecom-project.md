# 🐾 PetStore — White-Label Pet E-Commerce Platform

> A fully featured, white-label pet e-commerce web application built with **Next.js (latest App Router)**, **Prisma ORM**, and **Neon DB**. Designed to be rebranded and resold — swap the brand name, colors, and theme without touching a single component.

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [White-Label Architecture](#white-label-architecture)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Project Structure](#project-structure)
6. [Theming & Branding System](#theming--branding-system)
7. [Authentication System](#authentication-system)
8. [File Storage — Base64 Strategy](#file-storage--base64-strategy)
9. [Email — Nodemailer SMTP](#email--nodemailer-smtp)
10. [Payment Methods](#payment-methods)
11. [Database Schema (Prisma)](#database-schema-prisma)
12. [Environment Variables](#environment-variables)
13. [Getting Started](#getting-started)
14. [Admin Panel](#admin-panel)
15. [UI Design System](#ui-design-system)
16. [Deployment](#deployment)
17. [Reselling / White-Labeling Guide](#reselling--white-labeling-guide)
18. [Roadmap](#roadmap)

---

## Project Overview

**PetStore** is a production-ready, full-stack e-commerce platform tailored for pet products and accessories. The application is architected from the ground up as a **white-label product** — meaning the entire brand identity (name, logo, colors, theme, payment account numbers, store description) is controlled from a single configuration file with no code changes required.

Built for the Pakistani market, it supports **Cash on Delivery (COD)**, **EasyPaisa**, and **JazzCash** as payment methods, with a simple manual transaction ID verification flow at checkout.

### What makes this a white-label product?

- Brand name, colors, fonts, and logo are driven by a single `brand.config.ts`
- No hardcoded store names, colors, or phone numbers anywhere in the codebase
- Each new client = one config update + deploy

---

## White-Label Architecture

All brand-specific configuration lives in one place:

```
config/
└── brand.config.ts       ← The single source of truth for all branding
```

### What is configurable without touching code?

| Config Key | Description |
|---|---|
| `storeName` | Brand name displayed sitewide |
| `storeTagline` | Hero section tagline |
| `storeDescription` | Meta description for SEO |
| `logoBase64` | Logo as a Base64 data URL (stored in DB or config) |
| `faviconBase64` | Favicon as a Base64 data URL |
| `primaryColor` | Main brand color (hex) |
| `secondaryColor` | Accent/secondary color (hex) |
| `accentColor` | Highlight color (hex) |
| `fontFamily` | Google Font name |
| `heroImageBase64` | Homepage hero banner (Base64) |
| `categoryTheme` | Icons and labels for product categories |
| `footerLinks` | Footer navigation links |
| `socialLinks` | Instagram, Facebook, TikTok, etc. |
| `contactEmail` | Store contact email |
| `contactPhone` | Store contact phone |
| `address` | Business address |
| `easypaisaNumber` | EasyPaisa mobile account number |
| `easypaisaTitle` | EasyPaisa account title |
| `jazzcashNumber` | JazzCash mobile account number |
| `jazzcashTitle` | JazzCash account title |
| `codEnabled` | Toggle COD on/off |
| `metaKeywords` | SEO keywords |
| `currency` | Currency label (default: `PKR`) |
| `currencySymbol` | Currency symbol (default: `₨`) |

> **Selling to a new client?** Copy the repo, update `brand.config.ts`, and deploy. Done.

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | Next.js (Latest — App Router) | Server Components, Server Actions, API Routes |
| **Language** | TypeScript | Strict mode enabled |
| **Database** | Neon DB (Serverless PostgreSQL) | Pooled connections via `@neondatabase/serverless` |
| **ORM** | Prisma ORM | Type-safe queries, migrations, Prisma Studio |
| **Styling** | Tailwind CSS v4 + CSS Variables | Theme-driven, modern design system |
| **Auth** | Custom — JWT + bcryptjs | No third-party auth service; fully built in-house |
| **Sessions** | Iron Session (encrypted cookies) | Secure, httpOnly, signed session cookies |
| **File Storage** | Base64 in Neon DB (`TEXT` columns) | No external storage service needed |
| **Email** | Nodemailer + SMTP | Works with Gmail, Zoho, any SMTP provider |
| **Form Handling** | React Hook Form + Zod | Client + server validation |
| **State Management** | Zustand | Cart state, UI state |
| **Deployment** | Vercel | Zero-config, edge-optimized |

---

## Features

### 🛍️ Customer-Facing

- **Homepage** — Full-screen hero section, animated category grid, featured products carousel, promotional banners, trust badges
- **Product Catalog** — Filterable and searchable product listings with category navigation
  - Categories: Dogs, Cats, Birds, Fish, Grooming, Food, Accessories
  - Filters: price range, brand, in-stock only, subcategory
  - Sort: Newest, Price ↑, Price ↓, Most Popular
- **Product Detail Page** — Multi-image gallery (Base64), variant selector (size / flavor / weight), in-stock badge, quantity picker, customer reviews with star ratings
- **Shopping Cart** — Persistent cart (Zustand + localStorage sync), quantity controls, remove items, live order summary with subtotal
- **Checkout** — Multi-step flow: Address → Payment → Confirmation; guest checkout supported
- **Customer Accounts** — Register, login, logout, order history, saved addresses, wishlist
- **Order Tracking** — Live status timeline: Pending → Confirmed → Shipped → Delivered
- **Search** — Full-text search across product names and descriptions

### 💳 Payments (Pakistan-Focused)

- **Cash on Delivery (COD)** — Select at checkout; pay on doorstep delivery
- **EasyPaisa** — Account number + title shown at checkout; customer enters TXN ID
- **JazzCash** — Account number + title shown at checkout; customer enters TXN ID
- All payment account details sourced from `brand.config.ts` — zero hardcoding

### 🔐 Admin Panel

- **Dashboard** — Revenue cards, order count by status, recent orders table, low-stock alerts
- **Product Management** — Add/edit/delete products, upload images (Base64 stored in DB), manage variants, set inventory
- **Order Management** — View all orders, filter by status and payment method, update order status, view TXN IDs for verification
- **Customer Management** — View registered customers, order history per customer
- **Category Management** — Add/edit/delete categories and subcategories with icon support
- **Store Settings** — Update payment account numbers, SMTP config, and contact info via admin UI

### 🎨 Design

- Pixel-perfect modern UI built with Tailwind CSS v4
- Glass-morphism cards, smooth transitions, micro-animations
- Mobile-first, fully responsive (320px → 4K)
- Dark/light mode support driven by CSS variables
- Consistent design token system (colors, spacing, radius, shadows)

### 🔍 SEO & Performance

- Next.js App Router with React Server Components
- Dynamic `generateMetadata()` per product, category, and page
- Open Graph and Twitter Card tags on every page
- Auto-generated `sitemap.xml` and `robots.txt`
- `next/image` with Base64 blur placeholders
- Core Web Vitals tuned: LCP, CLS, FID all green

---

## Project Structure

```
petstore/
│
├── app/                              # Next.js App Router
│   ├── (store)/                      # Public store routes (layout with header/footer)
│   │   ├── page.tsx                  # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx              # Product listing / catalog
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Product detail page
│   │   ├── categories/
│   │   │   └── [slug]/page.tsx       # Category filtered listing
│   │   ├── cart/
│   │   │   └── page.tsx              # Cart page
│   │   ├── checkout/
│   │   │   ├── page.tsx              # Checkout — address step
│   │   │   ├── payment/page.tsx      # Checkout — payment step
│   │   │   └── confirmation/page.tsx # Order confirmation
│   │   ├── account/
│   │   │   ├── page.tsx              # Account overview
│   │   │   ├── orders/page.tsx       # Order history
│   │   │   ├── addresses/page.tsx    # Saved addresses
│   │   │   └── wishlist/page.tsx     # Wishlist
│   │   ├── orders/
│   │   │   └── [id]/page.tsx         # Order tracking page
│   │   └── search/
│   │       └── page.tsx              # Search results
│   │
│   ├── (auth)/                       # Auth routes (no header/footer)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   │
│   ├── (admin)/                      # Admin panel (protected, separate layout)
│   │   ├── layout.tsx                # Admin sidebar layout
│   │   ├── dashboard/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx              # Product list
│   │   │   ├── new/page.tsx          # Add product
│   │   │   └── [id]/edit/page.tsx    # Edit product
│   │   ├── orders/
│   │   │   ├── page.tsx              # Orders list
│   │   │   └── [id]/page.tsx         # Order detail + status update
│   │   ├── customers/page.tsx
│   │   ├── categories/page.tsx
│   │   └── settings/page.tsx
│   │
│   └── api/                          # API Route Handlers
│       ├── auth/
│       │   ├── login/route.ts        # POST — login, issue session cookie
│       │   ├── register/route.ts     # POST — register new user
│       │   ├── logout/route.ts       # POST — clear session cookie
│       │   └── me/route.ts           # GET  — current session user
│       ├── products/
│       │   ├── route.ts              # GET list, POST create
│       │   └── [id]/route.ts         # GET one, PUT update, DELETE
│       ├── categories/route.ts
│       ├── orders/
│       │   ├── route.ts              # GET list (admin), POST create (checkout)
│       │   └── [id]/route.ts         # GET one, PATCH status
│       ├── cart/route.ts             # Sync cart to DB for logged-in users
│       ├── reviews/route.ts
│       ├── wishlist/route.ts
│       └── upload/route.ts           # POST — receive file, return Base64 string
│
├── components/
│   ├── ui/                           # Primitive UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   ├── Spinner.tsx
│   │   └── StarRating.tsx
│   ├── store/                        # Store UI components
│   │   ├── ProductCard.tsx           # Product grid card with hover effects
│   │   ├── ProductGrid.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── CartDrawer.tsx            # Slide-in cart sidebar
│   │   ├── FilterSidebar.tsx
│   │   ├── SortDropdown.tsx
│   │   ├── ImageGallery.tsx          # Product images from Base64
│   │   ├── ReviewCard.tsx
│   │   └── WishlistButton.tsx
│   ├── checkout/
│   │   ├── AddressForm.tsx
│   │   ├── PaymentSelector.tsx       # COD / EasyPaisa / JazzCash selector
│   │   ├── TxnIdInput.tsx            # TXN ID field for mobile payments
│   │   └── OrderSummary.tsx
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   ├── StatsCard.tsx
│   │   ├── OrdersTable.tsx
│   │   ├── ProductsTable.tsx
│   │   ├── ImageUploader.tsx         # Drag & drop → Base64 converter
│   │   └── StatusBadge.tsx
│   └── layout/
│       ├── Header.tsx                # Branded header (logo from brand.config)
│       ├── Footer.tsx
│       ├── MobileNav.tsx
│       └── Providers.tsx             # Zustand + Toast providers
│
├── config/
│   └── brand.config.ts               # ⭐ WHITE-LABEL CONFIG
│
├── prisma/
│   ├── schema.prisma                 # Prisma schema (all models)
│   └── seed.ts                       # Database seeder
│
├── lib/
│   ├── prisma.ts                     # Prisma Client singleton
│   ├── auth/
│   │   ├── session.ts                # Iron Session config + helpers
│   │   ├── password.ts               # bcryptjs hash + compare
│   │   ├── middleware.ts             # Route protection middleware
│   │   └── types.ts                  # Session user type
│   ├── email/
│   │   ├── nodemailer.ts             # SMTP transporter setup
│   │   ├── templates/
│   │   │   ├── order-confirmation.ts # Order placed email HTML
│   │   │   ├── order-status.ts       # Status update email HTML
│   │   │   ├── welcome.ts            # Welcome email HTML
│   │   │   └── password-reset.ts     # Password reset email HTML
│   │   └── send.ts                   # sendEmail() helper
│   ├── storage/
│   │   └── base64.ts                 # File → Base64 encode/decode utils
│   ├── payments.ts                   # Payment method config helpers
│   ├── cart.ts                       # Cart calculation utilities
│   └── validations.ts                # Shared Zod schemas
│
├── hooks/
│   ├── useAuth.ts                    # Current user from session
│   ├── useCart.ts                    # Cart state and actions
│   ├── useWishlist.ts
│   └── useToast.ts
│
├── store/
│   ├── cartStore.ts                  # Zustand cart store
│   └── uiStore.ts                    # Zustand UI store (modals, drawers)
│
├── types/
│   ├── index.ts                      # Shared TypeScript types
│   └── brand.ts                      # BrandConfig type definition
│
├── middleware.ts                     # Next.js edge middleware (auth protection)
├── next.config.ts
├── tailwind.config.ts
├── prisma.config.ts
└── .env.local                        # Environment variables
```

---

## Theming & Branding System

The theming system uses **CSS custom properties** driven by `brand.config.ts`. Tailwind v4's new `@theme` directive reads these variables, so every component automatically inherits the brand colors without any per-component changes.

### `config/brand.config.ts`

```typescript
// config/brand.config.ts

import type { BrandConfig } from "@/types/brand";

const brandConfig: BrandConfig = {
  // ── Identity ──────────────────────────────────────────────────────
  storeName:        "PawsPoint",
  storeTagline:     "Everything Your Pet Deserves",
  storeDescription: "Pakistan's #1 online pet store — dogs, cats, birds & more.",
  logoBase64:       "/brand/logo.png",     // or a data:image/png;base64,... string
  faviconBase64:    "/brand/favicon.ico",

  // ── Colors ────────────────────────────────────────────────────────
  primaryColor:     "#F97316",   // Primary brand color
  secondaryColor:   "#1E3A5F",   // Dark navy for contrast
  accentColor:      "#FEF3C7",   // Warm highlight
  backgroundColor:  "#F9FAFB",
  surfaceColor:     "#FFFFFF",
  textColor:        "#111827",
  mutedColor:       "#6B7280",

  // ── Typography ────────────────────────────────────────────────────
  fontFamily:       "Poppins",   // Any Google Font name

  // ── Contact & Location ────────────────────────────────────────────
  contactEmail:     "hello@pawspoint.pk",
  contactPhone:     "0300-0000000",
  address:          "Islamabad, Pakistan",

  // ── Social ────────────────────────────────────────────────────────
  socialLinks: {
    instagram: "https://instagram.com/pawspoint",
    facebook:  "https://facebook.com/pawspoint",
    tiktok:    "",
  },

  // ── Payments ──────────────────────────────────────────────────────
  codEnabled:         true,
  easypaisaEnabled:   true,
  easypaisaTitle:     "PawsPoint Store",
  easypaisaNumber:    "0300-1234567",
  jazzcashEnabled:    true,
  jazzcashTitle:      "PawsPoint Store",
  jazzcashNumber:     "0320-7654321",

  // ── Currency ──────────────────────────────────────────────────────
  currency:       "PKR",
  currencySymbol: "₨",

  // ── SEO ───────────────────────────────────────────────────────────
  metaKeywords: "pet store pakistan, dog food, cat food, bird cage, fish aquarium",
};

export default brandConfig;
```

### How CSS variables are injected

In `app/layout.tsx`, brand colors are injected as CSS custom properties:

```tsx
// app/layout.tsx
import brand from "@/config/brand.config";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --color-primary:    ${brand.primaryColor};
            --color-secondary:  ${brand.secondaryColor};
            --color-accent:     ${brand.accentColor};
            --color-bg:         ${brand.backgroundColor};
            --color-surface:    ${brand.surfaceColor};
            --color-text:       ${brand.textColor};
            --color-muted:      ${brand.mutedColor};
            --font-sans:        '${brand.fontFamily}', system-ui, sans-serif;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

Tailwind v4 `tailwind.config.ts` maps utilities to these variables:

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary:   "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent:    "var(--color-accent)",
        surface:   "var(--color-surface)",
        muted:     "var(--color-muted)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
};
```

---

## Authentication System

Authentication is built **entirely in-house** using Next.js API routes, `bcryptjs` for password hashing, and `iron-session` for encrypted cookie-based sessions. No NextAuth, no Clerk, no third-party auth service.

### How it works

```
Register  →  Hash password (bcrypt, 12 rounds)  →  Store user in Neon DB
Login     →  Verify password hash  →  Create iron-session cookie (httpOnly, signed)
Request   →  Middleware reads session cookie  →  Attach user to request context
Logout    →  Destroy session cookie
```

### Session cookie

`iron-session` encrypts the session payload using `SESSION_SECRET` and stores it in an httpOnly cookie — no session data is stored in the DB, keeping auth stateless.

```typescript
// lib/auth/session.ts
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId:    string;
  email:     string;
  name:      string;
  role:      "customer" | "admin";
  isLoggedIn: boolean;
}

export const sessionOptions = {
  password:    process.env.SESSION_SECRET as string,  // min 32 chars
  cookieName:  "petstore_session",
  cookieOptions: {
    secure:   process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge:   60 * 60 * 24 * 7,  // 7 days
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
```

### Password hashing

```typescript
// lib/auth/password.ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
```

### Route protection (middleware)

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth/session";

export async function middleware(req: NextRequest) {
  const res  = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  const isAdminRoute    = req.nextUrl.pathname.startsWith("/admin");
  const isAccountRoute  = req.nextUrl.pathname.startsWith("/account");
  const isCheckoutRoute = req.nextUrl.pathname.startsWith("/checkout");

  if (!session.isLoggedIn && (isAccountRoute || isCheckoutRoute)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminRoute && session.role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
};
```

### Auth API routes

| Method | Route | Action |
|---|---|---|
| `POST` | `/api/auth/register` | Create account, hash password, start session |
| `POST` | `/api/auth/login` | Verify credentials, issue session cookie |
| `POST` | `/api/auth/logout` | Destroy session cookie |
| `GET`  | `/api/auth/me` | Return current session user |

### Password reset flow

1. User submits email on `/forgot-password`
2. A time-limited reset token (UUID) is generated and stored in the `password_resets` DB table
3. An email is sent via Nodemailer with the reset link
4. User clicks link → enters new password → token is invalidated

---

## File Storage — Base64 Strategy

Product images, the store logo, hero banner, and category icons are all stored as **Base64-encoded strings** directly in Neon DB (`TEXT` columns). No external storage service (no Cloudinary, no S3, no UploadThing) is required.

### Why Base64 in DB?

- Zero configuration — no third-party accounts needed
- Works instantly on any deployment (Vercel, VPS, Railway)
- Simplifies the white-label resell process — no per-client storage buckets
- Images travel with the data — full DB dump = full backup including images

### How it works

**Upload API route** (`/api/upload/route.ts`):

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData  = await req.formData();
  const file      = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes    = await file.arrayBuffer();
  const buffer   = Buffer.from(bytes);
  const base64   = buffer.toString("base64");
  const mimeType = file.type;                         // e.g. "image/webp"
  const dataUrl  = `data:${mimeType};base64,${base64}`;

  // Return the data URL — the caller saves it in DB
  return NextResponse.json({ dataUrl });
}
```

**Admin image uploader component** — drag & drop, converts on the client:

```typescript
// components/admin/ImageUploader.tsx
async function handleFile(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64DataUrl = e.target?.result as string;
    onUpload(base64DataUrl);   // saves to form state → stored in Prisma
  };
  reader.readAsDataURL(file);
}
```

**Displaying images** — use as `src` directly:

```tsx
<img src={product.imageBase64} alt={product.name} />
// or with next/image:
<Image src={product.imageBase64} alt={product.name} width={400} height={400} />
```

### Storage guidelines

| Image type | Recommended format | Max size |
|---|---|---|
| Product images | WebP | 300 KB |
| Store logo | WebP / PNG | 50 KB |
| Hero banner | WebP | 500 KB |
| Category icon | SVG / WebP | 20 KB |

Images are compressed client-side before encoding using the `browser-image-compression` library to keep DB row sizes manageable.

---

## Email — Nodemailer SMTP

Transactional emails are sent via **Nodemailer** using any standard SMTP provider (Gmail, Zoho Mail, Mailgun SMTP, custom cPanel SMTP, etc.).

### SMTP transporter setup

```typescript
// lib/email/nodemailer.ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",   // true = TLS on port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

### sendEmail helper

```typescript
// lib/email/send.ts
import { transporter } from "./nodemailer";
import brand from "@/config/brand.config";

interface SendEmailOptions {
  to:      string;
  subject: string;
  html:    string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  await transporter.sendMail({
    from:    `"${brand.storeName}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
```

### Email templates

All email templates are branded HTML using values from `brand.config.ts`:

| Template | Trigger |
|---|---|
| `welcome.ts` | New customer registration |
| `order-confirmation.ts` | Order successfully placed |
| `order-status.ts` | Admin updates order status |
| `payment-received.ts` | TXN ID verified by admin |
| `password-reset.ts` | Forgot password request |

### SMTP provider examples

```env
# Gmail (enable App Password in Google Account)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourstore@gmail.com
SMTP_PASS=your-app-password

# Zoho Mail
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=orders@yourdomain.com
SMTP_PASS=your-zoho-password

# cPanel / Hosting SMTP
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=orders@yourdomain.com
SMTP_PASS=your-cpanel-email-password
```

---

## Payment Methods

### Cash on Delivery (COD)

- Customer selects COD at checkout and confirms the order
- Order is created with status `PENDING_COD`
- Admin sees the order in the dashboard and processes it manually
- Status is updated to `CONFIRMED` when the delivery is arranged

### EasyPaisa / JazzCash (Manual TXN Flow)

At checkout, after selecting EasyPaisa or JazzCash:

1. Customer is shown the **account number and title** from `brand.config.ts`
2. Customer transfers the amount via their mobile wallet app
3. Customer enters the **Transaction ID (TXN ID)** in the checkout form
4. Order is created with status `PENDING_VERIFICATION`
5. Admin opens the order in the admin panel, verifies the TXN ID manually
6. Admin marks the order as `CONFIRMED` — an automatic status-update email is sent to the customer via Nodemailer
7. If TXN ID is invalid, admin marks as `REJECTED` — customer receives a rejection email

> This manual flow has zero gateway fees and is the most common payment method used by small-to-mid Pakistani e-commerce stores.

### Payment status flow

```
COD:
  PENDING_COD → CONFIRMED → SHIPPED → DELIVERED

EasyPaisa / JazzCash:
  PENDING_VERIFICATION → CONFIRMED → SHIPPED → DELIVERED
                       ↘ REJECTED
```

---

## Database Schema (Prisma)

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")        // Required by Neon for migrations
}

// ─── Users & Auth ──────────────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  passwordHash  String
  role          Role      @default(CUSTOMER)
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  orders        Order[]
  addresses     Address[]
  reviews       Review[]
  wishlist      WishlistItem[]
  passwordResets PasswordReset[]

  @@map("users")
}

model PasswordReset {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@map("password_resets")
}

enum Role {
  CUSTOMER
  ADMIN
}

// ─── Products ───────────────────────────────────────────────────────────────

model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  iconBase64  String?    @db.Text   // SVG or small image as Base64
  parentId    String?
  parent      Category?  @relation("SubCategories", fields: [parentId], references: [id])
  children    Category[] @relation("SubCategories")
  products    Product[]
  createdAt   DateTime   @default(now())

  @@map("categories")
}

model Product {
  id           String           @id @default(cuid())
  name         String
  slug         String           @unique
  description  String           @db.Text
  price        Decimal          @db.Decimal(10, 2)
  comparePrice Decimal?         @db.Decimal(10, 2)  // Strikethrough price
  stock        Int              @default(0)
  sku          String?          @unique
  isActive     Boolean          @default(true)
  isFeatured   Boolean          @default(false)
  categoryId   String
  category     Category         @relation(fields: [categoryId], references: [id])
  images       ProductImage[]
  variants     ProductVariant[]
  orderItems   OrderItem[]
  reviews      Review[]
  wishlist     WishlistItem[]
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt

  @@map("products")
}

model ProductImage {
  id         String   @id @default(cuid())
  base64     String   @db.Text     // data:image/webp;base64,...
  altText    String?
  position   Int      @default(0)  // Display order
  productId  String
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_images")
}

model ProductVariant {
  id         String      @id @default(cuid())
  label      String      // e.g. "Size", "Flavor", "Weight"
  value      String      // e.g. "Small", "Chicken", "1kg"
  priceAdj   Decimal     @default(0) @db.Decimal(8, 2)  // +/- adjustment
  stock      Int         @default(0)
  productId  String
  product    Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  orderItems OrderItem[]

  @@map("product_variants")
}

// ─── Orders ─────────────────────────────────────────────────────────────────

model Order {
  id            String        @id @default(cuid())
  orderNumber   String        @unique  // e.g. "ORD-2026-00042"
  userId        String?
  user          User?         @relation(fields: [userId], references: [id])
  guestEmail    String?       // For guest checkout
  guestName     String?
  status        OrderStatus   @default(PENDING_COD)
  paymentMethod PaymentMethod
  txnId         String?       // EasyPaisa / JazzCash transaction ID
  subtotal      Decimal       @db.Decimal(10, 2)
  deliveryFee   Decimal       @db.Decimal(10, 2) @default(0)
  total         Decimal       @db.Decimal(10, 2)
  notes         String?
  addressId     String?
  address       Address?      @relation(fields: [addressId], references: [id])
  items         OrderItem[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@map("orders")
}

model OrderItem {
  id        String          @id @default(cuid())
  orderId   String
  order     Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product         @relation(fields: [productId], references: [id])
  variantId String?
  variant   ProductVariant? @relation(fields: [variantId], references: [id])
  qty       Int
  unitPrice Decimal         @db.Decimal(10, 2)
  total     Decimal         @db.Decimal(10, 2)

  @@map("order_items")
}

enum OrderStatus {
  PENDING_COD
  PENDING_VERIFICATION
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  REJECTED
  CANCELLED
}

enum PaymentMethod {
  COD
  EASYPAISA
  JAZZCASH
}

// ─── Addresses ──────────────────────────────────────────────────────────────

model Address {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  label      String?  // e.g. "Home", "Office"
  fullName   String
  phone      String
  line1      String
  line2      String?
  city       String
  province   String
  postalCode String?
  isDefault  Boolean  @default(false)
  orders     Order[]
  createdAt  DateTime @default(now())

  @@map("addresses")
}

// ─── Reviews ────────────────────────────────────────────────────────────────

model Review {
  id        String   @id @default(cuid())
  rating    Int      // 1–5
  body      String   @db.Text
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, productId])  // One review per user per product
  @@map("reviews")
}

// ─── Wishlist ────────────────────────────────────────────────────────────────

model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, productId])
  @@map("wishlist_items")
}
```

### Prisma Client singleton (for Next.js)

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## Environment Variables

Create `.env.local` in the project root. **Never commit this file.**

```env
# ── Database (Neon DB) ──────────────────────────────────────────────────────
# Pooled connection — used at runtime (API routes, Server Components)
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15

# Direct connection — used for Prisma migrations only
DIRECT_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# ── Auth ────────────────────────────────────────────────────────────────────
# iron-session encryption secret — must be at least 32 characters, random string
SESSION_SECRET=replace-this-with-a-32-plus-char-random-secret-string

# ── Email (Nodemailer SMTP) ─────────────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourstore@gmail.com
SMTP_PASS=your-gmail-app-password

# ── App ─────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ── Admin Seed Account ──────────────────────────────────────────────────────
ADMIN_EMAIL=admin@petstore.com
ADMIN_PASSWORD=Admin@1234
ADMIN_NAME=Store Admin
```

> **Neon DB note:** Use `DATABASE_URL` with `pgbouncer=true` for pooled connections at runtime, and `DIRECT_URL` without pooling for Prisma migrations. Both are provided in the Neon dashboard.

---

## Getting Started

### Prerequisites

- Node.js >= 20.x
- pnpm (recommended) or npm
- A [Neon DB](https://neon.tech) account — free tier is sufficient
- SMTP credentials (Gmail App Password, Zoho, or any mail host)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/petstore.git
cd petstore

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# → Open .env.local and fill in all values

# 4. Generate Prisma client
pnpm prisma generate

# 5. Push schema to Neon DB (creates all tables)
pnpm prisma db push

# 6. Seed the database (creates admin user + sample categories)
pnpm prisma db seed

# 7. Start development server
pnpm dev
```

Open `http://localhost:3000` for the store and `http://localhost:3000/admin` for the admin panel.

### Prisma commands

```bash
pnpm prisma generate      # Regenerate Prisma client after schema changes
pnpm prisma db push       # Push schema to DB (dev — no migration file)
pnpm prisma migrate dev   # Create a named migration (production-ready)
pnpm prisma migrate deploy # Apply migrations on production
pnpm prisma studio        # Open Prisma Studio (visual DB browser)
pnpm prisma db seed       # Run the seeder script
```

### Available scripts

```bash
pnpm dev          # Development server with hot reload
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint
pnpm type-check   # TypeScript type checking
```

---

## Admin Panel

Access the admin panel at `/admin`. The seeder creates a default admin account:

```
Email:    admin@petstore.com   (set via ADMIN_EMAIL in .env)
Password: Admin@1234           (set via ADMIN_PASSWORD in .env)
```

**Change the password immediately after first login.**

### Admin capabilities

| Section | Capabilities |
|---|---|
| **Dashboard** | Revenue today/week/month, order count by status, recent orders, low-stock alerts |
| **Products** | Add (with Base64 image upload), edit, soft-delete, toggle featured/active, manage variants |
| **Orders** | List all orders, filter by status and payment method, view TXN IDs, update order status |
| **Customers** | View all registered customers, see their order history |
| **Categories** | Create/edit/delete categories and subcategories, upload category icons |
| **Settings** | Update store payment numbers (EasyPaisa/JazzCash), SMTP credentials, contact info |

---

## UI Design System

The store UI is built to feel modern and premium — not generic. Key design decisions:

### Design language

- **Card style:** Soft shadows (`shadow-sm` → `shadow-md` on hover), rounded corners (`rounded-2xl`), subtle borders
- **Animations:** Tailwind's `transition-all duration-200` on interactive elements; product card image scales on hover
- **Hero section:** Full-viewport-height hero with gradient overlay on the hero image; large headline + CTA button
- **Color usage:** Primary color for CTAs, badges, and active states; secondary for nav and footer; accent for highlights and sale tags
- **Typography:** Google Font via `brand.config.ts`; large bold headings, comfortable body line-height

### Component conventions

```
Button variants:    primary | secondary | ghost | danger
Badge variants:     success | warning | error | info | neutral
Card:               default surface with hover lift effect
Input:              rounded-xl, focus ring in primary color
ProductCard:        image (aspect-ratio 1:1), name, price, add-to-cart button
```

### Responsive breakpoints

```
Mobile:   320px – 639px    (single column, bottom nav)
Tablet:   640px – 1023px   (2 column grid, sidebar collapsed)
Desktop:  1024px+          (3–4 column grid, sidebar visible)
```

---

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Deploy to production
vercel --prod
```

In Vercel dashboard → **Settings → Environment Variables**, add all variables from `.env.local`.

### Post-deployment checklist

- [ ] Set `NEXT_PUBLIC_APP_URL` to your live domain
- [ ] Set `NODE_ENV=production`
- [ ] Run `pnpm prisma migrate deploy` against the production DB
- [ ] Verify SMTP by placing a test order
- [ ] Update `brand.config.ts` with the client's real payment numbers
- [ ] Upload client logo and hero image via Admin → Settings
- [ ] Change default admin password

### Neon DB setup

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the **pooled** connection string → `DATABASE_URL`
3. Copy the **direct** connection string → `DIRECT_URL`
4. Run `pnpm prisma migrate deploy` to apply all migrations

---

## Reselling / White-Labeling Guide

This platform is built to be sold to multiple clients. The exact handover process per client:

### Step 1 — Duplicate the repository

```bash
git clone https://github.com/your-org/petstore.git client-name-store
cd client-name-store
```

### Step 2 — Update `brand.config.ts`

Fill in:
- Store name, tagline, and description
- Brand colors (get from client's logo or brand kit)
- Logo and hero image (upload to admin after deployment, or encode to Base64)
- EasyPaisa / JazzCash account number and account title
- Contact email, phone, and address
- Social media links

### Step 3 — Provision infrastructure (per-client)

- Create a **new Neon DB project** for the client
- Set up a **new Vercel project** linked to the client's domain
- Create SMTP credentials using the client's email domain

### Step 4 — Set environment variables

Copy `.env.example`, fill in all client-specific values, add to Vercel.

### Step 5 — Deploy and migrate

```bash
vercel --prod
pnpm prisma migrate deploy   # Run against client's Neon DB
```

### Step 6 — Seed and hand over

- Run `pnpm prisma db seed` to create the admin account
- Share admin credentials securely
- Walk client through adding their products and categories

**Total time per client: ~2–4 hours**

---

## Roadmap

Planned features for future versions:

- [ ] Promo codes and discount system
- [ ] Bulk product import via CSV
- [ ] Product bundles
- [ ] Inventory low-stock email alerts
- [ ] SMS notifications (Jazz SMS API / Twilio)
- [ ] Advanced analytics dashboard (revenue charts, top products)
- [ ] Multi-language support (Urdu / Roman Urdu)
- [ ] Mobile app (React Native / Expo)
- [ ] HBL / UBL / Stripe payment gateway integration
- [ ] Multi-vendor / marketplace mode

---

## License

This codebase is proprietary. Each client deployment requires a separate license.
For licensing inquiries: **info@pakverse.com**

---

> Built with ❤️ by [Pakverse Technology Solutions](https://pakverse.com) — Islamabad, Pakistan
