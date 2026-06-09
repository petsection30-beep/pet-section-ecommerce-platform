import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email/send"
import { passwordResetEmail } from "@/lib/email/templates/passwordReset"
import { forgotPasswordSchema } from "@/lib/validations"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = forgotPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { email } = parsed.data
    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success to avoid email enumeration
    if (!user) {
      return NextResponse.json({ ok: true })
    }

    const token     = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

    await prisma.passwordReset.create({ data: { userId: user.id, token, expiresAt } })

    const appUrl   = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    const resetUrl = `${appUrl}/reset-password?token=${token}`
    const { subject, html } = passwordResetEmail(user.name, resetUrl)

    await sendEmail(user.email, subject, html)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
  }
}
