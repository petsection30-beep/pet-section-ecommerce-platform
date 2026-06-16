"use client"

import { useEffect, useState } from "react"
import { HERO_THEMES, getHeroTheme } from "@/lib/hero-themes"

type Slide = {
  id: string; order: number; badge: string; headline: string; highlight: string
  subtitle: string; cta1Label: string; cta1Href: string; cta2Label: string; cta2Href: string
  theme: string; isActive: boolean
}

const BLANK: Omit<Slide, "id" | "order"> = {
  badge: "", headline: "", highlight: "", subtitle: "",
  cta1Label: "Shop Now", cta1Href: "/products", cta2Label: "Browse Categories", cta2Href: "/categories",
  theme: "navy", isActive: true,
}

export default function AdminHeroPage() {
  const [slides, setSlides]   = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Slide | null>(null)
  const [form, setForm]       = useState(BLANK)
  const [showForm, setShowForm] = useState(false)
  const [error, setError]     = useState("")
  const [saving, setSaving]   = useState(false)
  const [toast, setToast]     = useState("")

  function load() {
    fetch("/api/admin/hero").then(r => r.json()).then(d => setSlides(d.slides ?? [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  function flash(m: string) { setToast(m); setTimeout(() => setToast(""), 2000) }

  function openNew() { setEditing(null); setForm(BLANK); setShowForm(true); setError("") }
  function openEdit(s: Slide) {
    setEditing(s)
    setForm({ badge: s.badge, headline: s.headline, highlight: s.highlight, subtitle: s.subtitle, cta1Label: s.cta1Label, cta1Href: s.cta1Href, cta2Label: s.cta2Label, cta2Href: s.cta2Href, theme: s.theme, isActive: s.isActive })
    setShowForm(true); setError("")
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!form.badge.trim() || !form.headline.trim() || !form.subtitle.trim() || !form.cta1Label.trim()) {
      setError("Badge, headline, subtitle and the primary button are required"); return
    }
    setSaving(true)
    try {
      const res = await fetch(editing ? `/api/admin/hero/${editing.id}` : "/api/admin/hero", {
        method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Failed to save"); return }
      setShowForm(false); load(); flash(editing ? "Slide updated" : "Slide added")
    } finally { setSaving(false) }
  }

  async function toggleActive(s: Slide) {
    setSlides(prev => prev.map(x => x.id === s.id ? { ...x, isActive: !x.isActive } : x))
    await fetch(`/api/admin/hero/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !s.isActive }) }).catch(() => load())
  }

  async function move(s: Slide, dir: -1 | 1) {
    const sorted = [...slides].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex(x => x.id === s.id)
    const swap = sorted[idx + dir]
    if (!swap) return
    await Promise.all([
      fetch(`/api/admin/hero/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: swap.order }) }),
      fetch(`/api/admin/hero/${swap.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: s.order }) }),
    ]).catch(() => {})
    load()
  }

  async function remove(s: Slide) {
    if (!confirm("Delete this hero slide?")) return
    setSlides(prev => prev.filter(x => x.id !== s.id))
    await fetch(`/api/admin/hero/${s.id}`, { method: "DELETE" }).catch(() => load())
  }

  const inputCls = "w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
  const sorted = [...slides].sort((a, b) => a.order - b.order)

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium shadow-lg">{toast}</div>}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Hero</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage the rotating banner slides on your storefront homepage.</p>
        </div>
        <button onClick={openNew} className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
          <span className="text-base leading-none">+</span> Add Slide
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={save} className="bg-white rounded-2xl border border-primary/30 shadow-sm p-6 mb-6 space-y-4">
          <h2 className="font-bold text-gray-900">{editing ? "Edit Slide" : "New Slide"}</h2>
          {error && <div className="px-4 py-2.5 rounded-xl bg-danger/10 text-danger text-sm font-medium">{error}</div>}

          {/* Live preview */}
          <div className={`rounded-2xl overflow-hidden bg-gradient-to-br ${getHeroTheme(form.theme).bg} p-8 text-center`}>
            <span className={`inline-flex items-center gap-2 ${getHeroTheme(form.theme).badgeBg} border rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide mb-3`}>{form.badge || "Badge text"}</span>
            <h3 className="text-2xl font-bold text-white whitespace-pre-line leading-tight">
              {(form.headline || "Your headline here").split("\n").map((line, i) => (
                <span key={i} className={`block ${form.highlight && line.includes(form.highlight) ? getHeroTheme(form.theme).accent : ""}`}>{line}</span>
              ))}
            </h3>
            <p className="text-white/70 text-sm mt-2 max-w-md mx-auto">{form.subtitle || "Your subtitle text appears here."}</p>
            <div className="flex gap-2 justify-center mt-4">
              <span className="h-9 px-5 rounded-xl bg-primary text-white text-xs font-semibold inline-flex items-center">{form.cta1Label || "Button 1"}</span>
              {form.cta2Label && <span className="h-9 px-5 rounded-xl border border-white/30 text-white text-xs font-medium inline-flex items-center">{form.cta2Label}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Badge *</label><input className={inputCls} value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="🔥 Limited Time Offer" /></div>
            <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Theme</label>
              <select className={`${inputCls} bg-white`} value={form.theme} onChange={e => setForm(f => ({ ...f, theme: e.target.value }))}>
                {HERO_THEMES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Headline * <span className="text-gray-400 normal-case font-normal">(use a new line to split across two rows)</span></label>
              <textarea className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" rows={2} value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} placeholder={"Summer Sale —\nUp to 40% Off!"} /></div>
            <div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Highlighted phrase <span className="text-gray-400 normal-case font-normal">(part of headline to accent-colour)</span></label><input className={inputCls} value={form.highlight} onChange={e => setForm(f => ({ ...f, highlight: e.target.value }))} placeholder="Up to 40% Off!" /></div>
            <div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Subtitle *</label><textarea className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" rows={2} value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Primary button label *</label><input className={inputCls} value={form.cta1Label} onChange={e => setForm(f => ({ ...f, cta1Label: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Primary button link *</label><input className={inputCls} value={form.cta1Href} onChange={e => setForm(f => ({ ...f, cta1Href: e.target.value }))} placeholder="/products" /></div>
            <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Secondary button label</label><input className={inputCls} value={form.cta2Label} onChange={e => setForm(f => ({ ...f, cta2Label: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Secondary button link</label><input className={inputCls} value={form.cta2Href} onChange={e => setForm(f => ({ ...f, cta2Href: e.target.value }))} placeholder="/categories" /></div>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="h-10 px-6 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">{saving ? "Saving…" : editing ? "Save Changes" : "Add Slide"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="h-10 px-6 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </form>
      )}

      {/* Slides list */}
      {loading ? (
        <div className="py-16 flex justify-center"><svg className="size-7 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg></div>
      ) : sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <span className="text-5xl">🖼️</span>
          <p className="mt-4 font-bold text-gray-700">No hero slides</p>
          <p className="text-sm text-gray-500 mt-1">Add a slide to show a banner on your homepage.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((s, i) => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className={`w-28 h-16 rounded-xl bg-gradient-to-br ${getHeroTheme(s.theme).bg} flex items-center justify-center shrink-0`}>
                <span className="text-white text-[10px] font-semibold px-2 text-center line-clamp-2">{s.headline.replace("\n", " ")}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-gray-900 truncate">{s.badge}</p>
                  {!s.isActive && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Hidden</span>}
                </div>
                <p className="text-xs text-gray-500 truncate">{s.subtitle}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Theme: {getHeroTheme(s.theme).label} · {s.cta1Label} → {s.cta1Href}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => move(s, -1)} disabled={i === 0} className="size-8 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30" aria-label="Move up">↑</button>
                <button onClick={() => move(s, 1)} disabled={i === sorted.length - 1} className="size-8 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30" aria-label="Move down">↓</button>
                <button onClick={() => toggleActive(s)} className="px-2 h-8 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100">{s.isActive ? "Hide" : "Show"}</button>
                <button onClick={() => openEdit(s)} className="px-2 h-8 rounded-lg text-xs font-medium text-primary hover:bg-primary/5">Edit</button>
                <button onClick={() => remove(s)} className="px-2 h-8 rounded-lg text-xs font-medium text-danger hover:bg-danger/5">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
