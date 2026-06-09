import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth/password"
import { resetPasswordSchema } from "@/lib/validations"

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = resetPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { token, password } = parsed.data

    const reset = await prisma.passwordReset.findUnique({ where: { token } })
    if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
      return NextResponse.json({ error: "This reset link is invalid or has expired" }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)
    await prisma.$transaction([
      prisma.user.update({ where: { id: reset.userId }, data: { passwordHash } }),
      prisma.passwordReset.update({ where: { id: reset.id }, data: { usedAt: new Date() } }),
    ])

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 })
  }
}
