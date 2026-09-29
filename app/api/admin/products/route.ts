import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"
import { productSchema } from "@/lib/validations"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = req.nextUrl
  const q          = searchParams.get("q")?.trim()
  const category   = searchParams.get("category")?.trim()
  const status     = searchParams.get("status")?.trim()
  const featured   = searchParams.get("featured")?.trim()
  const stockState = searchParams.get("stock")?.trim()
  const sort       = searchParams.get("sort")?.trim() ?? "newest"

  const page = Math.max(1, Number(searchParams.get("page") ?? 1))
  const rawLimit = searchParams.get("limit")?.trim()
  const limit = rawLimit === "all" ? 1000 : Math.min(200, Math.max(1, Number(rawLimit ?? 20)))

  const where: Prisma.ProductWhereInput = {}

  if (q) {
    where.OR = [
      { name:        { contains: q, mode: "insensitive" } },
      { slug:        { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ]
  }

  if (category && category !== "All" && category !== "all") {
    where.category = {
      OR: [
        { id:   category },
        { slug: category },
        { name: category },
      ],
    }
  }

  if (status === "active")   where.isActive = true
  if (status === "inactive") where.isActive = false

  if (featured === "featured") where.isFeatured = true
  if (featured === "standard") where.isFeatured = false

  if (stockState === "inStock") {
    where.variants = { some: { stock: { gt: 0 } } }
  } else if (stockState === "outOfStock") {
    where.variants = { every: { stock: { lte: 0 } } }
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" }
  if (sort === "oldest")          orderBy = { createdAt: "asc" }
  else if (sort === "price_asc")  orderBy = { price: "asc" }
  else if (sort === "price_desc") orderBy = { price: "desc" }
  else if (sort === "name_asc")   orderBy = { name: "asc" }
  else if (sort === "name_desc")  orderBy = { name: "desc" }

  const [products, total, totalAll, totalActive, totalInactive, totalFeatured] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images:   { orderBy: { order: "asc" }, take: 1 },
        variants: { select: { id: true, name: true, stock: true } },
        _count:   { select: { orderItems: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: false } }),
    prisma.product.count({ where: { isFeatured: true } }),
  ])

  return NextResponse.json({
    products,
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
    counts: {
      all: totalAll,
      active: totalActive,
      inactive: totalInactive,
      featured: totalFeatured,
    },
  })
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body   = await req.json()
    const parsed = productSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { categoryId, slug, ...data } = parsed.data

    // Check slug uniqueness
    const existingSlug = await prisma.product.findUnique({ where: { slug } })
    if (existingSlug) {
      return NextResponse.json({ error: `Slug "${slug}" is already in use by another product.` }, { status: 400 })
    }

    const stock    = Number.isFinite(body?.stock) ? Math.max(0, Math.trunc(body.stock)) : 0
    const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : ""

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        category: { connect: { id: categoryId } },
        variants: { create: { name: "Default", value: "Standard", stock } },
        ...(imageUrl ? { images: { create: { url: imageUrl, altText: data.name, order: 0 } } } : {}),
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (err: unknown) {
    console.error("Create product error:", err)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
