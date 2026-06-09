import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"
import { sendEmail } from "@/lib/email/send"
import { orderStatusUpdateEmail } from "@/lib/email/templates/orderStatusUpdate"

const VALID_STATUSES = ["PENDING_COD", "PENDING_VERIFICATION", "CONFIRMED", "SHIPPED", "DELIVERED", "REJECTED", "CANCELLED"]

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id }    = await params
  const { status } = await req.json()

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const order = await prisma.order.update({
    where: { id },
    data:  { status },
    include: { user: { select: { name: true, email: true } } },
  })

  // Send status email for key transitions
  const notifyStatuses = ["CONFIRMED", "SHIPPED", "DELIVERED", "REJECTED"]
  if (notifyStatuses.includes(status)) {
    const { subject, html } = orderStatusUpdateEmail(order.id, order.user.name, status)
    sendEmail(order.user.email, subject, html).catch(() => {})
  }

  return NextResponse.json({ order })
}
