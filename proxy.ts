import { NextRequest, NextResponse } from "next/server"
import { unsealData } from "iron-session"
import { sessionOptions, type SessionData } from "@/lib/auth/session"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const cookieValue = request.cookies.get(sessionOptions.cookieName as string)?.value
  let session: Partial<SessionData> = {}

  if (cookieValue) {
    try {
      session = await unsealData<SessionData>(cookieValue, {
        password: sessionOptions.password as string,
      })
    } catch {
      // Invalid or expired cookie — treat as not logged in
    }
  }

  // Redirect logged-in users away from auth pages
  if (session.isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/account", request.url))
  }

  // Protect account + checkout
  if (!session.isLoggedIn && (pathname.startsWith("/account") || pathname.startsWith("/checkout"))) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Protect admin
  if (pathname.startsWith("/admin")) {
    if (!session.isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/register", "/account/:path*", "/checkout/:path*", "/admin/:path*"],
}
