"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import imageCompression from "browser-image-compression"
import brand from "@/config/brand.config"

type Category = { id: string; name: string }

export type ProductFormInitial = {
  name: string; slug: string; description: string; categoryId: string
  price: string; comparePrice: string; stock: string; imageUrl: string
  isActive: boolean; isFeatured: boolean
}

const EMPTY: ProductFormInitial = {
  name: "", slug: "", description: "", categoryId: "",
  price: "", comparePrice: "", stock: "", imageUrl: "",
  isActive: true, isFeatured: false,
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

export default function ProductForm({ productId, initial }: { productId?: string; initial?: ProductFormInitial }) {
  const router = useRouter()
  const isEdit = Boolean(productId)

  const [form, setForm]         = useState<ProductFormInitial>(initial ?? EMPTY)
  const [slugTouched, setTouched] = useState(isEdit)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError]       = useState("")
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setUploadErr("")
    if (!file.type.startsWith("image/")) { setUploadErr("Please choose an image file"); return }
    setUploading(true)
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.3, maxWidthOrHeight: 1000, useWebWorker: true, fileType: "image/webp",
      })
      const fd = new FormData()
      fd.append("file", compressed, "product.webp")
      const res  = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) { setUploadErr(data.error ?? "Upload failed"); return }
      setForm(prev => ({ ...prev, imageUrl: data.url }))
    } catch {
      setUploadErr("Could not process that image")
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    fetch("/api/admin/categories")
      .then(r => r.json())
      .then(d => setCategories((d.categories ?? []).map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))))
      .catch(() => {})
  }, [])

  function set<K extends keyof ProductFormInitial>(k: K, v: ProductFormInitial[K]) {
    setForm(prev => {
      const next = { ...prev, [k]: v }
      if (k === "name" && !slugTouched) next.slug = slugify(String(v))
      return next
    })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!form.name.trim())        return setError("Product name is required")
    if (!form.categoryId)         return setError("Please select a category")
    const price = Number(form.price)
    if (!Number.isInteger(price) || price <= 0) return setError("Price must be a positive whole number")

    const payload = {
      name:         form.name.trim(),
      slug:         form.slug || slugify(form.name),
      description:  form.description.trim() || undefined,
      categoryId:   form.categoryId,
      price,
      comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
      stock:        form.stock ? Number(form.stock) : 0,
      imageUrl:     form.imageUrl.trim() || undefined,
      isActive:     form.isActive,
      isFeatured:   form.isFeatured,
    }

    setSaving(true)
    try {
      const res = await fetch(isEdit ? `/api/admin/products/${productId}` : "/api/admin/products", {
        method:  isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Failed to save product"); return }
      router.push("/admin/products")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 mb-1">
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Product" : "Add New Product"}</h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-900 mb-1">Product Info</h2>
            {error && <div className="px-4 py-2.5 rounded-xl bg-danger/10 text-danger text-sm font-medium">{error}</div>}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Product Name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Royal Canin Adult Dog Food 3kg" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Slug *</label>
              <input value={form.slug} onChange={e => { setTouched(true); set("slug", slugify(e.target.value)) }} placeholder="royal-canin-adult-dog-food-3kg" className={`${inputCls} font-mono`} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4} placeholder="Describe the product..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Category *</label>
              <select value={form.categoryId} onChange={e => set("categoryId", e.target.value)} className={`${inputCls} bg-white`}>
                <option value="">Select category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Price ({brand.currencySymbol}) *</label>
                <input type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="0" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Compare at ({brand.currencySymbol})</label>
                <input type="number" value={form.comparePrice} onChange={e => set("comparePrice", e.target.value)} placeholder="0" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Stock Quantity</label>
                <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)} placeholder="0" className={inputCls} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Product Image</h2>

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />

            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="size-28 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                {form.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl text-gray-300">🐾</span>
                )}
              </div>

              {/* Upload control */}
              <div className="flex-1">
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 inline-flex items-center gap-2">
                  {uploading ? (
                    <><svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg> Uploading…</>
                  ) : "📷 Upload Image"}
                </button>
                {form.imageUrl && (
                  <button type="button" onClick={() => set("imageUrl", "")} className="ml-2 h-10 px-3 rounded-xl text-sm font-medium text-danger hover:bg-danger/5 transition-colors">Remove</button>
                )}
                <p className="text-xs text-gray-400 mt-2">Auto-compressed to WebP (≤300&nbsp;KB). Or paste a URL below.</p>
                {uploadErr && <p className="text-xs text-danger mt-1">{uploadErr}</p>}
                <input value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://..." className={`${inputCls} mt-2`} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-900">Settings</h2>
            {([
              { key: "isActive",   label: "Active",   desc: "Visible in the store" },
              { key: "isFeatured", label: "Featured", desc: "Show in Best Sellers" },
            ] as const).map(toggle => (
              <label key={toggle.key} className="flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-gray-900">{toggle.label}</p>
                  <p className="text-xs text-gray-500">{toggle.desc}</p>
                </div>
                <div onClick={() => set(toggle.key, !form[toggle.key])} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${form[toggle.key] ? "bg-primary" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form[toggle.key] ? "translate-x-5" : ""}`} />
                </div>
              </label>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <button type="submit" disabled={saving} className="w-full h-10 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 active:scale-[0.97] transition-all disabled:opacity-60">
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Save Product"}
            </button>
            <Link href="/admin/products" className="flex items-center justify-center w-full h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</Link>
          </div>
        </div>
      </form>
    </div>
  )
}
