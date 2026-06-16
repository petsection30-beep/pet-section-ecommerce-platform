import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"
import { z } from "zod"

const heroSchema = z.object({
  badge:     z.string().min(1, "Badge is required"),
  headline:  z.string().min(1, "Headline is required"),
  highlight: z.string().default(""),
  subtitle:  z.string().min(1, "Subtitle is required"),
  cta1Label: z.string().min(1, "Primary button label is required"),
  cta1Href:  z.string().min(1, "Primary button link is required"),
  cta2Label: z.string().default(""),
  cta2Href:  z.string().default(""),
  theme:     z.string().default("navy"),
  order:     z.number().int().default(0),
  isActive:  z.boolean().default(true),
})

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } })
  return NextResponse.json({ slides })
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body   = await req.json()
  const parsed = heroSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const count = await prisma.heroSlide.count()
  const slide = await prisma.heroSlide.create({
    data: { ...parsed.data, order: parsed.data.order || count },
  })
  return NextResponse.json({ slide }, { status: 201 })
}
