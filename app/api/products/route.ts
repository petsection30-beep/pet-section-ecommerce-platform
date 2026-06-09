import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const category = searchParams.get("category")
    const q        = searchParams.get("q")
    const sort     = searchParams.get("sort") ?? "newest"
    const inStock  = searchParams.get("inStock")
    const featured = searchParams.get("featured")
    const page     = Math.max(1, Number(searchParams.get("page") ?? 1))
    const limit    = Math.min(48, Math.max(1, Number(searchParams.get("limit") ?? 24)))

    const where = {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(q ? {
        OR: [
          { name:        { contains: q, mode: "insensitive" as const } },
          { description: { contains: q, mode: "insensitive" as const } },
        ],
      } : {}),
      ...(inStock === "true"  ? { variants: { some: { stock: { gt: 0 } } } } : {}),
      ...(featured === "true" ? { isFeatured: true } : {}),
    }

    const orderBy =
      sort === "price-asc"  ? { price: "asc"  as const } :
      sort === "price-desc" ? { price: "desc" as const } :
                              { createdAt: "desc" as const }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip:    (page - 1) * limit,
        take:    limit,
        include: {
          category: { select: { name: true, slug: true } },
          images:   { orderBy: { order: "asc" }, take: 1 },
          variants: { select: { stock: true } },
          reviews:  { select: { rating: true } },
        },
      }),
      prisma.product.count({ where }),
    ])

    const data = products.map((p) => ({
      id:           p.id,
      slug:         p.slug,
      name:         p.name,
      price:        p.price,
      comparePrice: p.comparePrice,
      category:     p.category.name,
      categorySlug: p.category.slug,
      image:        p.images[0]?.url ?? null,
      inStock:      p.variants.some((v) => v.stock > 0),
      rating:       p.reviews.length
        ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
        : null,
      reviewCount:  p.reviews.length,
    }))

    return NextResponse.json({ products: data, total, page, pages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
