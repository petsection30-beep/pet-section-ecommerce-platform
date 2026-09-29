"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import brand from "@/config/brand.config"

type AdminProduct = {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  isActive: boolean
  isFeatured: boolean
  category: { id: string; name: string; slug: string }
  images: { url: string }[]
  variants: { id: string; name: string; stock: number }[]
  _count?: { orderItems: number }
}

type CategoryOption = {
  id: string
  name: string
  slug: string
  emoji?: string
  _count?: { products: number }
}

type ProductCounts = {
  all: number
  active: number
  inactive: number
  featured: number
}

export default function AdminProductsPage() {
  const [products, setProducts]       = useState<AdminProduct[]>([])
  const [categories, setCategories]   = useState<CategoryOption[]>([])
  const [loading, setLoading]         = useState(true)
  const [total, setTotal]             = useState(0)
  const [totalPages, setTotalPages]   = useState(1)
  const [counts, setCounts]           = useState<ProductCounts>({ all: 0, active: 0, inactive: 0, featured: 0 })

  // Filters & Pagination State
  const [page, setPage]               = useState(1)
  const [limit, setLimit]             = useState(20)
  const [search, setSearch]           = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [category, setCategory]       = useState("All")
  const [status, setStatus]           = useState("all") // "all" | "active" | "inactive"
  const [featured, setFeatured]       = useState("all") // "all" | "featured" | "standard"
  const [stockState, setStockState]   = useState("all") // "all" | "inStock" | "outOfStock"
  const [sort, setSort]               = useState("newest")

  // Modal & Action states
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null)
  const [deleting, setDeleting]       = useState(false)
  const [updatingId, setUpdatingId]   = useState<string | null>(null)
  const [toast, setToast]             = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [refreshKey, setRefreshKey]   = useState(0)

  function showToast(text: string, type: "success" | "error" = "success") {
    setToast({ text, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== debouncedSearch) {
        setLoading(true)
        setDebouncedSearch(search)
        setPage(1)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [search, debouncedSearch])

  // Fetch categories once on mount
  useEffect(() => {
    fetch("/api/admin/categories")
      .then(r => r.json())
      .then(d => {
        if (d.categories) setCategories(d.categories)
      })
      .catch(() => {})
  }, [])

  const refresh = useCallback(() => {
    setLoading(true)
    setRefreshKey(k => k + 1)
  }, [])

  // Navigation handlers with instant skeleton loading
  function goToPage(targetPage: number) {
    if (targetPage === page || targetPage < 1 || targetPage > totalPages) return
    setLoading(true)
    setPage(targetPage)
  }

  function handleCategoryChange(val: string) {
    setLoading(true)
    setCategory(val)
    setPage(1)
  }

  function handleStatusChange(val: string) {
    setLoading(true)
    setStatus(val)
    setPage(1)
  }

  function handleStockChange(val: string) {
    setLoading(true)
    setStockState(val)
    setPage(1)
  }

  function handleSortChange(val: string) {
    setLoading(true)
    setSort(val)
    setPage(1)
  }

  function handleLimitChange(val: number) {
    setLoading(true)
    setLimit(val)
    setPage(1)
  }

  function handleStatPillClick(newStatus: string, newFeatured: string) {
    setLoading(true)
    setStatus(newStatus)
    setFeatured(newFeatured)
    setPage(1)
  }

  function handleFilterReset() {
    setLoading(true)
    setSearch("")
    setDebouncedSearch("")
    setCategory("All")
    setStatus("all")
    setFeatured("all")
    setStockState("all")
    setSort("newest")
    setPage(1)
  }

  // Data fetching effect
  useEffect(() => {
    let ignore = false
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", String(limit))
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim())
    if (category !== "All") params.set("category", category)
    if (status !== "all") params.set("status", status)
    if (featured !== "all") params.set("featured", featured)
    if (stockState !== "all") params.set("stock", stockState)
    if (sort) params.set("sort", sort)

    fetch(`/api/admin/products?${params.toString()}`)
      .then(r => r.json())
      .then(d => {
        if (!ignore && d.products) {
          setProducts(d.products)
          setTotal(d.total ?? 0)
          setTotalPages(d.pages ?? 1)
          if (d.counts) setCounts(d.counts)
        }
      })
      .catch(() => {
        if (!ignore) showToast("Failed to load products", "error")
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => { ignore = true }
  }, [page, limit, debouncedSearch, category, status, featured, stockState, sort, refreshKey])

  // Toggle Featured status directly in table
  async function toggleFeatured(p: AdminProduct) {
    setUpdatingId(p.id)
    const newFeatured = !p.isFeatured
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: newFeatured }),
      })
      if (!res.ok) throw new Error()
      setProducts(prev => prev.map(item => item.id === p.id ? { ...item, isFeatured: newFeatured } : item))
      setCounts(c => ({
        ...c,
        featured: newFeatured ? c.featured + 1 : Math.max(0, c.featured - 1),
      }))
      showToast(newFeatured ? `"${p.name}" marked as Featured` : `"${p.name}" removed from Featured`)
    } catch {
      showToast("Failed to update featured status", "error")
    } finally {
      setUpdatingId(null)
    }
  }

  // Toggle Active/Inactive status directly in table
  async function toggleActive(p: AdminProduct) {
    setUpdatingId(p.id)
    const newActive = !p.isActive
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      })
      if (!res.ok) throw new Error()
      setProducts(prev => prev.map(item => item.id === p.id ? { ...item, isActive: newActive } : item))
      setCounts(c => ({
        ...c,
        active: newActive ? c.active + 1 : Math.max(0, c.active - 1),
        inactive: newActive ? Math.max(0, c.inactive - 1) : c.inactive + 1,
      }))
      showToast(newActive ? `"${p.name}" is now Active` : `"${p.name}" is now Inactive`)
    } catch {
      showToast("Failed to update product status", "error")
    } finally {
      setUpdatingId(null)
    }
  }

  // Execute deletion or safe deactivation
  async function handleDeleteConfirm() {
    if (!productToDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${productToDelete.id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error ?? "Failed to delete product", "error")
        return
      }
      showToast(data.message ?? `Product "${productToDelete.name}" processed successfully`)
      setProductToDelete(null)
      refresh()
    } catch {
      showToast("Error deleting product. Please try again.", "error")
    } finally {
      setDeleting(false)
    }
  }

  const isFiltered = Boolean(
    search || category !== "All" || status !== "all" || featured !== "all" || stockState !== "all" || sort !== "newest"
  )

  // Smart page buttons generation
  const pageNumbers: (number | string)[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
  } else {
    pageNumbers.push(1)
    if (page > 3) pageNumbers.push("...")
    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)
    for (let i = start; i <= end; i++) pageNumbers.push(i)
    if (page < totalPages - 2) pageNumbers.push("...")
    pageNumbers.push(totalPages)
  }

  const startRecord = total === 0 ? 0 : (page - 1) * limit + 1
  const endRecord   = Math.min(total, page * limit)
  const skeletonCount = Math.min(limit, 8)

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2.5 transition-all animate-bounce ${
            toast.type === "success"
              ? "bg-gray-900 text-white border border-gray-700"
              : "bg-danger text-white"
          }`}
        >
          <span>{toast.type === "success" ? "✓" : "⚠️"}</span>
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your entire inventory, pricing, variants, and visibility.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </Link>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => handleStatPillClick("all", "all")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            status === "all" && featured === "all"
              ? "bg-white border-primary/40 shadow-sm ring-2 ring-primary/10"
              : "bg-white border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Products</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{counts.all}</div>
        </button>

        <button
          onClick={() => handleStatPillClick("active", "all")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            status === "active"
              ? "bg-white border-success/40 shadow-sm ring-2 ring-success/10"
              : "bg-white border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="text-xs font-semibold text-success uppercase tracking-wider">Active in Store</div>
          <div className="text-2xl font-bold text-success mt-1">{counts.active}</div>
        </button>

        <button
          onClick={() => handleStatPillClick("inactive", "all")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            status === "inactive"
              ? "bg-white border-gray-400 shadow-sm ring-2 ring-gray-200"
              : "bg-white border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inactive / Hidden</div>
          <div className="text-2xl font-bold text-gray-700 mt-1">{counts.inactive}</div>
        </button>

        <button
          onClick={() => handleStatPillClick("all", "featured")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            featured === "featured"
              ? "bg-white border-amber-400 shadow-sm ring-2 ring-amber-100"
              : "bg-white border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Best Sellers / Featured</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{counts.featured}</div>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px]">
            <svg
              className="size-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by product name, slug, description..."
              className="w-full h-10 pl-10 pr-8 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={e => handleCategoryChange(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white min-w-[140px]"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>
                {c.emoji ?? "🐾"} {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={e => handleStatusChange(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="all">All Visibility</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockState}
            onChange={e => handleStockChange(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="all">All Stock Status</option>
            <option value="inStock">In Stock (&gt;0)</option>
            <option value="outOfStock">Out of Stock (0)</option>
          </select>

          {/* Sort By */}
          <select
            value={sort}
            onChange={e => handleSortChange(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>

          {/* Limit selector */}
          <div className="flex items-center gap-1.5 ml-auto text-xs text-gray-500">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={e => handleLimitChange(Number(e.target.value))}
              className="h-10 px-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white font-medium"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Reset button */}
          {isFiltered && (
            <button
              onClick={handleFilterReset}
              className="h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-all flex items-center gap-1.5"
            >
              <span>✕</span> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Products Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
        {/* Subtle loading shimmer bar across top border */}
        {loading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 overflow-hidden z-10">
            <div className="h-full bg-primary animate-progress" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/75">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Product</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Category</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Price</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Stock</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Featured</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                /* Skeleton rows during pagination and filter loading */
                Array.from({ length: skeletonCount }).map((_, idx) => (
                  <tr key={`skeleton-row-${idx}`} className="animate-pulse">
                    {/* Product cell skeleton */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3.5">
                        <div className="size-11 rounded-xl bg-gray-200 shrink-0" />
                        <div className="space-y-2 flex-1 max-w-xs">
                          <div className="h-4 bg-gray-200 rounded-md w-4/5" />
                          <div className="h-3 bg-gray-100 rounded-md w-1/2" />
                        </div>
                      </div>
                    </td>

                    {/* Category cell skeleton */}
                    <td className="px-5 py-3.5">
                      <div className="h-6 w-24 bg-gray-100 rounded-lg" />
                    </td>

                    {/* Price cell skeleton */}
                    <td className="px-5 py-3.5">
                      <div className="space-y-1.5">
                        <div className="h-4 w-20 bg-gray-200 rounded-md" />
                        <div className="h-3 w-12 bg-gray-100 rounded-md" />
                      </div>
                    </td>

                    {/* Stock cell skeleton */}
                    <td className="px-5 py-3.5">
                      <div className="h-5 w-20 bg-gray-100 rounded-full" />
                    </td>

                    {/* Featured toggle skeleton */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="h-6 w-20 bg-gray-100 rounded-full mx-auto" />
                    </td>

                    {/* Status toggle skeleton */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="h-6 w-16 bg-gray-100 rounded-full mx-auto" />
                    </td>

                    {/* Actions cell skeleton */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <div className="size-8 bg-gray-100 rounded-lg" />
                        <div className="h-8 w-14 bg-gray-100 rounded-lg" />
                        <div className="h-8 w-14 bg-gray-100 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-20 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center gap-3">
                      <span className="text-5xl">📦</span>
                      <h3 className="text-base font-bold text-gray-800">No products found</h3>
                      <p className="text-sm text-gray-500">
                        {isFiltered
                          ? "No products match your active search or filter criteria. Try adjusting your filters."
                          : "Your catalog is empty. Click '+ Add New Product' above to create your first item."}
                      </p>
                      {isFiltered && (
                        <button
                          onClick={handleFilterReset}
                          className="mt-2 h-9 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                products.map(p => {
                  const totalStock = p.variants?.reduce((acc, v) => acc + v.stock, 0) ?? 0
                  const isUpdating = updatingId === p.id

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-gray-50/60 transition-colors ${!p.isActive ? "bg-gray-50/30" : ""} ${
                        isUpdating ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      {/* Product details */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3.5">
                          <div className="size-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                            {p.images[0]?.url ? (
                              <Image
                                src={p.images[0].url}
                                alt={p.name}
                                width={44}
                                height={44}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span className="text-xl">🐾</span>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <p className="font-semibold text-gray-900 leading-snug truncate" title={p.name}>
                              {p.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-gray-400 font-mono truncate" title={p.slug}>
                                /{p.slug}
                              </span>
                              {p._count && p._count.orderItems > 0 && (
                                <span className="text-[10px] font-medium bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded-md">
                                  {p._count.orderItems} orders
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-700">
                          {p.category?.name ?? "Uncategorized"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">
                            {brand.currencySymbol} {p.price.toLocaleString()}
                          </span>
                          {p.comparePrice && p.comparePrice > p.price && (
                            <span className="text-xs text-gray-400 line-through">
                              {brand.currencySymbol} {p.comparePrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {totalStock <= 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-danger/10 text-danger">
                            Out of stock
                          </span>
                        ) : totalStock <= 5 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
                            Low ({totalStock} left)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-success/10 text-success">
                            {totalStock} in stock
                          </span>
                        )}
                      </td>

                      {/* Featured 1-click toggle */}
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => toggleFeatured(p)}
                          title={p.isFeatured ? "Click to remove from Best Sellers" : "Click to mark as Featured Best Seller"}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                            p.isFeatured
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                          }`}
                        >
                          <span>{p.isFeatured ? "★" : "☆"}</span>
                          <span>{p.isFeatured ? "Featured" : "Standard"}</span>
                        </button>
                      </td>

                      {/* Active/Inactive 1-click toggle */}
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => toggleActive(p)}
                          title={p.isActive ? "Click to deactivate and hide from store" : "Click to activate and show in store"}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                            p.isActive
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${p.isActive ? "bg-success" : "bg-gray-400"}`} />
                          <span>{p.isActive ? "Active" : "Inactive"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Live preview */}
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            title="View on public storefront"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                          >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>

                          {/* Edit */}
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="h-8 px-3 rounded-lg bg-gray-100 hover:bg-primary hover:text-white text-gray-700 text-xs font-semibold transition-all inline-flex items-center gap-1"
                          >
                            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setProductToDelete(p)}
                            title="Delete or deactivate this product"
                            className="h-8 px-2.5 rounded-lg text-danger hover:bg-danger/10 text-xs font-semibold transition-colors inline-flex items-center gap-1"
                          >
                            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-gray-500 font-medium flex items-center gap-2">
            <span>
              Showing <span className="font-semibold text-gray-900">{startRecord}</span> to{" "}
              <span className="font-semibold text-gray-900">{endRecord}</span> of{" "}
              <span className="font-semibold text-gray-900">{total}</span> products
            </span>
            {loading && (
              <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold animate-pulse">
                <span className="size-1.5 rounded-full bg-primary animate-ping" />
                Updating...
              </span>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* Previous page button */}
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => goToPage(page - 1)}
                className="h-9 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                ← Prev
              </button>

              {/* Page Number buttons */}
              {pageNumbers.map((num, i) =>
                num === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-xs text-gray-400 select-none">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${num}`}
                    type="button"
                    onClick={() => goToPage(Number(num))}
                    disabled={loading}
                    className={`size-9 rounded-xl text-xs font-bold transition-all ${
                      page === num
                        ? "bg-primary text-white shadow-xs"
                        : "text-gray-700 hover:bg-white hover:border border-gray-200 disabled:opacity-50"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}

              {/* Next page button */}
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => goToPage(page + 1)}
                className="h-9 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fadeIn">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-start justify-between">
              <div className="size-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center text-xl shrink-0">
                🗑️
              </div>
              <button
                type="button"
                onClick={() => !deleting && setProductToDelete(null)}
                className="text-gray-400 hover:text-gray-600 p-1 text-base leading-none"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">Delete Product</h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to remove <strong className="text-gray-900">&quot;{productToDelete.name}&quot;</strong>?
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-3.5 flex items-center gap-3 border border-gray-100">
              <div className="size-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                {productToDelete.images[0]?.url ? (
                  <Image
                    src={productToDelete.images[0].url}
                    alt={productToDelete.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-xl">🐾</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate">{productToDelete.name}</p>
                <p className="text-[11px] text-gray-400 font-mono">/{productToDelete.slug}</p>
                <p className="text-xs font-semibold text-primary mt-0.5">
                  {brand.currencySymbol} {productToDelete.price.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-500 bg-amber-50 border border-amber-200/50 rounded-xl p-3 leading-relaxed">
              <strong className="text-amber-800">Smart Protection:</strong> If this product was purchased in past orders, it will be safely deactivated (hidden from the storefront) to preserve order tracking and financial records. If it was never ordered, it will be permanently deleted.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setProductToDelete(null)}
                className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="flex-1 h-11 rounded-xl bg-danger hover:bg-danger/90 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {deleting ? (
                  <>
                    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3} />
                      <path d="M21 12c0-4.97-4.03-9-9-9" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
