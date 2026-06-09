import { NextRequest, NextResponse } from "next/server"
import { Prisma, OrderStatus } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"

export async function GET(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = req.nextUrl
  const status = searchParams.get("status")
  const page   = Math.max(1, Number(searchParams.get("page") ?? 1))
  const limit  = 20

  const where: Prisma.OrderWhereInput = {}
  if (status) where.status = status as OrderStatus

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip:    (page - 1) * limit,
      take:    limit,
      include: {
        user:  { select: { name: true, email: true } },
        items: { select: { productName: true, qty: true } },
      },
    }),
    prisma.order.count({ where }),
  ])

  return NextResponse.json({ orders, total, page, pages: Math.ceil(total / limit) })
}
