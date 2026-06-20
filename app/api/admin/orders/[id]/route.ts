import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"
import { sendEmail } from "@/lib/email/send"
import { orderTotalUpdateEmail } from "@/lib/email/templates/orderTotalUpdate"
import { z } from "zod"

const patchSchema = z.object({
  deliveryFee: z.number().int().min(0, "Delivery fee cannot be negative"),
})

// Manually override the delivery fee on a single order; the total is
// recomputed server-side from the order's stored subtotal.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id }   = await params
  const parsed   = patchSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const existing = await prisma.order.findUnique({
    where:  { id },
    select: { subtotal: true, deliveryFee: true, user: { select: { name: true, email: true } } },
  })
  if (!existing) return NextResponse.json({ error: "Order not found" }, { status: 404 })

  const deliveryFee = parsed.data.deliveryFee
  const total       = existing.subtotal + deliveryFee
  const order = await prisma.order.update({
    where: { id },
    data:  { deliveryFee, total },
  })

  // Notify the customer only when the fee actually changed (non-blocking).
  if (deliveryFee !== existing.deliveryFee) {
    const { subject, html } = orderTotalUpdateEmail({
      orderId:      order.id,
      customerName: existing.user.name,
      subtotal:     existing.subtotal,
      deliveryFee,
      total,
    })
    sendEmail(existing.user.email, subject, html).catch(() => {})
  }

  return NextResponse.json({ order })
}

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
