import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth/password"
import { getSession } from "@/lib/auth/session"
import { registerSchema } from "@/lib/validations"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: "CUSTOMER" },
    })

    const session = await getSession()
    session.userId    = user.id
    session.email     = user.email
    session.name      = user.name
    session.role      = user.role
    session.isLoggedIn = true
    await session.save()

    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role })
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
