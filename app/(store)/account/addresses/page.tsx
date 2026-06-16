"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Breadcrumb from "@/components/ui/Breadcrumb"

const PROVINCES = ["Punjab", "Sindh", "KPK", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "AJK"]

type Address = {
  id: string; fullName: string; phone: string; line1: string; line2: string | null
  city: string; province: string; postalCode: string; isDefault: boolean
}

const EMPTY = { fullName: "", phone: "", line1: "", line2: "", city: "", province: "Punjab", postalCode: "" }

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading]     = useState(true)
  const [unauth, setUnauth]       = useState(false)
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState(EMPTY)
  const [error, setError]         = useState("")
  const [saving, setSaving]       = useState(false)

  function load() {
    fetch("/api/addresses")
      .then(r => { if (r.status === 401) { setUnauth(true); return null } return r.json() })
      .then(d => { if (d) setAddresses(d.addresses) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      const res  = await fetch("/api/addresses", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone: form.phone.replace(/[\s-]/g, "") }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Failed to save address"); return }
      setAddresses(prev => [data.address, ...prev.map(a => data.address.isDefault ? { ...a, isDefault: false } : a)])
      setForm(EMPTY)
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  async function setDefault(id: string) {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
    await fetch(`/api/addresses/${id}`, { method: "PATCH" }).catch(() => {})
  }
  async function remove(id: string) {
    setAddresses(prev => prev.filter(a => a.id !== id))
    await fetch(`/api/addresses/${id}`, { method: "DELETE" }).catch(() => {})
  }

  const inputCls = "w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account", href: "/account" }, { label: "Addresses" }]} />
        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Addresses</h1>
          {!unauth && (
            <button onClick={() => { setShowForm(s => !s); setError("") }} className="h-9 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
              {showForm ? "Cancel" : "+ Add New"}
            </button>
          )}
        </div>

        {/* Add form */}
        {showForm && !unauth && (
          <form onSubmit={add} className="mt-5 bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            {error && <div className="px-4 py-2.5 rounded-xl bg-danger/10 text-danger text-sm font-medium">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className={inputCls} placeholder="Full name *" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
              <input className={inputCls} placeholder="Phone (03001234567) *" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              <input className={`${inputCls} sm:col-span-2`} placeholder="Address line 1 *" value={form.line1} onChange={e => setForm(f => ({ ...f, line1: e.target.value }))} />
              <input className={`${inputCls} sm:col-span-2`} placeholder="Address line 2 (optional)" value={form.line2} onChange={e => setForm(f => ({ ...f, line2: e.target.value }))} />
              <input className={inputCls} placeholder="City *" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              <select className={`${inputCls} bg-white`} value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))}>
                {PROVINCES.map(p => <option key={p}>{p}</option>)}
              </select>
              <input className={inputCls} placeholder="Postal code (optional)" value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} />
            </div>
            <button type="submit" disabled={saving} className="h-10 px-6 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
              {saving ? "Saving…" : "Save Address"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="py-20 flex justify-center">
            <svg className="size-7 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg>
          </div>
        ) : unauth ? (
          <div className="text-center py-20">
            <span className="text-5xl">🔒</span>
            <p className="mt-4 font-bold text-gray-700">Please sign in</p>
            <Link href="/login?next=/account/addresses" className="inline-flex mt-4 h-10 px-5 items-center rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Sign In</Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {addresses.map(addr => (
              <div key={addr.id} className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <span className="font-bold text-sm text-gray-900">{addr.fullName}</span>
                    {addr.isDefault && <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold">Default</span>}
                  </div>
                  <div className="flex gap-2">
                    {!addr.isDefault && <button onClick={() => setDefault(addr.id)} className="text-xs text-primary font-medium hover:text-primary/80 transition-colors">Set Default</button>}
                    <button onClick={() => remove(addr.id)} className="text-xs text-danger font-medium hover:text-danger/80 transition-colors">Remove</button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 leading-relaxed">
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>{addr.city}, {addr.province}{addr.postalCode ? ` ${addr.postalCode}` : ""}</p>
                  <p>{addr.phone}</p>
                </div>
              </div>
            ))}
            {addresses.length === 0 && (
              <div className="text-center py-16">
                <span className="text-5xl">📍</span>
                <p className="mt-4 font-semibold text-gray-700">No saved addresses</p>
                <p className="text-sm text-gray-500 mt-1">Add one to speed up checkout.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
