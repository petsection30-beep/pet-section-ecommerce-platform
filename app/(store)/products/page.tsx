"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard, { type Product } from "@/components/store/ProductCard"
import Breadcrumb from "@/components/ui/Breadcrumb"
import brand from "@/config/brand.config"

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc",label: "Price: High to Low" },
  { value: "rating",    label: "Top Rated" },
]

type ApiProduct = {
  id: string; slug: string; name: string; price: number; comparePrice: number | null
  category: string; categorySlug: string; image: string | null; inStock: boolean
  rating: number | null; reviewCount: number
}

function toCard(p: ApiProduct): Product {
  return {
    id: p.id, slug: p.slug, name: p.name, category: p.category,
    price: p.price, comparePrice: p.comparePrice ?? undefined,
    emoji: "🐾", gradient: "from-orange-50 to-amber-100",
    image: p.image, inStock: p.inStock,
    rating: p.rating ?? undefined, reviewCount: p.reviewCount,
  }
}

function ProductsInner() {
  const sp = useSearchParams()
  const [all, setAll]       = useState<ApiProduct[]>([])
  const [loading, setLoad]  = useState(true)
  const [category, setCategory] = useState("All")
  const [sort, setSort]         = useState(sp.get("sort")?.replace("-", "_") ?? "newest")
  const [inStockOnly, setInStockOnly] = useState(false)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    fetch("/api/products?limit=100")
      .then(r => r.json())
      .then(d => setAll(d.products ?? []))
      .catch(() => {})
      .finally(() => setLoad(false))
  }, [])

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(all.map(p => p.category))).sort()],
    [all]
  )
  const priceCeiling = useMemo(
    () => Math.max(10000, ...all.map(p => p.price)),
    [all]
  )

  const products = useMemo(() => {
    let list = all.filter(p => p.price <= maxPrice)
    if (category !== "All") list = list.filter(p => p.category === category)
    if (inStockOnly)        list = list.filter(p => p.inStock)
    if (sort === "price_asc")  list = [...list].sort((a, b) => a.price - b.price)
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price)
    if (sort === "rating")     list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    return list
  }, [all, category, sort, inStockOnly, maxPrice])

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Category</h3>
        <div className="space-y-1">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${category === c ? "bg-primary/10 text-primary font-semibold" : "text-gray-600 hover:bg-gray-100"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Max Price</h3>
        <input type="range" min={500} max={priceCeiling} step={500} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{brand.currencySymbol} 500</span>
          <span className="font-semibold text-gray-900">{brand.currencySymbol} {maxPrice.toLocaleString()}</span>
          <span>{brand.currencySymbol} {priceCeiling.toLocaleString()}</span>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div onClick={() => setInStockOnly(v => !v)} className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${inStockOnly ? "bg-primary" : "bg-gray-200"}`}>
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${inStockOnly ? "translate-x-5" : ""}`} />
          </div>
          <span className="text-sm text-gray-700 font-medium">In Stock Only</span>
        </label>
      </div>
    </div>
  )

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Products" }]} />

        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Products</h1>
          <button className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-surface text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setFilterOpen(v => !v)}>
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 4h18M7 12h10M11 20h2"/></svg>
            Filters
          </button>
        </div>

        {filterOpen && (
          <div className="lg:hidden mt-4 p-5 bg-surface rounded-2xl border border-gray-100 shadow-md"><FilterPanel /></div>
        )}

        <div className="mt-6 flex gap-8">
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24 bg-surface rounded-2xl border border-gray-100 p-5"><FilterPanel /></div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 gap-4">
              <p className="text-sm text-gray-500"><span className="font-semibold text-gray-900">{products.length}</span> products found</p>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-xl border border-gray-200 bg-surface text-sm text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="py-24 flex justify-center"><svg className="size-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg></div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <span className="text-6xl">🔍</span>
                <p className="mt-4 text-lg font-semibold text-gray-700">No products found</p>
                <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
                <button onClick={() => { setCategory("All"); setInStockOnly(false); setMaxPrice(priceCeiling) }} className="mt-4 px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90">Reset Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p.id} product={toCard(p)} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ProductsInner />
    </Suspense>
  )
}
