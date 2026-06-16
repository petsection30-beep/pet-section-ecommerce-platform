"use client"

import { useEffect, useState } from "react"

type Settings = {
  storeName: string; storeTagline: string; storeDescription: string
  contactEmail: string; contactPhone: string; address: string
  instagram: string; facebook: string; tiktok: string; whatsapp: string
  codEnabled: boolean
  easypaisaEnabled: boolean; easypaisaTitle: string; easypaisaNumber: string
  jazzcashEnabled: boolean;  jazzcashTitle: string;  jazzcashNumber: string
}

const EMPTY: Settings = {
  storeName: "", storeTagline: "", storeDescription: "",
  contactEmail: "", contactPhone: "", address: "",
  instagram: "", facebook: "", tiktok: "", whatsapp: "",
  codEnabled: true,
  easypaisaEnabled: true, easypaisaTitle: "", easypaisaNumber: "",
  jazzcashEnabled: true, jazzcashTitle: "", jazzcashNumber: "",
}

export default function AdminSettingsPage() {
  const [form, setForm]       = useState<Settings>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [toast, setToast]     = useState("")

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(d => { if (d.settings) setForm({ ...EMPTY, ...Object.fromEntries(Object.entries(d.settings).filter(([, v]) => v !== null)) }) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function set<K extends keyof Settings>(k: K, v: Settings[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      })
      setToast(res.ok ? "✓ Settings saved" : "Failed to save")
    } catch {
      setToast("Failed to save")
    } finally {
      setSaving(false)
      setTimeout(() => setToast(""), 2200)
    }
  }

  const inputCls = "w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"

  if (loading) {
    return <div className="py-24 flex justify-center"><svg className="size-7 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg></div>
  }

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium shadow-lg">{toast}</div>}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">These values drive your storefront, checkout, and emails.</p>
        </div>
        <button onClick={save} disabled={saving} className="h-10 px-6 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 active:scale-[0.97] transition-all disabled:opacity-60">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Store info */}
        <Section title="Store Information" emoji="🏪">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Store Name"><input className={inputCls} value={form.storeName} onChange={e => set("storeName", e.target.value)} /></Field>
            <Field label="Tagline"><input className={inputCls} value={form.storeTagline} onChange={e => set("storeTagline", e.target.value)} /></Field>
            <Field label="Contact Email"><input type="email" className={inputCls} value={form.contactEmail} onChange={e => set("contactEmail", e.target.value)} /></Field>
            <Field label="Contact Phone"><input className={inputCls} value={form.contactPhone} onChange={e => set("contactPhone", e.target.value)} /></Field>
            <Field label="Address" full><input className={inputCls} value={form.address} onChange={e => set("address", e.target.value)} /></Field>
            <Field label="Store Description" full><textarea rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" value={form.storeDescription} onChange={e => set("storeDescription", e.target.value)} /></Field>
          </div>
        </Section>

        {/* Payments */}
        <Section title="Payment Methods" emoji="💳">
          <div className="space-y-4">
            <Toggle label="Cash on Delivery (COD)" desc="Allow customers to pay on delivery" on={form.codEnabled} onChange={v => set("codEnabled", v)} />
            <div className="p-4 rounded-xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2"><span className="text-lg">📱</span> EasyPaisa</p>
                <Toggle label="" desc="" on={form.easypaisaEnabled} onChange={v => set("easypaisaEnabled", v)} compact />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Account Title"><input className={inputCls} value={form.easypaisaTitle} onChange={e => set("easypaisaTitle", e.target.value)} /></Field>
                <Field label="Account Number"><input className={inputCls} value={form.easypaisaNumber} onChange={e => set("easypaisaNumber", e.target.value)} /></Field>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2"><span className="text-lg">📲</span> JazzCash</p>
                <Toggle label="" desc="" on={form.jazzcashEnabled} onChange={v => set("jazzcashEnabled", v)} compact />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Account Title"><input className={inputCls} value={form.jazzcashTitle} onChange={e => set("jazzcashTitle", e.target.value)} /></Field>
                <Field label="Account Number"><input className={inputCls} value={form.jazzcashNumber} onChange={e => set("jazzcashNumber", e.target.value)} /></Field>
              </div>
            </div>
          </div>
        </Section>

        {/* Social */}
        <Section title="Social Links" emoji="🔗">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Instagram"><input className={inputCls} value={form.instagram} onChange={e => set("instagram", e.target.value)} placeholder="https://instagram.com/..." /></Field>
            <Field label="Facebook"><input className={inputCls} value={form.facebook} onChange={e => set("facebook", e.target.value)} placeholder="https://facebook.com/..." /></Field>
            <Field label="TikTok"><input className={inputCls} value={form.tiktok} onChange={e => set("tiktok", e.target.value)} placeholder="https://tiktok.com/..." /></Field>
            <Field label="WhatsApp"><input className={inputCls} value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="https://wa.me/..." /></Field>
          </div>
        </Section>

        {/* Theme / email note */}
        <Section title="Theme & Email" emoji="🎨">
          <p className="text-sm text-gray-500 leading-relaxed">
            Brand colours, fonts, and logo are managed in <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-xs">config/brand.config.ts</code> (white-label, code-driven).
            SMTP email credentials are configured via environment variables.
          </p>
        </Section>

        <div className="flex justify-end">
          <button onClick={save} disabled={saving} className="h-10 px-6 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 active:scale-[0.97] transition-all disabled:opacity-60">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><span className="text-xl leading-none">{emoji}</span> {title}</h2>
      {children}
    </div>
  )
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      {label && <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">{label}</label>}
      {children}
    </div>
  )
}

function Toggle({ label, desc, on, onChange, compact }: { label: string; desc: string; on: boolean; onChange: (v: boolean) => void; compact?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${compact ? "" : ""}`}>
      {label && <div><p className="text-sm font-medium text-gray-900">{label}</p><p className="text-xs text-gray-500">{desc}</p></div>}
      <div onClick={() => onChange(!on)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors shrink-0 ${on ? "bg-primary" : "bg-gray-200"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </div>
    </div>
  )
}
