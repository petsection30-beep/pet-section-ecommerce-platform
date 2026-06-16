import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"
import { productSchema } from "@/lib/validations"

export async function GET(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = req.nextUrl
  const q        = searchParams.get("q")
  const category = searchParams.get("category")
  const page     = Math.max(1, Number(searchParams.get("page") ?? 1))
  const limit    = 20

  const where = {
    ...(q        ? { name:     { contains: q, mode: "insensitive" as const } } : {}),
    ...(category ? { category: { slug: category } } : {}),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip:    (page - 1) * limit,
      take:    limit,
      include: {
        category: { select: { name: true, slug: true } },
        images:   { orderBy: { order: "asc" }, take: 1 },
        variants: { select: { stock: true } },
      },
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) })
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

    const { categoryId, ...data } = parsed.data
    const stock    = Number.isFinite(body?.stock) ? Math.max(0, Math.trunc(body.stock)) : 0
    const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : ""

    const product = await prisma.product.create({
      data: {
        ...data,
        category: { connect: { id: categoryId } },
        variants: { create: { name: "Default", value: "Standard", stock } },
        ...(imageUrl ? { images: { create: { url: imageUrl, altText: data.name, order: 0 } } } : {}),
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
