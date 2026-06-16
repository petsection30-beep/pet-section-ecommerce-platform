"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import brand from "@/config/brand.config"

type AdminProduct = {
  id: string; name: string; slug: string; price: number; comparePrice: number | null
  isActive: boolean
  category: { name: string; slug: string }
  images: { url: string }[]
  variants: { stock: number }[]
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading]   = useState(true)
  const [query, setQuery]       = useState("")
  const [category, setCategory] = useState("All")
  const [deleting, setDeleting] = useState<string | null>(null)

  function load() {
    setLoading(true)
    fetch("/api/admin/products?limit=100")
      .then(r => r.json())
      .then(d => setProducts(d.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map(p => p.category.name))).sort()],
    [products]
  )

  const filtered = products.filter(p =>
    (category === "All" || p.category.name === category) &&
    (!query || p.name.toLowerCase().includes(query.toLowerCase()))
  )

  async function remove(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    setProducts(prev => prev.filter(p => p.id !== id))
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    } catch {
      load() // restore on failure
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
          <span className="text-base leading-none">+</span> Add Product
        </Link>
      </div>

      {/* Search + filter row */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." className="h-9 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all flex-1 min-w-48" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="h-9 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center"><svg className="size-6 animate-spin text-primary inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg></td></tr>
              ) : filtered.map(p => {
                const stock = p.variants.reduce((s, v) => s + v.stock, 0)
                return (
                  <tr key={p.id} className={`hover:bg-gray-50/50 transition-colors ${deleting === p.id ? "opacity-40" : ""}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          {p.images[0]?.url ? <Image src={p.images[0].url} alt={p.name} width={40} height={40} className="object-cover w-full h-full" /> : <span className="text-lg">🐾</span>}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 leading-tight">{p.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 text-xs">{p.category.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-gray-900">{brand.currencySymbol} {p.price.toLocaleString()}</span>
                      {p.comparePrice && <span className="text-xs text-gray-400 line-through ml-1">{brand.currencySymbol} {p.comparePrice.toLocaleString()}</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stock > 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                        {stock > 0 ? `${stock} in stock` : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.isActive ? "bg-success/10 text-success" : "bg-gray-100 text-gray-500"}`}>{p.isActive ? "Active" : "Inactive"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${p.id}/edit`} className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">Edit</Link>
                        <span className="text-gray-200">·</span>
                        <button onClick={() => remove(p.id, p.name)} disabled={deleting === p.id} className="text-xs font-medium text-danger hover:text-danger/80 transition-colors disabled:opacity-50">Delete</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-gray-400 text-sm">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-100 text-sm text-gray-500 bg-gray-50/30">
          Showing {filtered.length} of {products.length} products
        </div>
      </div>
    </div>
  )
}
