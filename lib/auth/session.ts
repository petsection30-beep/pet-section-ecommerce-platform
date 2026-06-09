import { getIronSession, SessionOptions } from "iron-session"
import { cookies } from "next/headers"

export type SessionData = {
  userId:    string
  email:     string
  name:      string
  role:      "CUSTOMER" | "ADMIN"
  isLoggedIn: boolean
}

export const sessionOptions: SessionOptions = {
  password:   process.env.SESSION_SECRET as string,
  cookieName: "pawspoint_session",
  cookieOptions: {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   60 * 60 * 24 * 7, // 7 days
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

export async function requireAuth() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return null
  }
  return session
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session.isLoggedIn || session.role !== "ADMIN") {
    return null
  }
  return session
}
