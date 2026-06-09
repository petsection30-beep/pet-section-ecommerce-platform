"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import brand from "@/config/brand.config"

export default function RegisterPage() {
  const router = useRouter()
  const [form,    setForm]    = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")
  const [errors,  setErrors]  = useState<Record<string, string>>({})
  const [terms,   setTerms]   = useState(false)

  function field(k: string, v: string) { setForm(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: "" })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!terms) { setError("Please accept the terms and conditions"); return }
    const errs: Record<string, string> = {}
    if (form.name.length < 2)                    errs.name            = "Name must be at least 2 characters"
    if (!form.email.includes("@"))               errs.email           = "Enter a valid email address"
    if (form.password.length < 8)                errs.password        = "Password must be at least 8 characters"
    if (form.password !== form.confirmPassword)  errs.confirmPassword = "Passwords do not match"
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true); setError("")
    try {
      const res  = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Registration failed"); return }
      router.push("/account"); router.refresh()
    } catch { setError("Something went wrong. Please try again.")
    } finally { setLoading(false) }
  }

  const inputCls = (k: string) =>
    `w-full h-11 px-4 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors[k] ? "border-danger focus:border-danger" : "border-gray-200 focus:border-primary"}`

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🐾</div>
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 text-sm mt-1">Join {brand.storeName} — your pets will thank you</p>
        </div>
        {error && <div className="mb-4 px-4 py-3 rounded-xl bg-danger/10 text-danger text-sm font-medium text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">Full Name</label>
            <input type="text" value={form.name} onChange={e => field("name", e.target.value)} placeholder="Muhammad Ali" required autoComplete="name" className={inputCls("name")} />
            {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => field("email", e.target.value)} placeholder="you@example.com" required autoComplete="email" className={inputCls("email")} />
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
          </div>
          {(["password", "confirmPassword"] as const).map((k, i) => (
            <div key={k}>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">{i === 0 ? "Password" : "Confirm Password"}</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={form[k]} onChange={e => field(k, e.target.value)} placeholder="••••••••" required className={`${inputCls(k)} pr-11`} />
                {i === 0 && (
                  <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{show ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}</svg>
                  </button>
                )}
              </div>
              {errors[k] && <p className="text-xs text-danger mt-1">{errors[k]}</p>}
            </div>
          ))}
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="mt-0.5 accent-primary" />
            <span className="text-sm text-gray-600 leading-snug">
              I agree to the <Link href="/terms" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </span>
          </label>
          <button type="submit" disabled={loading}
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg> Creating account...</> : "Create Account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
