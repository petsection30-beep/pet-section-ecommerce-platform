import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/session"
import { z } from "zod"

const addressInput = z.object({
  label:      z.string().optional(),
  fullName:   z.string().min(2, "Full name is required"),
  phone:      z.string().regex(/^(\+92|0)[0-9]{10}$/, "Enter a valid Pakistani phone number"),
  line1:      z.string().min(5, "Address is required"),
  line2:      z.string().optional(),
  city:       z.string().min(2, "City is required"),
  province:   z.string().min(2, "Province is required"),
  postalCode: z.string().regex(/^\d{5}$/, "Postal code must be 5 digits").optional().or(z.literal("")),
  isDefault:  z.boolean().optional(),
})

export async function GET() {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const addresses = await prisma.address.findMany({
    where:   { userId: session.userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  })
  return NextResponse.json({ addresses })
}

export async function POST(req: NextRequest) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body   = await req.json()
  const parsed = addressInput.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }
  const d = parsed.data

  // First address is default by default; or honour an explicit flag.
  const existingCount = await prisma.address.count({ where: { userId: session.userId } })
  const makeDefault   = d.isDefault || existingCount === 0

  if (makeDefault) {
    await prisma.address.updateMany({ where: { userId: session.userId }, data: { isDefault: false } })
  }

  const address = await prisma.address.create({
    data: {
      userId:     session.userId,
      fullName:   d.fullName,
      phone:      d.phone,
      line1:      d.line1,
      line2:      d.line2 ?? null,
      city:       d.city,
      province:   d.province,
      postalCode: d.postalCode || "",
      isDefault:  makeDefault,
    },
  })

  return NextResponse.json({ address }, { status: 201 })
}
