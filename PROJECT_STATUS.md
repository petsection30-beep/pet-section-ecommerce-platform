# PawsPoint — Project Status & Implementation Guide

> **Stack:** Next.js 16.2.7 · React 19 · Tailwind CSS v4 · TypeScript · Prisma (planned) · Neon DB (planned)
> **Status:** Frontend complete — backend not yet wired

---

## Table of Contents

1. [What Is Built](#1-what-is-built)
2. [What Is NOT Built](#2-what-is-not-built)
3. [E-Commerce Platform Flow](#3-e-commerce-platform-flow)
4. [Feature Checklist](#4-feature-checklist)
5. [Remaining Backend Work](#5-remaining-backend-work)
6. [File Structure](#6-file-structure)
7. [Design System](#7-design-system)
8. [White-Label Guide](#8-white-label-guide)

---

## 1. What Is Built

Everything listed here is a real, working UI page or component. All data is currently served from `lib/mock-data.ts`.

### Storefront Pages

| Route | Page | Status |
|---|---|---|
| `/` | Homepage — Hero Slider, Categories, Featured Products, Promo Banner, New Arrivals, Trust Badges | ✅ Done |
| `/products` | Full catalog with client-side filter (category, price range, in-stock) + sort | ✅ Done |
| `/products/[slug]` | Product detail — gallery, variants, quantity, wishlist, add-to-cart, reviews, specs tabs | ✅ Done |
| `/categories` | Category grid (8 categories with emoji, description, item count) | ✅ Done |
| `/categories/[slug]` | Category detail — filtered product grid | ✅ Done |
| `/search` | Search results page — filters by name and category | ✅ Done |
| `/cart` | Cart — quantity stepper, remove items, subtotal, delivery threshold, order total | ✅ Done |
| `/checkout` | Step 1 — Address form (Pakistan provinces, full validation) | ✅ Done |
| `/checkout/payment` | Step 2 — COD / EasyPaisa / JazzCash selection + TXN ID input | ✅ Done |
| `/checkout/confirmation` | Step 3 — Order confirmation, order number, 5-step timeline | ✅ Done |
| `/account` | Account dashboard — stats, quick links, recent orders | ✅ Done |
| `/account/orders` | Full order history list | ✅ Done |
| `/account/addresses` | Saved addresses — set default, remove | ✅ Done |
| `/account/wishlist` | Wishlist — product grid from saved IDs | ✅ Done |
| `/orders/[id]` | Order tracking — status timeline, items table, delivery + payment info | ✅ Done |

### Auth Pages

| Route | Page | Status |
|---|---|---|
| `/login` | Email + password, show/hide toggle, loading state, error message | ✅ Done |
| `/register` | Name, email, password, confirm password, terms checkbox, field errors | ✅ Done |
| `/forgot-password` | Email form → "email sent" confirmation state | ✅ Done |

### Admin Panel

| Route | Page | Status |
|---|---|---|
| `/admin` | Redirects to `/admin/dashboard` | ✅ Done |
| `/admin/dashboard` | Stats cards, recent orders table, low-stock alerts | ✅ Done |
| `/admin/products` | Products table — search, category/status filters, edit/delete links | ✅ Done |
| `/admin/products/new` | Add product form — name, description, category, price, stock, SKU, toggles | ✅ Done |
| `/admin/orders` | Orders table — status filter tabs (All / Pending / Confirmed / Shipped / Delivered) | ✅ Done |
| `/admin/orders/[id]` | Order detail — items, payment verification (approve/reject TXN), status updater | ✅ Done |
| `/admin/customers` | Customers table — name, email, phone, order count, total spent, join date | ✅ Done |
| `/admin/categories` | Categories — inline add form, active toggle, delete | ✅ Done |
| `/admin/settings` | Store info, payment account numbers, SMTP config, social links | ✅ Done |

### Shared Components

| Component | Description |
|---|---|
| `Header` | Sticky glass header, desktop nav, search, cart, account, mobile hamburger menu |
| `Footer` | 4-column grid — brand + social, shop links, help links, contact + payment chips |
| `HeroSlider` | 4-slide auto-advancing carousel — fade transition, progress bar, dot nav, side arrows |
| `CategoryGrid` | Horizontal scroll (mobile) + 7-col grid (desktop), emoji + gradient per category |
| `ProductCard` | Discount badge, wishlist heart, star rating, add-to-cart with success flash |
| `FeaturedProducts` | Best sellers 2→4 col grid |
| `NewArrivals` | New products 2→3→4 col grid |
| `PromoBanner` | Promo code banner with CTA |
| `TrustBadges` | Free delivery, secure payments, easy returns, 24/7 support |
| `AdminSidebar` | Active-state nav, view store link, sign out |
| `Breadcrumb` | Reusable `<nav>` with chevron separators |

---

## 2. What Is NOT Built

These are the backend, logic, and persistence layers needed to make the store production-ready.

### Authentication & Sessions

- ❌ `POST /api/auth/register` — no API route, no DB user creation
- ❌ `POST /api/auth/login` — no password verification, no session creation
- ❌ `POST /api/auth/logout` — no session clearing
- ❌ `GET /api/auth/me` — no session read
- ❌ `POST /api/auth/forgot-password` — no token generation, no email sent
- ❌ `POST /api/auth/reset-password` — no token validation, no password update
- ❌ iron-session setup — `lib/auth/session.ts` file not created
- ❌ Route protection (`proxy.ts`) — admin and account routes are publicly accessible
- ❌ Password hashing — `lib/auth/password.ts` (bcryptjs) not created

### Database

- ❌ `prisma/schema.prisma` — not created (models: User, Product, ProductImage, ProductVariant, Category, Order, OrderItem, Address, Review, WishlistItem, PasswordReset)
- ❌ Prisma client singleton (`lib/prisma.ts`) — not created
- ❌ DB migrations — never run
- ❌ DB seed (`prisma/seed.ts`) — admin user + sample categories not seeded
- ❌ `.env.local` — `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET` not set

### Product APIs

- ❌ `GET /api/products` — no server-side listing with pagination
- ❌ `GET /api/products/[slug]` — no DB lookup
- ❌ `POST /api/admin/products` — create product does not persist
- ❌ `PUT /api/admin/products/[id]` — edit product does not persist
- ❌ `DELETE /api/admin/products/[id]` — delete product does not persist
- ❌ `POST /api/upload` — image upload converts to Base64 but route doesn't exist

### Orders & Checkout

- ❌ `POST /api/orders` — checkout form submits but no order is created in DB
- ❌ `GET /api/orders` — no real order history (account page uses hardcoded data)
- ❌ `GET /api/orders/[id]` — no real order detail
- ❌ `PUT /api/admin/orders/[id]/status` — status updates in admin don't persist
- ❌ Order confirmation email — Nodemailer not wired up
- ❌ TXN ID verification — approve/reject button does nothing persistent

### Cart

- ❌ Zustand `cartStore.ts` — not created; cart page uses local `useState` only
- ❌ Cart persistence to `localStorage` — not implemented
- ❌ Cart item count in Header — hardcoded `0`

### Wishlist

- ❌ Zustand `uiStore.ts` — not created
- ❌ Wishlist persisted to DB or localStorage — currently hardcoded product IDs
- ❌ `POST /api/wishlist` — no add/remove endpoint

### Email

- ❌ `lib/email/send.ts` (`sendEmail()`) — not created
- ❌ Email templates (`lib/email/templates/`) — not created
- ❌ SMTP env vars not configured
- ❌ Triggers: order confirmation, password reset, order status change

### Search

- ❌ `/api/search` — currently filters `ALL_PRODUCTS` in-memory; needs DB full-text search
- ❌ Debounce / live search in header — search icon links to `/search` with no typeahead

### Categories API

- ❌ `POST /api/admin/categories` — category add in admin panel does not persist
- ❌ `DELETE /api/admin/categories/[id]` — delete does not persist

### Customers API

- ❌ `GET /api/admin/customers` — hardcoded mock data
- ❌ `GET /api/admin/customers/[id]` — customer detail view not built

### Payments

- ❌ Manual TXN ID verification logic fully unimplemented on the server
- ❌ No webhook or automated payment confirmation

### Validation Library

- ❌ `lib/validations.ts` — shared Zod schemas not created (each form validates inline)

### State Management

- ❌ `store/cartStore.ts` (Zustand) — not created
- ❌ `store/uiStore.ts` (Zustand) — not created

---

## 3. E-Commerce Platform Flow

### Customer Journey

```
Homepage
  └─▶ Browse Products  (/products)
        └─▶ Product Detail  (/products/[slug])
              └─▶ Add to Cart  → Cart  (/cart)
                    └─▶ Checkout  (/checkout)
                          └─▶ [Address Form]
                                └─▶ Payment  (/checkout/payment)
                                      ├─▶ COD → Confirmation
                                      └─▶ EasyPaisa/JazzCash
                                            └─▶ Enter TXN ID
                                                  └─▶ Confirmation  (/checkout/confirmation)
                                                        └─▶ Track Order  (/orders/[id])
```

### Order Status Flows

```
COD:
  PENDING_COD → CONFIRMED → SHIPPED → DELIVERED

Mobile Wallet (EasyPaisa / JazzCash):
  PENDING_VERIFICATION → CONFIRMED → SHIPPED → DELIVERED
                      └─▶ REJECTED
```

### Admin Order Verification Flow

```
New wallet order arrives with TXN ID
  └─▶ Admin views order  (/admin/orders/[id])
        └─▶ Manually checks payment app
              ├─▶ "Approve" → status = CONFIRMED → email sent to customer
              └─▶ "Reject"  → status = REJECTED  → email sent to customer
```

### Authentication Flow

```
Register (/register)
  └─▶ Hash password (bcrypt 12 rounds)
        └─▶ Create User in DB
              └─▶ Create iron-session cookie
                    └─▶ Redirect to /account

Login (/login)
  └─▶ Find user by email
        └─▶ Compare password hash
              └─▶ Create iron-session cookie
                    └─▶ Redirect to /account (or previous page)

Logout
  └─▶ Destroy session cookie → Redirect to /

Password Reset
  └─▶ Generate token → Save to PasswordReset table (expires 30 min)
        └─▶ Send reset link via Nodemailer
              └─▶ User clicks link → validate token → update password hash
```

### Route Protection (proxy.ts — not yet built)

```
/admin/*      → Requires session.role === "admin"
/account/*    → Requires session.isLoggedIn === true
/checkout/*   → Requires session.isLoggedIn (or guest checkout flag)
/login        → Redirect to /account if already logged in
/register     → Redirect to /account if already logged in
```

---

## 4. Feature Checklist

### Storefront

- ✅ Hero slider (4 slides, auto-advance, pause on hover, progress bar)
- ✅ Category browsing
- ✅ Product listing with filters (category, price, stock) + sort
- ✅ Product detail with gallery, variants, quantity selector, reviews
- ✅ Search page (mock filter)
- ✅ Cart with quantity management and delivery threshold
- ✅ 3-step checkout (address → payment → confirmation)
- ✅ Pakistan payment methods (COD, EasyPaisa, JazzCash)
- ✅ Order tracking timeline
- ✅ Account dashboard, order history, addresses, wishlist
- ❌ Live search / typeahead
- ❌ Product reviews — write a review form
- ❌ Pagination (products list loads all 16 mock items)
- ❌ Cart persisted across page reloads
- ❌ Guest checkout (currently no auth gate but also no session)
- ❌ Coupon / promo code validation at checkout
- ❌ Stock decrement on order placement
- ❌ Product variants stored in DB (size, weight, flavor)

### Admin

- ✅ Dashboard stats and low-stock alerts
- ✅ Products table with search/filter
- ✅ Add product form UI
- ✅ Orders table with status tabs
- ✅ Order detail + TXN approval UI
- ✅ Customer table
- ✅ Category management UI
- ✅ Settings form UI
- ❌ All admin mutations — nothing persists to a database
- ❌ Image upload working end-to-end
- ❌ Edit product form (only "new" exists)
- ❌ Delete confirmation modal
- ❌ Admin analytics charts (revenue over time, top products)
- ❌ Bulk order status update
- ❌ Export orders to CSV

### Infrastructure

- ✅ White-label brand config (`config/brand.config.ts`)
- ✅ CSS variable theming (runtime per-client color overrides)
- ✅ Responsive design (mobile-first, all breakpoints)
- ✅ TypeScript strict mode, zero errors
- ✅ Next.js 16 App Router with route groups
- ✅ Design documentation (`design.md`)
- ❌ Database (Prisma + Neon DB)
- ❌ Authentication (iron-session)
- ❌ Route protection (proxy.ts)
- ❌ Email (Nodemailer)
- ❌ Zustand stores (cart, UI)
- ❌ Zod validation schemas
- ❌ Environment variables (`.env.local`)

---

## 5. Remaining Backend Work

Listed in recommended implementation order.

### Step 1 — Environment & Database

```bash
# 1. Create .env.local with all required variables
DATABASE_URL=          # Neon pooled connection (pgbouncer=true)
DIRECT_URL=            # Neon direct connection (migrations only)
SESSION_SECRET=        # ≥32 char random string
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_NAME=

# 2. Create prisma/schema.prisma with all models
# 3. Run migrations
pnpm prisma migrate dev --name init
pnpm prisma db seed
```

**Models to define in schema.prisma:**
- `User` — id, name, email, passwordHash, role (customer | admin), createdAt
- `Product` — id, slug, name, description, price, comparePrice, stock, categoryId, isFeatured, isActive, createdAt
- `ProductImage` — id, productId, url (base64 TEXT), altText, order
- `ProductVariant` — id, productId, name, value, priceModifier, stock
- `Category` — id, name, slug, emoji, description, isActive
- `Order` — id, userId, status, total, deliveryFee, paymentMethod, txnId, createdAt
- `OrderItem` — id, orderId, productId, variantId, qty, unitPrice, productName
- `Address` — id, userId, fullName, phone, line1, line2, city, province, postalCode, isDefault
- `Review` — id, productId, userId, rating, body, createdAt
- `WishlistItem` — id, userId, productId, createdAt
- `PasswordReset` — id, userId, token, expiresAt, usedAt

### Step 2 — Auth Library

Create these files:

```
lib/auth/password.ts     # hashPassword(), verifyPassword() using bcryptjs
lib/auth/session.ts      # getSession(), setSession(), clearSession() using iron-session
```

### Step 3 — Auth API Routes

```
app/api/auth/register/route.ts   POST — validate → hash → create user → set session
app/api/auth/login/route.ts      POST — find user → verify hash → set session
app/api/auth/logout/route.ts     POST — clear session
app/api/auth/me/route.ts         GET  — return session payload
```

### Step 4 — Route Protection

Create `proxy.ts` in project root:
```ts
export function proxy(request: Request) { ... }
export const config = { matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"] }
```

### Step 5 — Cart (Zustand)

Create `store/cartStore.ts`:
- State: `items: CartItem[]`, `addItem()`, `removeItem()`, `updateQty()`, `clearCart()`
- Persist to `localStorage` via Zustand `persist` middleware
- Wire up `ProductCard` "Add to Cart" button and `Header` cart count badge
- Wire up `/cart` page to read from store instead of local `useState`

### Step 6 — Product APIs

```
app/api/products/route.ts              GET  — list with pagination, filter, sort
app/api/products/[slug]/route.ts       GET  — single product with images + variants
app/api/admin/products/route.ts        POST — create product
app/api/admin/products/[id]/route.ts   PUT / DELETE
app/api/upload/route.ts                POST — receive file, compress, convert to base64, return data URL
```

### Step 7 — Order APIs

```
app/api/orders/route.ts                POST — create order from cart + address
app/api/orders/[id]/route.ts           GET  — order detail (customer)
app/api/admin/orders/route.ts          GET  — all orders with filters
app/api/admin/orders/[id]/route.ts     GET  — single order detail
app/api/admin/orders/[id]/status/route.ts  PUT — update status
```

### Step 8 — Email

```
lib/email/send.ts                      sendEmail(to, subject, html)
lib/email/templates/orderConfirmation.ts
lib/email/templates/orderStatusUpdate.ts
lib/email/templates/passwordReset.ts
```

Trigger emails from:
- `POST /api/orders` → send `orderConfirmation`
- `PUT /api/admin/orders/[id]/status` → send `orderStatusUpdate`
- `POST /api/auth/forgot-password` → send `passwordReset`

### Step 9 — Wishlist API

```
app/api/wishlist/route.ts              GET — list, POST — add
app/api/wishlist/[productId]/route.ts  DELETE — remove
```

Replace hardcoded IDs in `/account/wishlist/page.tsx` with real API call.

### Step 10 — Zod Validation

Create `lib/validations.ts` with shared schemas:
- `registerSchema` — name, email, password (min 8, complexity)
- `loginSchema`
- `addressSchema` — all checkout fields + Pakistani phone regex
- `productSchema` — admin product create/edit
- `orderSchema`

### Step 11 — Replace Mock Data with Real Queries

Remove `lib/mock-data.ts` references from:
- `app/(store)/products/page.tsx` → call `GET /api/products`
- `app/(store)/products/[slug]/page.tsx` → call `GET /api/products/[slug]`
- `app/(store)/categories/[slug]/page.tsx` → call `GET /api/products?category=slug`
- `app/(store)/search/page.tsx` → call `GET /api/products?q=query`
- `app/(store)/account/wishlist/page.tsx` → call `GET /api/wishlist`
- `app/(admin)/admin/products/page.tsx` → call `GET /api/admin/products`

---

## 6. File Structure

```
pet-ecommerce-store/
├── app/
│   ├── page.tsx                          # Homepage (root)
│   ├── layout.tsx                        # Root layout — font, metadata, brand CSS vars
│   ├── globals.css                       # Tailwind v4 @theme inline, brand tokens, keyframes
│   │
│   ├── (store)/                          # Public storefront — shared Header/Footer
│   │   ├── layout.tsx
│   │   ├── products/
│   │   │   ├── page.tsx                  # Catalog with filters
│   │   │   └── [slug]/page.tsx           # Product detail
│   │   ├── categories/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── search/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/
│   │   │   ├── page.tsx                  # Address step
│   │   │   ├── payment/page.tsx
│   │   │   └── confirmation/page.tsx
│   │   ├── account/
│   │   │   ├── page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── addresses/page.tsx
│   │   │   └── wishlist/page.tsx
│   │   └── orders/[id]/page.tsx
│   │
│   ├── (auth)/                           # Login/register — minimal centered layout
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   │
│   ├── (admin)/                          # Admin panel — sidebar layout
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── page.tsx                  # → redirect to /admin/dashboard
│   │       ├── dashboard/page.tsx
│   │       ├── products/
│   │       │   ├── page.tsx
│   │       │   └── new/page.tsx
│   │       ├── orders/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── customers/page.tsx
│   │       ├── categories/page.tsx
│   │       └── settings/page.tsx
│   │
│   └── api/                              # ← NOT YET CREATED
│       ├── auth/
│       │   ├── register/route.ts
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   ├── me/route.ts
│       │   └── forgot-password/route.ts
│       ├── products/route.ts
│       ├── products/[slug]/route.ts
│       ├── orders/route.ts
│       ├── orders/[id]/route.ts
│       ├── wishlist/route.ts
│       ├── upload/route.ts
│       └── admin/
│           ├── products/route.ts
│           ├── products/[id]/route.ts
│           ├── orders/route.ts
│           ├── orders/[id]/route.ts
│           ├── orders/[id]/status/route.ts
│           └── customers/route.ts
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── store/
│   │   ├── HeroSlider.tsx                # 4-slide carousel
│   │   ├── HeroBanner.tsx                # Static fallback
│   │   ├── CategoryGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── NewArrivals.tsx
│   │   ├── PromoBanner.tsx
│   │   └── TrustBadges.tsx
│   ├── admin/
│   │   └── Sidebar.tsx
│   └── ui/
│       └── Breadcrumb.tsx
│
├── config/
│   └── brand.config.ts                   # Single source of truth for all branding
│
├── lib/
│   ├── mock-data.ts                      # Temporary — replace with DB queries
│   ├── prisma.ts                         # ← NOT YET CREATED
│   ├── validations.ts                    # ← NOT YET CREATED
│   ├── auth/
│   │   ├── password.ts                   # ← NOT YET CREATED
│   │   └── session.ts                    # ← NOT YET CREATED
│   └── email/
│       ├── send.ts                       # ← NOT YET CREATED
│       └── templates/                    # ← NOT YET CREATED
│
├── store/
│   ├── cartStore.ts                      # ← NOT YET CREATED (Zustand)
│   └── uiStore.ts                        # ← NOT YET CREATED (Zustand)
│
├── prisma/
│   ├── schema.prisma                     # ← NOT YET CREATED
│   └── seed.ts                           # ← NOT YET CREATED
│
├── proxy.ts                              # ← NOT YET CREATED (route protection)
├── design.md                             # UI/UX design documentation
├── PROJECT_STATUS.md                     # This file
├── CLAUDE.md                             # AI assistant instructions
└── .env.local                            # ← NOT YET CREATED
```

---

## 7. Design System

All design tokens flow from `config/brand.config.ts` → injected as CSS custom properties in `app/layout.tsx` → consumed via Tailwind CSS v4 `@theme inline` utilities.

### Colors

| Token | Utility | Default | Purpose |
|---|---|---|---|
| `--brand-primary` | `bg-primary`, `text-primary` | `#F97316` | Orange — CTAs, accents |
| `--brand-secondary` | `bg-secondary`, `text-secondary` | `#1E3A5F` | Navy — hero, headers |
| `--brand-accent` | `bg-accent`, `text-accent` | `#FEF3C7` | Amber — highlights |
| `--brand-page` | `bg-page` | `#F8FAFC` | Page background |
| `--brand-surface` | `bg-surface` | `#FFFFFF` | Card/modal background |
| `--color-success` | `bg-success`, `text-success` | `#16A34A` | Order confirmed, in stock |
| `--color-warning` | `bg-warning`, `text-warning` | `#D97706` | Pending verification |
| `--color-danger` | `bg-danger`, `text-danger` | `#DC2626` | Errors, rejected, out of stock |

### Typography

- Font: **Poppins** (400, 500, 600, 700) via `next/font/google`
- Applied via CSS variable `--font-poppins` → `--font-sans` in `@theme inline`

### Spacing & Radius

- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-xl` (12px)
- Inputs: `rounded-xl` (12px)
- Full-bleed sections: `rounded-3xl`

---

## 8. White-Label Guide

To deploy this store for a different pet brand:

1. **Edit `config/brand.config.ts`** — change `storeName`, `primaryColor`, `secondaryColor`, `contactEmail`, `contactPhone`, payment account numbers, social links.

2. **Provision infrastructure:**
   - Create a new [Neon](https://neon.tech) DB project → copy `DATABASE_URL` + `DIRECT_URL`
   - Create a new [Vercel](https://vercel.com) project → set all env vars from `.env.local`

3. **Run migrations & seed:**
   ```bash
   pnpm prisma migrate deploy
   pnpm prisma db seed
   ```

4. **Deploy:**
   ```bash
   git push origin main  # Vercel auto-deploys
   ```

The brand colors inject at runtime — no Tailwind rebuild needed between clients.
