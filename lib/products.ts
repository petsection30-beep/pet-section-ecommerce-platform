import { prisma } from "@/lib/prisma"
import type { Product } from "@/components/store/ProductCard"

// One DB product (with relations) → the shape ProductCard expects.
// Seeded products carry an image; emoji/gradient are graceful fallbacks
// for products created without one.
const GRADIENTS = [
  "from-orange-50 to-orange-100", "from-blue-50 to-blue-100",
  "from-green-50 to-green-100",   "from-purple-50 to-purple-100",
  "from-pink-50 to-pink-100",     "from-cyan-50 to-cyan-100",
  "from-amber-50 to-amber-100",   "from-teal-50 to-teal-100",
]

type DbProduct = {
  id: string; slug: string; name: string; price: number; comparePrice: number | null
  category: { name: string; slug: string }
  images: { url: string }[]
  variants: { stock: number }[]
  reviews: { rating: number }[]
}

export type CardProduct = Product & { categorySlug: string }

function mapCard(p: DbProduct): CardProduct {
  const gradient = GRADIENTS[p.id.charCodeAt(p.id.length - 1) % GRADIENTS.length]
  const rating = p.reviews.length
    ? Math.round((p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length) * 10) / 10
    : undefined
  return {
    id: p.id, slug: p.slug, name: p.name,
    category: p.category.name, categorySlug: p.category.slug,
    price: p.price, comparePrice: p.comparePrice ?? undefined,
    emoji: "🐾", gradient,
    image: p.images[0]?.url ?? null,
    inStock: p.variants.some(v => v.stock > 0),
    rating, reviewCount: p.reviews.length,
  }
}

const CARD_INCLUDE = {
  category: { select: { name: true, slug: true } },
  images:   { orderBy: { order: "asc" as const }, take: 1 },
  variants: { select: { stock: true } },
  reviews:  { select: { rating: true } },
}

export async function getFeaturedProducts(limit = 4): Promise<CardProduct[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { createdAt: "desc" }, take: limit, include: CARD_INCLUDE,
  })
  return (rows as unknown as DbProduct[]).map(mapCard)
}

export async function getNewArrivals(limit = 8): Promise<CardProduct[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }, take: limit, include: CARD_INCLUDE,
  })
  return (rows as unknown as DbProduct[]).map(mapCard)
}

export async function getProductsByCategorySlug(slug: string, limit = 24): Promise<CardProduct[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true, category: { slug } },
    orderBy: { createdAt: "desc" }, take: limit, include: CARD_INCLUDE,
  })
  return (rows as unknown as DbProduct[]).map(mapCard)
}

export async function searchProducts(query: string): Promise<CardProduct[]> {
  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name:        { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category:    { name: { contains: query, mode: "insensitive" } } },
      ],
    },
    orderBy: { createdAt: "desc" }, take: 48, include: CARD_INCLUDE,
  })
  return (rows as unknown as DbProduct[]).map(mapCard)
}
