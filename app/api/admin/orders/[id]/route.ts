import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const order = await prisma.order.findUnique({
    where:   { id },
    include: {
      user:  { select: { name: true, email: true, id: true } },
      items: {
        include: {
          product: { select: { name: true, slug: true } },
          variant: { select: { name: true, value: true } },
        },
      },
    },
  })

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
  return NextResponse.json({ order })
}
