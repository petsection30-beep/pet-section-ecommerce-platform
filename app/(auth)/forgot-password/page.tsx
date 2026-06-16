"use client"

import { useState } from "react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("")
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Failed to send reset link"); return }
      setSent(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface rounded-3xl shadow-xl border border-gray-100 p-8">
        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>.
              The link expires in 30 minutes.
            </p>
            <Link href="/login" className="inline-flex h-11 items-center justify-center px-8 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🔑</div>
              <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
              <p className="text-gray-500 text-sm mt-1">Enter your email and we'll send a reset link</p>
            </div>

            {error && <div className="mb-4 px-4 py-3 rounded-xl bg-danger/10 text-danger text-sm font-medium text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">Email Address</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <button
                type="submit" disabled={loading || !email}
                className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg> Sending...</>
                ) : "Send Reset Link"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Remembered it?{" "}
              <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
