"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Breadcrumb from "@/components/ui/Breadcrumb"
import brand from "@/config/brand.config"
import { useCartStore } from "@/store/cartStore"

type WishlistProduct = {
  id: string; slug: string; name: string; price: number; comparePrice: number | null
  category: { name: string }; images: { url: string }[]; variants: { stock: number }[]
}
type WishlistItem = { id: string; product: WishlistProduct }

export default function WishlistPage() {
  const [items, setItems]     = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [unauth, setUnauth]   = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    fetch("/api/wishlist")
      .then(r => {
        if (r.status === 401) { setUnauth(true); return null }
        return r.json()
      })
      .then(d => { if (d) setItems(d.items) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function remove(productId: string) {
    setItems(prev => prev.filter(i => i.product.id !== productId))
    await fetch(`/api/wishlist/${productId}`, { method: "DELETE" }).catch(() => {})
  }

  function addToCart(p: WishlistProduct) {
    addItem({ id: p.id, slug: p.slug, name: p.name, price: p.price, emoji: "🐾", gradient: "from-gray-50 to-gray-100" })
  }

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account", href: "/account" }, { label: "Wishlist" }]} />
        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
          {!loading && !unauth && <p className="text-sm text-gray-500">{items.length} {items.length === 1 ? "item" : "items"}</p>}
        </div>

        {loading ? (
          <div className="py-24 flex justify-center">
            <svg className="size-7 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg>
          </div>
        ) : unauth ? (
          <div className="text-center py-24">
            <span className="text-6xl">🔒</span>
            <p className="mt-5 text-lg font-bold text-gray-700">Please sign in</p>
            <p className="text-gray-500 text-sm mt-2">Log in to view your saved items.</p>
            <Link href="/login?next=/account/wishlist" className="inline-flex mt-5 h-11 px-6 items-center rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Sign In</Link>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl">❤️</span>
            <p className="mt-5 text-lg font-bold text-gray-700">Your wishlist is empty</p>
            <p className="text-gray-500 text-sm mt-2">Tap the heart icon on any product to save it here.</p>
            <Link href="/products" className="inline-flex mt-5 h-11 px-6 items-center rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Browse Products</Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {items.map(({ product: p }) => {
              const inStock = p.variants.some(v => v.stock > 0)
              return (
                <div key={p.id} className="relative group bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
                  <button
                    onClick={() => remove(p.id)}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
                    aria-label="Remove from wishlist"
                  >
                    <svg className="size-4 fill-danger stroke-danger" viewBox="0 0 24 24" strokeWidth={2}>
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>

                  <Link href={`/products/${p.slug}`}>
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                      {p.images[0]?.url ? (
                        <Image src={p.images[0].url} alt={p.name} width={300} height={300} className="object-cover w-full h-full" />
                      ) : <span className="text-6xl select-none">🐾</span>}
                    </div>
                  </Link>

                  <div className="p-4">
                    <p className="text-[11px] font-medium text-muted uppercase tracking-wide mb-1">{p.category.name}</p>
                    <Link href={`/products/${p.slug}`}>
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2 hover:text-primary transition-colors">{p.name}</h3>
                    </Link>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-bold text-base text-gray-900">{brand.currencySymbol} {p.price.toLocaleString()}</span>
                      {p.comparePrice && <span className="text-sm text-muted line-through">{brand.currencySymbol} {p.comparePrice.toLocaleString()}</span>}
                    </div>
                    <button
                      onClick={() => addToCart(p)}
                      disabled={!inStock}
                      className={`w-full h-9 rounded-xl text-sm font-semibold transition-all ${inStock ? "bg-primary text-white hover:bg-primary/90 active:scale-[0.97]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                    >
                      {inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
