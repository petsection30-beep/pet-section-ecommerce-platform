import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"
import { productSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const product = await prisma.product.findUnique({
    where:   { id },
    include: {
      category: true,
      images:   { orderBy: { order: "asc" } },
      variants: true,
      _count:   { select: { orderItems: true, reviews: true } },
    },
  })

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 })
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

    // Check slug uniqueness across other products
    if (parsed.data.slug) {
      const conflict = await prisma.product.findFirst({
        where: { slug: parsed.data.slug, NOT: { id } },
      })
      if (conflict) {
        return NextResponse.json({ error: `Slug "${parsed.data.slug}" is already in use by another product.` }, { status: 400 })
      }
    }

    const { categoryId, ...data } = parsed.data as typeof parsed.data & { categoryId?: string }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      },
      include: {
        category: true,
        images:   { orderBy: { order: "asc" } },
        variants: true,
      },
    })

    // Stock update — keep default variant in sync
    if (Number.isFinite(body?.stock)) {
      const stock = Math.max(0, Math.trunc(body.stock))
      const existing = await prisma.productVariant.findFirst({ where: { productId: id } })
      if (existing) {
        await prisma.productVariant.update({ where: { id: existing.id }, data: { stock } })
      } else {
        await prisma.productVariant.create({
          data: { productId: id, name: "Default", value: "Standard", stock },
        })
      }
    }

    // Image update — replace or remove
    if (body?.imageUrl !== undefined) {
      if (typeof body.imageUrl === "string" && body.imageUrl.trim()) {
        await prisma.productImage.deleteMany({ where: { productId: id } })
        await prisma.productImage.create({
          data: { productId: id, url: body.imageUrl.trim(), altText: product.name, order: 0 },
        })
      } else if (body.imageUrl === null || body.imageUrl === "") {
        await prisma.productImage.deleteMany({ where: { productId: id } })
      }
    }

    return NextResponse.json({ product })
  } catch (err: unknown) {
    console.error("Update product error:", err)
    return NextResponse.json({ error: "Failed to update product. Please check your inputs." }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: { select: { orderItems: true } },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // If product has been ordered in historical orders, deactivate it instead of breaking foreign keys
    if (product._count.orderItems > 0) {
      await prisma.product.update({
        where: { id },
        data:  { isActive: false, isFeatured: false },
      })
      return NextResponse.json({
        ok: true,
        deactivated: true,
        message: `Product "${product.name}" has ${product._count.orderItems} existing order record(s). It was deactivated to preserve customer order history.`,
      })
    }

    // If no order history, permanently delete product and cascading dependents
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({
      ok: true,
      deleted: true,
      message: `Product "${product.name}" was permanently deleted.`,
    })
  } catch (err: unknown) {
    console.error("Delete product error:", err)
    return NextResponse.json({ error: "Failed to delete product. Please try again." }, { status: 500 })
  }
}
