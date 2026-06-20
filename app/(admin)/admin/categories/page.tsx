"use client"

import { useEffect, useState } from "react"
import { categoryIcon } from "@/lib/category-icon"

type Category = {
  id: string; name: string; emoji: string; slug: string; isActive: boolean
  _count?: { products: number }
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]   = useState(true)
  const [adding, setAdding]     = useState(false)
  const [newName, setNewName]   = useState("")
  const [newEmoji, setNewEmoji] = useState("🐾")
  const [emojiTouched, setEmojiTouched] = useState(false)
  const [error, setError]       = useState("")
  const [saving, setSaving]     = useState(false)

  // Inline edit (rename) state
  const [editingId, setEditingId]             = useState<string | null>(null)
  const [editName, setEditName]               = useState("")
  const [editEmoji, setEditEmoji]             = useState("🐾")
  const [editEmojiTouched, setEditEmojiTouched] = useState(false)
  const [savingEdit, setSavingEdit]           = useState(false)

  // Keep the icon in sync with the name unless the admin has manually set it.
  function handleNameChange(value: string) {
    setNewName(value)
    if (!emojiTouched) setNewEmoji(categoryIcon(value))
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditEmoji(cat.emoji)
    setEditEmojiTouched(false)  // typing the new name resyncs the icon
  }

  function handleEditNameChange(value: string) {
    setEditName(value)
    if (!editEmojiTouched) setEditEmoji(categoryIcon(value))
  }

  async function saveEdit(cat: Category) {
    if (!editName.trim() || savingEdit) return
    setSavingEdit(true)
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), emoji: editEmoji || "🐾" }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error ?? "Failed to update category"); return }
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, ...data.category } : c))
      setEditingId(null)
    } finally {
      setSavingEdit(false)
    }
  }

  function load() {
    fetch("/api/admin/categories")
      .then(r => r.json())
      .then(d => setCategories(d.categories ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function addCategory() {
    if (!newName.trim()) return
    setError("")
    setSaving(true)
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), slug: slugify(newName), emoji: newEmoji || "🐾", isActive: true }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Failed to add category"); return }
      setCategories(prev => [...prev, { ...data.category, _count: { products: 0 } }])
      setNewName(""); setNewEmoji("🐾"); setEmojiTouched(false); setAdding(false)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(cat: Category) {
    setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, isActive: !c.isActive } : c))
    await fetch(`/api/admin/categories/${cat.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !cat.isActive }),
    }).catch(() => load())
  }

  async function remove(cat: Category) {
    if ((cat._count?.products ?? 0) > 0) {
      alert(`"${cat.name}" has ${cat._count?.products} product(s). Reassign or remove them first.`)
      return
    }
    if (!confirm(`Delete category "${cat.name}"?`)) return
    setCategories(prev => prev.filter(c => c.id !== cat.id))
    const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" }).catch(() => null)
    if (!res || !res.ok) load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={() => { setAdding(a => !a); setError("") }} className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
          <span className="text-base leading-none">+</span> Add Category
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-2xl border border-primary/30 shadow-sm p-5 mb-5">
          {error && <div className="mb-3 px-4 py-2 rounded-xl bg-danger/10 text-danger text-sm font-medium">{error}</div>}
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Icon</label>
              <input value={newEmoji} onChange={e => { setEmojiTouched(true); setNewEmoji(e.target.value) }} className="w-16 h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-center text-lg" />
            </div>
            <div className="flex-1 min-w-48">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Category Name *</label>
              <input value={newName} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Dog Food" className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div className="flex gap-2">
              <button onClick={addCategory} disabled={saving} className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
              <button onClick={() => { setAdding(false); setNewName(""); setNewEmoji("🐾"); setEmojiTouched(false); setError("") }} className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[36rem]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {["Category", "Slug", "Products", "Active", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-16 text-center"><svg className="size-6 animate-spin text-primary inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg></td></tr>
            ) : categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2">
                      <input value={editEmoji} onChange={e => { setEditEmojiTouched(true); setEditEmoji(e.target.value) }}
                        className="w-12 h-9 px-2 rounded-lg border border-gray-200 text-center text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                      <input value={editName} autoFocus
                        onChange={e => handleEditNameChange(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") saveEdit(cat); if (e.key === "Escape") setEditingId(null) }}
                        className="h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none">{cat.emoji}</span>
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    </div>
                  )}
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{cat.slug}</td>
                <td className="px-5 py-3.5 text-gray-600">{cat._count?.products ?? 0}</td>
                <td className="px-5 py-3.5">
                  <div onClick={() => toggleActive(cat)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${cat.isActive ? "bg-primary" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${cat.isActive ? "translate-x-5" : ""}`} />
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => saveEdit(cat)} disabled={savingEdit} className="text-xs font-semibold text-primary hover:underline disabled:opacity-50">{savingEdit ? "Saving…" : "Save"}</button>
                      <span className="text-gray-200">·</span>
                      <button onClick={() => setEditingId(null)} className="text-xs font-medium text-gray-500 hover:underline">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(cat)} className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">Edit</button>
                      <span className="text-gray-200">·</span>
                      <button onClick={() => remove(cat)} className="text-xs font-medium text-danger hover:text-danger/80 transition-colors">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!loading && categories.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-16 text-center text-gray-400 text-sm">No categories yet.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
