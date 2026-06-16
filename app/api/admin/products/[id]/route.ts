import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"
import { productSchema } from "@/lib/validations"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const product = await prisma.product.findUnique({
    where:   { id },
    include: { category: true, images: { orderBy: { order: "asc" } }, variants: true },
  })

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ product })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const body   = await req.json()
    const parsed = productSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { categoryId, ...data } = parsed.data as typeof parsed.data & { categoryId?: string }
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      },
    })

    // Optional stock update — keep a single "Default" variant in sync.
    if (Number.isFinite(body?.stock)) {
      const stock    = Math.max(0, Math.trunc(body.stock))
      const existing = await prisma.productVariant.findFirst({ where: { productId: id } })
      if (existing) await prisma.productVariant.update({ where: { id: existing.id }, data: { stock } })
      else          await prisma.productVariant.create({ data: { productId: id, name: "Default", value: "Standard", stock } })
    }

    // Optional image update — replace the primary image.
    if (typeof body?.imageUrl === "string" && body.imageUrl.trim()) {
      await prisma.productImage.deleteMany({ where: { productId: id } })
      await prisma.productImage.create({ data: { productId: id, url: body.imageUrl.trim(), altText: product.name, order: 0 } })
    }

    return NextResponse.json({ product })
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
