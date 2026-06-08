"use client"

import { useState } from "react"
import Link from "next/link"
import brand from "@/config/brand.config"

const CATEGORIES = ["Dog Food", "Cat Food", "Bird Food", "Dog Accessories", "Cat Accessories", "Bird Accessories", "Aquarium", "Grooming", "Accessories", "Small Pets", "Dog Training", "Cat Toys"]

export default function NewProductPage() {
  const [form, setForm] = useState({
    name: "", description: "", category: "", price: "", comparePrice: "", stock: "", sku: "",
    isActive: true, isFeatured: false,
  })
  const [saved, setSaved] = useState(false)

  function set(f: string, v: string | boolean) { setForm(p => ({ ...p, [f]: v })) }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 mb-1">
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main fields */}
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-900 mb-1">Product Info</h2>
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Product Name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Royal Canin Adult Dog Food 3kg"
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4}
                placeholder="Describe the product..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
            </div>
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Category *</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white">
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Pricing & stock */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { key: "price",        label: `Price (${brand.currencySymbol}) *`, placeholder: "0" },
                { key: "comparePrice", label: `Compare at Price (${brand.currencySymbol})`, placeholder: "0" },
                { key: "stock",        label: "Stock Quantity *", placeholder: "0" },
                { key: "sku",          label: "SKU",              placeholder: "PP-001" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">{f.label}</label>
                  <input value={form[f.key as keyof typeof form] as string} onChange={e => set(f.key, e.target.value)}
                    placeholder={f.placeholder} type={f.key === "sku" ? "text" : "number"}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Image upload placeholder */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Product Images</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer group">
              <span className="text-4xl block mb-3">📷</span>
              <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">Click or drag images here</p>
              <p className="text-xs text-gray-400 mt-1">WebP recommended · Max 300 KB per image</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status toggles */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-900">Settings</h2>
            {[
              { key: "isActive",   label: "Active",   desc: "Visible in the store" },
              { key: "isFeatured", label: "Featured", desc: "Show in Best Sellers" },
            ].map(toggle => (
              <label key={toggle.key} className="flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-gray-900">{toggle.label}</p>
                  <p className="text-xs text-gray-500">{toggle.desc}</p>
                </div>
                <div
                  onClick={() => set(toggle.key, !(form[toggle.key as keyof typeof form] as boolean))}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${form[toggle.key as keyof typeof form] ? "bg-primary" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form[toggle.key as keyof typeof form] ? "translate-x-5" : ""}`} />
                </div>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <button type="submit" className={`w-full h-10 rounded-xl text-sm font-semibold transition-all ${saved ? "bg-success/10 text-success" : "bg-primary text-white hover:bg-primary/90 active:scale-[0.97]"}`}>
              {saved ? "✓ Saved!" : "Save Product"}
            </button>
            <Link href="/admin/products" className="flex items-center justify-center w-full h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
