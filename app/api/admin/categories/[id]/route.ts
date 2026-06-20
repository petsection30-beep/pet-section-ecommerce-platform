import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"
import { categoryIcon } from "@/lib/category-icon"
import { z } from "zod"

const updateSchema = z.object({
  name:        z.string().min(2).optional(),
  slug:        z.string().regex(/^[a-z0-9-]+$/).optional(),
  emoji:       z.string().optional(),
  description: z.string().optional(),
  isActive:    z.boolean().optional(),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id }   = await params
  const parsed   = updateSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const data = { ...parsed.data }

  // On rename, resync the icon to the new name (unless an explicit, non-default
  // emoji was supplied). The slug stays stable so existing category links never
  // break — change it explicitly only if a slug is passed in.
  if (data.name && (!data.emoji || data.emoji === "🐾")) {
    data.emoji = categoryIcon(data.name)
  }

  try {
    const category = await prisma.category.update({ where: { id }, data })
    return NextResponse.json({ category })
  } catch {
    return NextResponse.json({ error: "Category name or slug already exists" }, { status: 409 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.category.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
