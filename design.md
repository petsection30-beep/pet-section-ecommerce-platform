# PetStore — UI/UX Design Documentation

> Design system, visual language, component specs, and layout guidelines for the PetStore white-label e-commerce platform.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout Grid](#spacing--layout-grid)
5. [Elevation & Shadows](#elevation--shadows)
6. [Border Radius](#border-radius)
7. [Component Library](#component-library)
8. [Page Layouts](#page-layouts)
9. [Animations & Transitions](#animations--transitions)
10. [Dark Mode](#dark-mode)
11. [Responsive Design](#responsive-design)
12. [Iconography](#iconography)
13. [Accessibility](#accessibility)
14. [Design Tokens Reference](#design-tokens-reference)

---

## Design Philosophy

The PetStore UI is built around three principles:

**Warm & Trustworthy** — pet owners are emotionally invested in their animals. The design avoids cold, clinical aesthetics. Rounded shapes, warm accent tones, and generous whitespace signal care and quality.

**Fast & Obvious** — every interaction should be immediate and self-explanatory. Add-to-cart, checkout, and order tracking must require zero learning. Ambiguity is a conversion killer.

**Token-Driven** — all visual decisions live in `globals.css` CSS custom properties. Swapping a brand palette means changing seven hex values — no component is touched.

---

## Color System

### Brand Tokens (injected by `app/layout.tsx` from `brand.config.ts`)

```css
:root {
  --color-primary:    #F97316;   /* Main CTA, active states, links */
  --color-secondary:  #1E3A5F;   /* Nav, footer, headings */
  --color-accent:     #FEF3C7;   /* Sale tags, highlight strips */
  --color-bg:         #F9FAFB;   /* Page background */
  --color-surface:    #FFFFFF;   /* Cards, modals, inputs */
  --color-text:       #111827;   /* Body copy */
  --color-muted:      #6B7280;   /* Placeholders, secondary labels */
}
```

### Semantic Palette

These never change per brand — they carry fixed meaning across the UI.

| Token | Value | Usage |
|---|---|---|
| `--color-success` | `#16A34A` | In-stock badge, order confirmed |
| `--color-warning` | `#D97706` | Low stock, pending payment |
| `--color-danger`  | `#DC2626` | Out of stock, error states, rejected |
| `--color-info`    | `#2563EB` | Informational banners, tooltips |

### Tailwind v4 Mapping (`globals.css`)

```css
@theme inline {
  --color-primary:   var(--color-primary);
  --color-secondary: var(--color-secondary);
  --color-accent:    var(--color-accent);
  --color-bg:        var(--color-bg);
  --color-surface:   var(--color-surface);
  --color-muted:     var(--color-muted);
  --color-success:   #16A34A;
  --color-warning:   #D97706;
  --color-danger:    #DC2626;
  --color-info:      #2563EB;
}
```

This lets you write `bg-primary`, `text-muted`, `border-danger` directly in JSX.

### Color Usage Rules

- **Primary** — only for the most important interactive element per screen (primary button, active nav item, price highlights). Never decorate.
- **Secondary** — structural chrome: nav background, footer, section headings.
- **Surface** — all card and modal backgrounds. Always use `--color-surface`, never hardcode white.
- **Muted** — supporting text only. Never use for anything interactive.
- **Danger** — destructive actions and error feedback only, not for decoration.

---

## Typography

### Font Stack

The font family is driven by `brand.config.ts → fontFamily` (any Google Font). Default: **Poppins**.

```css
:root {
  --font-sans: 'Poppins', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace; /* admin code blocks only */
}
```

### Type Scale

| Role | Class | Size / Line-height | Weight | Usage |
|---|---|---|---|---|
| Display | `text-display` | 48px / 1.1 | 700 | Hero headline |
| H1 | `text-4xl` | 36px / 1.2 | 700 | Page titles |
| H2 | `text-2xl` | 24px / 1.3 | 600 | Section headers |
| H3 | `text-xl` | 20px / 1.4 | 600 | Card titles, modal headers |
| H4 | `text-lg` | 18px / 1.5 | 500 | Sub-sections |
| Body | `text-base` | 16px / 1.6 | 400 | All body copy |
| Small | `text-sm` | 14px / 1.5 | 400 | Labels, captions, breadcrumbs |
| XSmall | `text-xs` | 12px / 1.4 | 400 | Badges, timestamps |

### Typography Rules

- Line length: 60–75 characters max for body text (use `max-w-prose`).
- Heading hierarchy is strict — never skip levels (H1 → H2 → H3).
- Price displays: always `font-semibold text-text`, compare-price gets `line-through text-muted text-sm`.
- Never center-align body paragraphs longer than one line.

---

## Spacing & Layout Grid

### Base Unit

All spacing is multiples of **4px** (Tailwind's default `0.25rem` unit). Do not use arbitrary values — everything maps to the scale.

### Key Spacing Values

| Token | px | Tailwind | Usage |
|---|---|---|---|
| `space-1` | 4px | `p-1` | Icon padding |
| `space-2` | 8px | `p-2` | Tight inline gaps |
| `space-3` | 12px | `p-3` | Button padding (vertical) |
| `space-4` | 16px | `p-4` | Card internal padding |
| `space-6` | 24px | `p-6` | Section gutters |
| `space-8` | 32px | `p-8` | Card padding on desktop |
| `space-12` | 48px | `p-12` | Section vertical padding |
| `space-16` | 64px | `p-16` | Hero vertical padding |
| `space-24` | 96px | `p-24` | Page-level vertical rhythm |

### Page Container

```tsx
// Max-width container with horizontal padding
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

### Product Grid

```
Mobile  (< 640px):   1 column
Tablet  (640–1023px): 2 columns
Desktop (1024–1279px): 3 columns
Wide    (1280px+):     4 columns
```

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
```

---

## Elevation & Shadows

Shadows convey z-level. Use the level that matches the component's conceptual height above the page.

| Level | Class | When to use |
|---|---|---|
| 0 | `shadow-none` | Flat sections, table rows |
| 1 | `shadow-sm` | Resting product cards, inputs |
| 2 | `shadow-md` | Hovered cards, dropdown menus |
| 3 | `shadow-lg` | Modals, cart drawer |
| 4 | `shadow-xl` | Full-page overlays, toasts |

**Rule:** A hovered card steps up exactly one level (`shadow-sm` → `shadow-md`). Never jump two levels on hover.

---

## Border Radius

| Token | Value | Tailwind | Usage |
|---|---|---|---|
| `radius-sm` | 6px | `rounded-md` | Badges, small chips |
| `radius-md` | 12px | `rounded-xl` | Inputs, buttons |
| `radius-lg` | 16px | `rounded-2xl` | Cards, panels |
| `radius-xl` | 24px | `rounded-3xl` | Hero media, modals |
| `radius-full` | 9999px | `rounded-full` | Avatars, pill buttons |

**Rule:** Never mix radius tokens within the same component. A card that uses `rounded-2xl` has `rounded-2xl` on its image too — use `overflow-hidden` on the parent to clip.

---

## Component Library

### Button

Four variants. One size scale.

```
Variant     Class Pattern                                   When
─────────── ─────────────────────────────────────────────── ───────────────────────
primary     bg-primary text-white hover:bg-primary/90      Primary CTA per screen
secondary   bg-secondary text-white hover:bg-secondary/90  Destructive confirm, nav
ghost       border border-current text-text hover:bg-bg     Secondary actions
danger      bg-danger text-white hover:bg-danger/90         Delete, cancel order
```

Size scale: `sm` (h-8 px-3 text-sm) · `md` (h-10 px-4) · `lg` (h-12 px-6 text-lg)

```tsx
// Primary button example
<button className="
  h-10 px-4 rounded-xl bg-primary text-white font-medium text-sm
  transition-all duration-150
  hover:bg-primary/90 hover:shadow-md
  active:scale-[0.97]
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Add to Cart
</button>
```

**Rules:**
- One primary button per screen section.
- Disabled state: `opacity-50 cursor-not-allowed` — never hide it.
- Loading state: replace label with `<Spinner size="sm" />`, keep width fixed with `min-w-[...]`.

---

### Input / Textarea

```tsx
<input className="
  w-full h-10 px-3 rounded-xl
  bg-surface border border-gray-200
  text-text text-sm placeholder:text-muted
  outline-none
  focus:border-primary focus:ring-2 focus:ring-primary/20
  transition-all duration-150
" />
```

- Focus ring: `ring-2 ring-primary/20` — 20% opacity prevents visual noise.
- Error state: replace border with `border-danger` and add `ring-danger/20`.
- Never use placeholder text as a label — always pair with a visible `<label>`.

---

### Card

Three variants:

**Product card** — fixed aspect ratio image + content below
```tsx
<div className="
  bg-surface rounded-2xl shadow-sm border border-gray-100
  overflow-hidden group
  transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
">
  <div className="aspect-square overflow-hidden">
    <img className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
  </div>
  <div className="p-4">
    ...content
  </div>
</div>
```

**Info card** — stats, summaries, no image
```tsx
<div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6">
```

**Glass card** — hero overlays, promotional banners
```tsx
<div className="
  backdrop-blur-md bg-white/70 dark:bg-black/40
  border border-white/30
  rounded-2xl shadow-lg
  p-6
">
```

---

### Badge

```
Variant   Classes
───────── ──────────────────────────────────────────────
success   bg-success/10 text-success
warning   bg-warning/10 text-warning
danger    bg-danger/10  text-danger
info      bg-info/10    text-info
neutral   bg-gray-100   text-gray-600
primary   bg-primary/10 text-primary
```

```tsx
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-success/10 text-success text-xs font-medium">
  In Stock
</span>
```

---

### Skeleton Loader

Match the exact shape of the real content:

```tsx
// Product card skeleton
<div className="bg-surface rounded-2xl overflow-hidden">
  <div className="aspect-square bg-gray-100 animate-pulse" />
  <div className="p-4 space-y-2">
    <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
    <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
    <div className="h-8 bg-gray-100 rounded-xl animate-pulse mt-3" />
  </div>
</div>
```

---

### Toast / Notification

Positioned `bottom-4 right-4`, stacks upward with a `4px` gap between items.

```
Type      Left border color   Icon
───────── ─────────────────── ────────────
success   border-success      CheckCircle
error     border-danger       XCircle
warning   border-warning      AlertTriangle
info      border-info         Info
```

Auto-dismiss: 4 seconds. Always provide a manual dismiss `×` button.

---

### Modal

```
Overlay:  bg-black/50 backdrop-blur-sm
Panel:    bg-surface rounded-3xl shadow-xl p-6 max-w-md w-full
Enter:    opacity-0 scale-95 → opacity-100 scale-100, duration-200 ease-out
Exit:     opacity-100 scale-100 → opacity-0 scale-95, duration-150 ease-in
```

Trap focus inside modal. Close on `Escape`. Close on overlay click unless `disableBackdropClose` is set (used in destructive confirmations).

---

### Star Rating

Five stars. Filled: `text-amber-400`. Empty: `text-gray-200`. Half-star via CSS clip.

```tsx
// Display only
<div className="flex items-center gap-0.5">
  {[1,2,3,4,5].map(n => (
    <StarIcon key={n} className={n <= rating ? 'text-amber-400' : 'text-gray-200'} size={16} />
  ))}
  <span className="text-sm text-muted ml-1">({reviewCount})</span>
</div>
```

---

## Page Layouts

### Homepage `(store)/page.tsx`

```
┌──────────────────────────────────────────┐
│  HEADER  logo · search · cart · account  │  h-16, sticky, bg-surface/80 blur
├──────────────────────────────────────────┤
│                                          │
│  HERO BANNER  (full viewport height)     │  bg-secondary, hero image, gradient
│  headline · tagline · CTA button         │
│                                          │
├──────────────────────────────────────────┤
│  CATEGORY GRID  (horizontal scroll mob)  │  7 category cards, emoji/icon
├──────────────────────────────────────────┤
│  FEATURED PRODUCTS  (horizontal scroll)  │  "Best Sellers" heading + 4–8 cards
├──────────────────────────────────────────┤
│  PROMO BANNER  (full-width strip)        │  accent bg, bold text, secondary CTA
├──────────────────────────────────────────┤
│  NEW ARRIVALS  product grid (3–4 cols)   │
├──────────────────────────────────────────┤
│  TRUST BADGES  (icons + labels row)      │  Free delivery · Secure · Returns
├──────────────────────────────────────────┤
│  FOOTER  links · social · copyright      │  bg-secondary text-white
└──────────────────────────────────────────┘
```

---

### Product Listing `(store)/products/page.tsx`

```
┌──────────────────────────────────────────┐
│  HEADER                                  │
├──────────────────────────────────────────┤
│  BREADCRUMB + PAGE TITLE                 │
├─────────────┬────────────────────────────┤
│  FILTER     │  SORT BAR + RESULT COUNT   │
│  SIDEBAR    ├────────────────────────────┤
│  (240px)    │  PRODUCT GRID              │
│             │  1 / 2 / 3 / 4 cols        │
│  Categories │                            │
│  Price      │  (infinite scroll or       │
│  Brand      │   pagination)              │
│  In Stock   │                            │
│             │                            │
└─────────────┴────────────────────────────┘
```

On mobile: filter sidebar becomes a slide-up drawer triggered by a "Filters" button.

---

### Product Detail `(store)/products/[slug]/page.tsx`

```
┌──────────────────────────────────────────┐
│  HEADER                                  │
├──────────────────────────────────────────┤
│  BREADCRUMB                              │
├─────────────────────┬────────────────────┤
│  IMAGE GALLERY      │  PRODUCT INFO      │
│                     │                    │
│  Main image (1:1)   │  Name              │
│  Thumbnail strip    │  Rating            │
│                     │  Price / Compare   │
│                     │  Stock badge       │
│                     │  Variant selector  │
│                     │  Qty + Add to Cart │
│                     │  Wishlist          │
│                     │  Delivery info     │
├─────────────────────┴────────────────────┤
│  TABS: Description · Specs · Reviews     │
├──────────────────────────────────────────┤
│  RELATED PRODUCTS  (horizontal scroll)   │
└──────────────────────────────────────────┘
```

---

### Cart Page `(store)/cart/page.tsx`

```
┌──────────────────────────────────────────┐
│  HEADER                                  │
├─────────────────────────────┬────────────┤
│  CART ITEMS LIST            │  ORDER     │
│                             │  SUMMARY   │
│  [img] name · variant       │            │
│         qty stepper · price │  Subtotal  │
│         remove link         │  Delivery  │
│                             │  Total     │
│  ─── (repeat per item) ─── │            │
│                             │  Checkout  │
│                             │  button    │
└─────────────────────────────┴────────────┘
```

---

### Checkout Flow

Three sequential steps with a progress indicator at the top:

```
Step 1 — Address        Step 2 — Payment        Step 3 — Confirmation
─────────────────────   ─────────────────────   ──────────────────────
Full Name               COD  ○                  Order # ORD-2026-xxxxx
Phone                   EasyPaisa  ○             Status badge
Address Line 1          JazzCash  ○              Items summary
City / Province         ─────────────────────   Expected delivery
Postal Code             [If wallet selected]     "Continue Shopping"
                        Account # shown           button
[Continue]              TXN ID input
                        [Place Order]
```

---

### Admin Dashboard `(admin)/dashboard/page.tsx`

```
┌──────────┬───────────────────────────────┐
│          │  STAT CARDS (4 columns)        │
│  SIDEBAR │  Revenue · Orders · Customers  │
│          │  Low Stock                     │
│  Dash    ├───────────────────────────────┤
│  Prods   │  RECENT ORDERS TABLE           │
│  Orders  │  Order# · Customer · Total ·  │
│  Custs   │  Status · Action               │
│  Cats    ├───────────────────────────────┤
│  Settings│  LOW STOCK ALERTS              │
│          │  Product · SKU · Stock         │
└──────────┴───────────────────────────────┘
```

---

## Animations & Transitions

### Global Defaults

```css
/* Applied via Tailwind utilities — do not use raw CSS transitions */
transition-all duration-150   /* Micro: button hover, badge color */
transition-all duration-200   /* Standard: card hover, input focus */
transition-all duration-300   /* Deliberate: image zoom, menu open */
transition-all duration-500   /* Page-level: hero parallax */
```

### Specific Patterns

| Interaction | Animation |
|---|---|
| Product card hover | `hover:-translate-y-0.5 hover:shadow-md` + image `scale-105` |
| Button press | `active:scale-[0.97]` |
| Cart drawer open | slide in from right: `translate-x-full` → `translate-x-0`, duration-300 |
| Modal open | `scale-95 opacity-0` → `scale-100 opacity-100`, duration-200 ease-out |
| Toast enter | slide up from bottom: `translate-y-4 opacity-0` → `translate-y-0 opacity-100` |
| Page load skeleton | `animate-pulse` on placeholder shapes |
| Star rating hover | each star fills sequentially as cursor moves left-to-right |
| Quantity stepper | number fades between changes: `opacity-0` → `opacity-100` 150ms |

### Performance Rules

- Only animate `transform` and `opacity` — never `width`, `height`, or `margin`.
- Use `will-change: transform` only on elements that animate on every interaction (cart drawer, modal).
- Prefer `transition-*` Tailwind utilities over keyframe animations for hover states.
- Respect `prefers-reduced-motion` — wrap all non-essential animations:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Dark Mode

Dark mode is driven by CSS custom properties, not Tailwind's `dark:` prefix (except for structural layout). When `prefers-color-scheme: dark` is active (or when the user toggles via `uiStore`):

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:      #0F172A;
    --color-surface: #1E293B;
    --color-text:    #F1F5F9;
    --color-muted:   #94A3B8;
  }
}
```

Brand colors (`primary`, `secondary`, `accent`) do not change in dark mode — they are the brand's identity.

**Rules:**
- Never use hardcoded `#fff` or `#000` — always `var(--color-surface)` / `var(--color-text)`.
- Image overlays use `bg-black/50` so they work in both modes.
- Admin panel always uses light mode (data-dense interfaces are harder to read in dark mode).

---

## Responsive Design

### Breakpoints

```
xs     0 – 479px     Small phones (iPhone SE)
sm     480 – 639px   Standard phones
md     640 – 767px   Large phones / small tablets
lg     768 – 1023px  Tablets (iPad portrait)
xl     1024 – 1279px Laptops
2xl    1280px+        Desktops
```

### Mobile-First Rules

- Write base styles for mobile, override at larger breakpoints.
- Navigation: bottom tab bar on mobile (`fixed bottom-0`), top header on tablet+.
- Sidebars (filter, admin): slide-out drawer on mobile, persistent column on desktop.
- Product grid: 1 col → 2 col → 3 col → 4 col (see grid specs above).
- Hero: `min-h-[60vh]` mobile, `min-h-screen` desktop.
- Cart: full-page on mobile, drawer on desktop.
- Images: always `object-cover` with explicit aspect ratio to prevent layout shift.

### Touch Targets

All interactive elements must be at minimum **44×44px** on touch devices. This applies to:
- Quantity stepper buttons (`+` / `−`)
- Wishlist heart icon
- Image gallery navigation arrows
- Cart item remove button

---

## Iconography

Use **Lucide React** as the icon library — it is tree-shaken and consistent.

```tsx
import { ShoppingCart, Heart, Search, User, ChevronRight } from 'lucide-react'
```

### Size Scale

| Context | Size | Tailwind |
|---|---|---|
| Inline with text (body) | 16px | `size-4` |
| Inline with text (heading) | 20px | `size-5` |
| Button icon | 20px | `size-5` |
| Nav icons | 24px | `size-6` |
| Feature / section icons | 32px | `size-8` |
| Empty state illustrations | 64px | `size-16` |

### Rules

- Icons accompanying text: left-aligned, vertically centered, `gap-1.5` from text.
- Standalone interactive icons (cart, wishlist): wrap in a button with `p-2` padding to meet touch target size.
- Never scale icons with `w-full` — always use fixed size tokens.
- Category icons: use emoji or SVG illustrations, not Lucide (too abstract for pet categories).

---

## Accessibility

### Standards

Target **WCAG 2.1 AA** compliance.

### Color Contrast

| Pair | Min ratio | Check |
|---|---|---|
| Body text on `--color-bg` | 4.5:1 | `#111827` on `#F9FAFB` = 16.8:1 |
| Body text on `--color-surface` | 4.5:1 | `#111827` on `#FFFFFF` = 18.1:1 |
| Primary button text (white on primary) | 3:1 | Check per brand color |
| Muted text on surface | 4.5:1 | `#6B7280` on `#FFFFFF` = 5.7:1 |

When brands supply a custom `primaryColor`, validate contrast with white text using the formula. If below 3:1, use `text-text` on the button instead of `text-white`.

### Focus Styles

```css
/* Applied globally — never remove focus styles */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Semantic HTML

- Product headings: `<h2>` inside product cards (not `<p>` or `<div>`).
- Price: `<data value="1200">₨ 1,200</data>`.
- Star rating: `<div role="img" aria-label="4 out of 5 stars">`.
- Cart count badge: `<span aria-live="polite" aria-label="3 items in cart">`.
- Form fields: every `<input>` has a matching `<label htmlFor>`.
- Loading state: `aria-busy="true"` on the container, `aria-live="polite"` on the result region.

### Keyboard Navigation

- Tab order matches visual reading order (left-to-right, top-to-bottom).
- Cart drawer: trap focus while open; restore focus to trigger button on close.
- Modal: same as cart drawer.
- Product gallery: left/right arrow keys navigate images.
- Quantity stepper: `+` / `−` buttons are `<button>`, not `<div>` — keyboard operable by default.

---

## Design Tokens Reference

Complete reference for all tokens used in the codebase.

```css
/* === BRAND (per-client, from brand.config.ts) === */
--color-primary
--color-secondary
--color-accent
--color-bg
--color-surface
--color-text
--color-muted
--font-sans

/* === SEMANTIC (fixed across all brands) === */
--color-success:  #16A34A;
--color-warning:  #D97706;
--color-danger:   #DC2626;
--color-info:     #2563EB;

/* === RADIUS === */
--radius-sm:   6px;
--radius-md:   12px;
--radius-lg:   16px;
--radius-xl:   24px;

/* === SHADOW === */
/* Use Tailwind shadow-sm / shadow-md / shadow-lg / shadow-xl */

/* === TRANSITION === */
--duration-fast:     150ms;
--duration-standard: 200ms;
--duration-slow:     300ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in:  cubic-bezier(0.4, 0, 1, 1);
```

### Quick-Reference: Component → Token Mapping

| Component | Background | Border | Text | Shadow |
|---|---|---|---|---|
| Page | `--color-bg` | — | `--color-text` | — |
| Card | `--color-surface` | `gray-100` | `--color-text` | `shadow-sm` |
| Header | `--color-surface/80` blur | `gray-100` | `--color-text` | `shadow-sm` |
| Footer | `--color-secondary` | — | `white` | — |
| Primary button | `--color-primary` | — | `white` | — |
| Ghost button | transparent | current | `--color-text` | — |
| Input | `--color-surface` | `gray-200` | `--color-text` | — |
| Input:focus | `--color-surface` | `--color-primary` | `--color-text` | `ring-primary/20` |
| Badge success | `success/10` | — | `success` | — |
| Badge danger | `danger/10` | — | `danger` | — |
| Modal overlay | `black/50` blur | — | — | — |
| Modal panel | `--color-surface` | — | `--color-text` | `shadow-xl` |
| Toast | `--color-surface` | left `4px solid` | `--color-text` | `shadow-xl` |

---

> This document governs all UI decisions in the PetStore codebase. When in doubt: use a token, not a hardcoded value. When a token doesn't exist, propose adding one here before hardcoding.
