import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"
import { z } from "zod"

const settingsSchema = z.object({
  storeName:        z.string().min(1).optional(),
  storeTagline:     z.string().optional(),
  storeDescription: z.string().optional(),
  contactEmail:     z.string().email().optional().or(z.literal("")),
  contactPhone:     z.string().optional(),
  address:          z.string().optional(),
  instagram:        z.string().optional(),
  facebook:         z.string().optional(),
  tiktok:           z.string().optional(),
  whatsapp:         z.string().optional(),
  codEnabled:          z.boolean().optional(),
  easypaisaEnabled:    z.boolean().optional(),
  easypaisaTitle:      z.string().optional(),
  easypaisaNumber:     z.string().optional(),
  nayapayEnabled:      z.boolean().optional(),
  nayapayTitle:        z.string().optional(),
  nayapayNumber:       z.string().optional(),
  bankTransferEnabled: z.boolean().optional(),
  bankName:            z.string().optional(),
  bankAccountTitle:    z.string().optional(),
  bankAccountNumber:   z.string().optional(),
  bankIban:            z.string().optional(),
  deliveryFee:           z.number().int().min(0).optional(),
  freeDeliveryEnabled:   z.boolean().optional(),
  freeDeliveryThreshold: z.number().int().min(0).optional(),
})

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const settings = await prisma.siteSetting.findUnique({ where: { id: "singleton" } })
  return NextResponse.json({ settings })
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body   = await req.json()
  const parsed = settingsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const settings = await prisma.siteSetting.upsert({
    where:  { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  })

  return NextResponse.json({ settings })
}
