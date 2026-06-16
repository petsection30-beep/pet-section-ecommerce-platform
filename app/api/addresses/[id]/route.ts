import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/session"

// Set an address as the default (unsets the others).
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const owned = await prisma.address.findFirst({ where: { id, userId: session.userId } })
  if (!owned) return NextResponse.json({ error: "Address not found" }, { status: 404 })

  await prisma.address.updateMany({ where: { userId: session.userId }, data: { isDefault: false } })
  const address = await prisma.address.update({ where: { id }, data: { isDefault: true } })

  return NextResponse.json({ address })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const deleted = await prisma.address.deleteMany({ where: { id, userId: session.userId } })
  if (deleted.count === 0) return NextResponse.json({ error: "Address not found" }, { status: 404 })

  return NextResponse.json({ ok: true })
}
