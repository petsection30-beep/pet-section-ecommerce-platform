import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/session"

export async function GET() {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const items = await prisma.wishlistItem.findMany({
    where:   { userId: session.userId },
    include: {
      product: {
        include: {
          images:   { orderBy: { order: "asc" }, take: 1 },
          category: { select: { name: true, slug: true } },
          variants: { select: { stock: true } },
          reviews:  { select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { productId } = await req.json()
  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 })
  }

  const item = await prisma.wishlistItem.upsert({
    where:  { userId_productId: { userId: session.userId, productId } },
    update: {},
    create: { userId: session.userId, productId },
  })

  return NextResponse.json({ item }, { status: 201 })
}
