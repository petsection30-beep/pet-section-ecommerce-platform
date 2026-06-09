import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"

export async function GET(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = req.nextUrl
  const q     = searchParams.get("q")
  const page  = Math.max(1, Number(searchParams.get("page") ?? 1))
  const limit = 20

  const where: Prisma.UserWhereInput = { role: "CUSTOMER" }
  if (q) {
    where.OR = [
      { name:  { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ]
  }

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip:    (page - 1) * limit,
      take:    limit,
      select: {
        id:        true,
        name:      true,
        email:     true,
        createdAt: true,
        orders:    { select: { total: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  const data = customers.map((c) => ({
    id:         c.id,
    name:       c.name,
    email:      c.email,
    joinedAt:   c.createdAt,
    orderCount: c.orders.length,
    totalSpent: c.orders.reduce((s, o) => s + o.total, 0),
  }))

  return NextResponse.json({ customers: data, total, page, pages: Math.ceil(total / limit) })
}
