"use client"

import { useState } from "react"
import Link from "next/link"

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
  const [showPw, setShowPw]   = useState(false)
  const [agreed, setAgreed]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState<Record<string,string>>({})

  function set(f: string, v: string) { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: "" })) }

  function validate() {
    const e: Record<string,string> = {}
    if (!form.name.trim())        e.name    = "Name is required"
    if (!form.email.trim())       e.email   = "Email is required"
    if (form.password.length < 8) e.password= "Password must be at least 8 characters"
    if (form.password !== form.confirm) e.confirm = "Passwords do not match"
    if (!agreed)                  e.agreed  = "You must accept the terms"
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => setLoading(false), 1200)
  }

  const fields = [
    { key: "name",     label: "Full Name",        type: "text",     placeholder: "Muhammad Ali" },
    { key: "email",    label: "Email Address",     type: "email",    placeholder: "you@example.com" },
    { key: "password", label: "Password",          type: showPw ? "text" : "password", placeholder: "Min. 8 characters", hasToggle: true },
    { key: "confirm",  label: "Confirm Password",  type: showPw ? "text" : "password", placeholder: "Repeat your password" },
  ]

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create account 🐾</h1>
          <p className="text-gray-500 text-sm mt-1">Join thousands of happy pet owners</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(field => (
            <div key={field.key}>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">{field.label}</label>
              <div className="relative">
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full h-11 px-4 ${field.hasToggle ? "pr-11" : ""} rounded-xl border text-sm outline-none transition-all focus:ring-2 ${
                    errors[field.key] ? "border-danger focus:ring-danger/20" : "border-gray-200 focus:border-primary focus:ring-primary/20"
                  }`}
                />
                {field.hasToggle && (
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {showPw ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                    </svg>
                  </button>
                )}
              </div>
              {errors[field.key] && <p className="text-xs text-danger mt-1">{errors[field.key]}</p>}
            </div>
          ))}

          {/* Terms */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(p => ({ ...p, agreed: "" })) }}
                className="mt-0.5 accent-primary" />
              <span className="text-xs text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-primary font-semibold hover:text-primary/80">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy-policy" className="text-primary font-semibold hover:text-primary/80">Privacy Policy</Link>
              </span>
            </label>
            {errors.agreed && <p className="text-xs text-danger mt-1">{errors.agreed}</p>}
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg> Creating account...</>
            ) : "Create Account"}
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
