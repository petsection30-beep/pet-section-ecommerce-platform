import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const product = await prisma.product.findUnique({
      where:   { slug, isActive: true },
      include: {
        category: { select: { name: true, slug: true } },
        images:   { orderBy: { order: "asc" } },
        variants: true,
        reviews:  {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
          take:    10,
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
