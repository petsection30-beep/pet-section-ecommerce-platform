"use client"

import { useState } from "react"

const INITIAL = [
  { id: 1, name: "Dog Food",        emoji: "🐕", slug: "dog-food",        products: 4, active: true  },
  { id: 2, name: "Cat Food",        emoji: "🐈", slug: "cat-food",        products: 3, active: true  },
  { id: 3, name: "Bird Food",       emoji: "🦜", slug: "bird-food",       products: 2, active: true  },
  { id: 4, name: "Dog Accessories", emoji: "🦴", slug: "dog-accessories", products: 5, active: true  },
  { id: 5, name: "Cat Accessories", emoji: "🧶", slug: "cat-accessories", products: 3, active: true  },
  { id: 6, name: "Aquarium",        emoji: "🐠", slug: "aquarium",        products: 2, active: true  },
  { id: 7, name: "Grooming",        emoji: "✂️",  slug: "grooming",        products: 2, active: true  },
  { id: 8, name: "Small Pets",      emoji: "🐹", slug: "small-pets",      products: 2, active: false },
]

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(INITIAL)
  const [adding, setAdding]         = useState(false)
  const [newName, setNewName]       = useState("")
  const [newEmoji, setNewEmoji]     = useState("🐾")

  function toggleActive(id: number) {
    setCategories(c => c.map(cat => cat.id === id ? { ...cat, active: !cat.active } : cat))
  }
  function remove(id: number) {
    setCategories(c => c.filter(cat => cat.id !== id))
  }
  function addCategory() {
    if (!newName.trim()) return
    setCategories(c => [...c, {
      id: Date.now(), name: newName.trim(), emoji: newEmoji,
      slug: newName.trim().toLowerCase().replace(/\s+/g, "-"),
      products: 0, active: true,
    }])
    setNewName(""); setNewEmoji("🐾"); setAdding(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={() => setAdding(a => !a)} className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
          <span className="text-base leading-none">+</span> Add Category
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-white rounded-2xl border border-primary/30 shadow-sm p-5 mb-5 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Emoji</label>
            <input value={newEmoji} onChange={e => setNewEmoji(e.target.value)}
              className="w-16 h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-center text-lg" />
          </div>
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Category Name *</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Reptiles"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div className="flex gap-2">
            <button onClick={addCategory} className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Save</button>
            <button onClick={() => setAdding(false)} className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {["Category", "Slug", "Products", "Active", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">{cat.emoji}</span>
                    <span className="font-medium text-gray-900">{cat.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{cat.slug}</td>
                <td className="px-5 py-3.5 text-gray-600">{cat.products}</td>
                <td className="px-5 py-3.5">
                  <div
                    onClick={() => toggleActive(cat.id)}
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${cat.active ? "bg-primary" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${cat.active ? "translate-x-5" : ""}`} />
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">Edit</button>
                    <button onClick={() => remove(cat.id)} className="text-xs font-medium text-danger hover:text-danger/80 transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
