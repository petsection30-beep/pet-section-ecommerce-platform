# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev          # Development server (Turbopack by default in Next.js 16)
pnpm build        # Production build (Turbopack by default)
pnpm start        # Start production server
pnpm lint         # Run ESLint directly (next lint was removed in Next.js 16)
```

TypeScript check: `pnpm tsc --noEmit`

Prisma commands:
```bash
pnpm prisma generate        # Regenerate client after schema changes
pnpm prisma db push         # Push schema to DB without a migration file (dev)
pnpm prisma migrate dev     # Create a named migration file
pnpm prisma migrate deploy  # Apply migrations in production
pnpm prisma studio          # Visual DB browser
pnpm prisma db seed         # Seed DB — creates admin user + sample categories
```

## Next.js 16 Breaking Changes

This project uses **Next.js 16.2.7**. The following breaks from prior versions apply directly to this codebase.

### Async Request APIs (critical)

`cookies()`, `headers()`, `draftMode()`, route `params`, and page `searchParams` are **async-only** — synchronous access was removed in v16. Always `await` them:

```ts
// ✅
const cookieStore = await cookies()
const { slug } = await params

// ❌ — synchronous access no longer exists
const { slug } = params
```

Run `npx next typegen` to generate `PageProps`, `LayoutProps`, and `RouteContext` helpers for fully type-safe async access.

### `middleware.ts` → `proxy.ts`

The `middleware` filename convention is deprecated. Route protection lives in **`proxy.ts`** with a named export `proxy` (not `middleware`):

```ts
// proxy.ts
export function proxy(request: Request) { ... }
export const config = { matcher: [...] }
```

`proxy` runs on the **Node.js runtime only** — the edge runtime is not supported. If edge runtime is needed, keep using `middleware.ts`.

### Linting

`next lint` was removed. Run ESLint directly: `pnpm lint` (already wired to `eslint` in `package.json`). `next build` no longer runs linting.

### Caching APIs

- `revalidateTag` now requires a second `cacheLife` argument: `revalidateTag('tag', 'max')`
- `updateTag` (Server Actions only) provides immediate read-your-writes cache invalidation
- `cacheLife` and `cacheTag` are stable — drop the `unstable_` prefix
- `experimental.dynamicIO` / `experimental.useCache` are removed; use top-level `cacheComponents: true` in `next.config.ts`

### Other removals

- `serverRuntimeConfig` / `publicRuntimeConfig` removed — use `process.env` in Server Components; `NEXT_PUBLIC_` prefix for client-accessible values
- AMP support fully removed
- Parallel route slots (`@slotName/`) require explicit `default.js` files or builds fail
- `images.domains` deprecated — use `images.remotePatterns`
- `next dev` output goes to `.next/dev` (separate from `.next` used by `next build`)

## Architecture

### Route Groups

```
app/
  (store)/    # Public storefront — shared header/footer layout
  (auth)/     # Login, register, forgot-password — no chrome
  (admin)/    # Admin panel — protected, sidebar layout
  api/        # API Route Handlers
```

### White-Label Configuration

**`config/brand.config.ts`** is the single source of truth for all branding: store name, colors, fonts, logo, payment account numbers, contact info, and social links. Nothing else in the codebase hard-codes brand identity.

Brand colors are injected as CSS custom properties (`--color-primary`, etc.) inside a `<style>` block in `app/layout.tsx`, then consumed by Tailwind v4 CSS variable utilities (`text-primary`, `bg-surface`, etc.).

To deploy for a new client: update `brand.config.ts`, provision a new Neon DB project and Vercel project, set env vars, run migrations, seed.

### Authentication

Fully in-house — no NextAuth/Clerk. Stack: bcryptjs (12 rounds) + iron-session (encrypted httpOnly cookies).

- Password hashing: `lib/auth/password.ts`
- Session config + helpers: `lib/auth/session.ts` — session payload is `{ userId, email, name, role: "customer"|"admin", isLoggedIn }`
- Route protection: `proxy.ts` (Next.js 16 renamed from `middleware.ts`)
- Auth API routes: `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/logout`, `GET /api/auth/me`

### Database

Neon DB (serverless PostgreSQL) via Prisma. **Two connection strings are required**:

- `DATABASE_URL` — pooled via pgbouncer, used at runtime by all API routes and Server Components
- `DIRECT_URL` — direct connection, used only by Prisma migrations

Prisma Client singleton in `lib/prisma.ts` prevents multiple instances during dev hot-reload.

Key models: `User`, `Product`, `ProductImage`, `ProductVariant`, `Category`, `Order`, `OrderItem`, `Address`, `Review`, `WishlistItem`, `PasswordReset`.

### State Management

- **Zustand**: `store/cartStore.ts` (cart) and `store/uiStore.ts` (modals, drawers) — cart synced to localStorage
- **React Hook Form + Zod**: client-side forms with shared Zod schemas in `lib/validations.ts`
- **Server Components**: data fetching happens at the component level; no global client-side data fetching library

### Image Storage

All images are stored as Base64 `data:` URLs in Neon DB `TEXT` columns — no S3, Cloudinary, or UploadThing. The `POST /api/upload` route converts uploaded files to Base64 strings. Use `browser-image-compression` to keep sizes manageable before encoding (WebP ≤300 KB for product images, ≤500 KB for hero).

### Payments

COD, EasyPaisa, and JazzCash (manual transaction ID verification flow). All payment account numbers come from `brand.config.ts`. Admin manually verifies TXN IDs and updates order status.

Order status flows:
- COD: `PENDING_COD → CONFIRMED → SHIPPED → DELIVERED`
- Mobile wallets: `PENDING_VERIFICATION → CONFIRMED → SHIPPED → DELIVERED` (or `REJECTED`)

### Email

Nodemailer SMTP via `lib/email/`. `lib/email/send.ts` exposes `sendEmail()`. Templates in `lib/email/templates/` reference `brand.config.ts` for store name and branding. Configure with any SMTP provider (Gmail, Zoho, cPanel) via env vars.

## Environment Variables

All required in `.env.local`:

```
DATABASE_URL          # Pooled Neon connection string (pgbouncer=true)
DIRECT_URL            # Direct Neon connection string (migrations only)
SESSION_SECRET        # iron-session encryption key — must be ≥32 chars
SMTP_HOST
SMTP_PORT
SMTP_SECURE           # "true" for TLS (port 465), "false" for STARTTLS (port 587)
SMTP_USER
SMTP_PASS
NEXT_PUBLIC_APP_URL   # e.g. http://localhost:3000
ADMIN_EMAIL           # Used by prisma db seed to create the initial admin account
ADMIN_PASSWORD
ADMIN_NAME
```
