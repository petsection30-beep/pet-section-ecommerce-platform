import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/auth/password"
import { getSession } from "@/lib/auth/session"
import { loginSchema } from "@/lib/validations"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const session = await getSession()
    session.userId    = user.id
    session.email     = user.email
    session.name      = user.name
    session.role      = user.role
    session.isLoggedIn = true
    await session.save()

    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role })
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
