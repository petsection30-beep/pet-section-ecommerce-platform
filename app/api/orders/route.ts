import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/session"
import { sendEmail } from "@/lib/email/send"
import { orderConfirmationEmail } from "@/lib/email/templates/orderConfirmation"
import { orderSchema } from "@/lib/validations"
import { getSettings } from "@/lib/settings"
import { computeDeliveryFee } from "@/lib/delivery"

export async function POST(req: NextRequest) {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ error: "You must be logged in to place an order" }, { status: 401 })
  }

  try {
    const body   = await req.json()
    const parsed = orderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const d = parsed.data

    // Non-COD payments require a TXN ID / payment reference
    if (d.paymentMethod !== "COD" && !d.txnId?.trim()) {
      return NextResponse.json({ error: "Transaction ID is required for online payments" }, { status: 400 })
    }

    const settings    = await getSettings()
    const subtotal    = d.items.reduce((s, i) => s + i.unitPrice * i.qty, 0)
    const deliveryFee = computeDeliveryFee(subtotal, settings)
    const total       = subtotal + deliveryFee

    const status =
      d.paymentMethod === "COD" ? "PENDING_COD" : "PENDING_VERIFICATION"

    const order = await prisma.order.create({
      data: {
        userId:       session.userId,
        status,
        paymentMethod: d.paymentMethod,
        txnId:         d.txnId ?? null,
        subtotal,
        deliveryFee,
        total,
        fullName:     d.fullName,
        phone:        d.phone,
        addressLine1: d.addressLine1,
        addressLine2: d.addressLine2 ?? null,
        city:         d.city,
        province:     d.province,
        postalCode:   d.postalCode,
        items: {
          create: d.items.map((i) => ({
            productId:   i.productId,
            variantId:   i.variantId ?? null,
            productName: i.productName,
            qty:         i.qty,
            unitPrice:   i.unitPrice,
          })),
        },
      },
      include: { items: true },
    })

    // Send confirmation email (non-blocking)
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { email: true, name: true },
    })
    if (user) {
      const { subject, html } = orderConfirmationEmail({
        orderId:       order.id,
        customerName:  user.name,
        items:         order.items,
        subtotal,
        deliveryFee,
        total,
        paymentMethod: d.paymentMethod,
        txnId:         d.txnId,
      })
      sendEmail(user.email, subject, html).catch(() => {})
    }

    return NextResponse.json({ orderId: order.id, status: order.status }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 })
  }
}

export async function GET() {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where:   { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { items: { select: { productName: true, qty: true, unitPrice: true } } },
  })

  return NextResponse.json({ orders })
}
