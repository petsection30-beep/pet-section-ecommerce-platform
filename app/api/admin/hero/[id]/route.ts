import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"
import { z } from "zod"

const heroPatch = z.object({
  badge:     z.string().optional(),
  headline:  z.string().optional(),
  highlight: z.string().optional(),
  subtitle:  z.string().optional(),
  cta1Label: z.string().optional(),
  cta1Href:  z.string().optional(),
  cta2Label: z.string().optional(),
  cta2Href:  z.string().optional(),
  theme:     z.string().optional(),
  order:     z.number().int().optional(),
  isActive:  z.boolean().optional(),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id }  = await params
  const body    = await req.json()
  const parsed  = heroPatch.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  try {
    const slide = await prisma.heroSlide.update({ where: { id }, data: parsed.data })
    return NextResponse.json({ slide })
  } catch {
    return NextResponse.json({ error: "Slide not found" }, { status: 404 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.heroSlide.deleteMany({ where: { id } })
  return NextResponse.json({ ok: true })
}
