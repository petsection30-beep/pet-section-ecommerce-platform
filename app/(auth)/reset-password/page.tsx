"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

function ResetInner() {
  const router = useRouter()
  const params = useSearchParams()
  const token  = params.get("token") ?? ""

  const [form, setForm]       = useState({ password: "", confirmPassword: "" })
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")
  const [done, setDone]       = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (form.password.length < 8)               return setError("Password must be at least 8 characters")
    if (form.password !== form.confirmPassword) return setError("Passwords do not match")

    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password, confirmPassword: form.confirmPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Password reset failed"); return }
      setDone(true)
      setTimeout(() => router.push("/login"), 1800)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid reset link</h1>
          <p className="text-sm text-gray-500 mb-6">This link is missing its token. Please request a new one.</p>
          <Link href="/forgot-password" className="inline-flex h-11 items-center justify-center px-8 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all">Request New Link</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface rounded-3xl shadow-xl border border-gray-100 p-8">
        {done ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Password reset!</h2>
            <p className="text-sm text-gray-500">Redirecting you to sign in…</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🔒</div>
              <h1 className="text-2xl font-bold text-gray-900">Set a new password</h1>
              <p className="text-gray-500 text-sm mt-1">Choose a strong password for your account</p>
            </div>
            {error && <div className="mb-4 px-4 py-3 rounded-xl bg-danger/10 text-danger text-sm font-medium text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">New Password</label>
                <div className="relative">
                  <input type={show ? "text" : "password"} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" required
                    className="w-full h-11 px-4 pr-11 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                  <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{show ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}</svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">Confirm Password</label>
                <input type={show ? "text" : "password"} value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="••••••••" required
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg> Resetting…</> : "Reset Password"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-500">
              <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">Back to Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-64" />}>
      <ResetInner />
    </Suspense>
  )
}
