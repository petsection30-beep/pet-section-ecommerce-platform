"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import brand from "@/config/brand.config"

type AdminProduct = {
  id: string; name: string; slug: string; price: number; comparePrice: number | null
  isActive: boolean; isFeatured: boolean
  category: { name: string; slug: string }
  images: { url: string }[]
  variants: { stock: number }[]
}

export default function BestSellersPage() {
  const [all, setAll]         = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery]     = useState("")

  function load() {
    setLoading(true)
    fetch("/api/admin/products?limit=100")
      .then(r => r.json())
      .then(d => setAll(d.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, [])

  const featured   = all.filter(p => p.isFeatured && p.isActive)
  const available  = all.filter(p => {
    if (p.isFeatured) return false
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.category.name.toLowerCase().includes(q)
  })

  async function toggle(id: string, makeFeatured: boolean) {
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: makeFeatured }),
      })
      setAll(prev => prev.map(p => p.id === id ? { ...p, isFeatured: makeFeatured } : p))
    } catch {}
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setAll(prev => prev.filter(p => p.id !== id))
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    } catch {
      load()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Best Sellers</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {featured.length} product{featured.length !== 1 ? "s" : ""} featured
            {featured.length > 0 && featured.length < 4
              ? ` — add ${4 - featured.length} more to fill the homepage grid`
              : featured.length >= 4
                ? " — the homepage grid is full"
                : ""}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center"><svg className="size-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg></div>
      ) : (
        <>
          {/* Featured grid */}
          {featured.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Currently Featured</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {featured.map(p => {
                  const stock = p.variants.reduce((s, v) => s + v.stock, 0)
                  return (
                    <div key={p.id} className="bg-surface rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                        {p.images[0]?.url
                          ? <Image src={p.images[0].url} alt={p.name} width={300} height={300} className="object-cover w-full h-full" />
                          : <span className="text-5xl">🐾</span>}
                      </div>
                      <div className="p-4">
                        <p className="text-[11px] font-medium text-muted uppercase tracking-wide mb-1">{p.category.name}</p>
                        <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2">{p.name}</p>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="font-bold text-base text-gray-900">{brand.currencySymbol} {p.price.toLocaleString()}</span>
                          {p.comparePrice && <span className="text-sm text-muted line-through">{brand.currencySymbol} {p.comparePrice.toLocaleString()}</span>}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stock > 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                            {stock > 0 ? `${stock} in stock` : "Out of stock"}
                          </span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => toggle(p.id, false)}
                              className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100">
                              Unfeature
                            </button>
                            <button onClick={() => remove(p.id, p.name)}
                              className="text-xs font-medium text-danger hover:text-danger/80 transition-colors px-2 py-1 rounded-lg hover:bg-danger/5">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {featured.length === 0 && (
            <div className="text-center py-16 mb-10 bg-surface rounded-2xl border border-gray-100">
              <span className="text-5xl">⭐</span>
              <p className="mt-4 text-lg font-semibold text-gray-700">No featured products yet</p>
              <p className="text-sm text-gray-500 mt-1">Select products below to feature them on the homepage as Best Sellers.</p>
            </div>
          )}

          {/* Available products to add */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Add More Products</h2>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all mb-4" />
            {available.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                {query ? "No products match your search." : "All products are already featured."}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {available.slice(0, 20).map(p => (
                  <div key={p.id} className="bg-surface rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-200">
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                      {p.images[0]?.url
                        ? <Image src={p.images[0].url} alt={p.name} width={300} height={300} className="object-cover w-full h-full" />
                        : <span className="text-5xl">🐾</span>}
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] font-medium text-muted uppercase tracking-wide mb-1">{p.category.name}</p>
                      <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2">{p.name}</p>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="font-bold text-base text-gray-900">{brand.currencySymbol} {p.price.toLocaleString()}</span>
                        {p.comparePrice && <span className="text-sm text-muted line-through">{brand.currencySymbol} {p.comparePrice.toLocaleString()}</span>}
                      </div>
                      <button onClick={() => toggle(p.id, true)}
                        className="w-full h-9 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 active:scale-[0.97] transition-all">
                        ★ Feature This
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {available.length > 20 && (
              <p className="text-center text-sm text-gray-400 mt-4">Showing 20 of {available.length} products — refine your search to find more.</p>
            )}
          </section>
        </>
      )}
    </div>
  )
}
