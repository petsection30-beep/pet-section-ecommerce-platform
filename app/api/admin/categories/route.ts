import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"
import { z } from "zod"

const categorySchema = z.object({
  name:        z.string().min(2),
  slug:        z.string().regex(/^[a-z0-9-]+$/),
  emoji:       z.string().default("🐾"),
  description: z.string().optional(),
  isActive:    z.boolean().default(true),
})

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  })

  return NextResponse.json({ categories })
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body   = await req.json()
  const parsed = categorySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  try {
    const category = await prisma.category.create({ data: parsed.data })
    return NextResponse.json({ category }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Category already exists" }, { status: 409 })
  }
}
