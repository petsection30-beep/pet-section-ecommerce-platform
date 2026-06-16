"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cartStore"
import brand from "@/config/brand.config"

export type Product = {
  id:           string
  slug:         string
  name:         string
  category:     string
  price:        number
  comparePrice?: number
  emoji:        string
  gradient:     string
  image?:       string | null
  inStock:      boolean
  rating?:      number
  reviewCount?: number
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const [wishlisted, setWishlisted] = useState(false)
  const [wishlistBusy, setWishlistBusy] = useState(false)
  const [added,      setAdded]      = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  async function toggleWishlist() {
    if (wishlistBusy) return
    const next = !wishlisted
    setWishlisted(next)
    setWishlistBusy(true)
    try {
      const res = next
        ? await fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id }) })
        : await fetch(`/api/wishlist/${product.id}`, { method: "DELETE" })
      if (res.status === 401) { setWishlisted(false); router.push("/login?next=/account/wishlist") }
    } catch {
      setWishlisted(!next)
    } finally {
      setWishlistBusy(false)
    }
  }

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  function handleAddToCart() {
    if (!product.inStock) return
    addItem({
      id:       product.id,
      slug:     product.slug,
      name:     product.name,
      price:    product.price,
      emoji:    product.emoji,
      gradient: product.gradient,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div className="relative group bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">

      {/* Image area */}
      <Link href={`/products/${product.slug}`}>
        <div className={`aspect-square bg-gradient-to-br ${product.gradient} flex items-center justify-center overflow-hidden`}>
          {product.image ? (
            <Image src={product.image} alt={product.name} width={300} height={300} className="object-cover w-full h-full" />
          ) : (
            <span className="text-6xl select-none group-hover:scale-110 transition-transform duration-300 leading-none">
              {product.emoji}
            </span>
          )}
        </div>
      </Link>

      {/* Top badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
        {discount !== null && (
          <span className="inline-block px-2 py-0.5 rounded-md bg-danger text-white text-[11px] font-bold leading-tight">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[11px] font-medium leading-tight">
            Out of Stock
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        onClick={toggleWishlist}
        disabled={wishlistBusy}
        className="absolute top-3 right-3 p-1.5 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform duration-150"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <svg
          className={`size-4 transition-colors ${wishlisted ? "fill-danger stroke-danger" : "fill-transparent stroke-gray-400"}`}
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      {/* Card body */}
      <div className="p-4">
        <p className="text-[11px] font-medium text-muted uppercase tracking-wide mb-1">{product.category}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2 hover:text-primary transition-colors">{product.name}</h3>
        </Link>

        {/* Star rating */}
        {product.rating !== undefined && (
          <div className="flex items-center gap-1 mb-2.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(n => (
                <svg
                  key={n}
                  className={`size-3 ${n <= Math.round(product.rating!) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="text-[11px] text-muted">({product.reviewCount})</span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-bold text-base text-gray-900">
            {brand.currencySymbol} {product.price.toLocaleString()}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-muted line-through font-normal">
              {brand.currencySymbol} {product.comparePrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`
            w-full h-9 rounded-xl text-sm font-semibold transition-all duration-150
            ${!product.inStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : added
                ? "bg-success/10 text-success"
                : "bg-primary text-white hover:bg-primary/90 active:scale-[0.97]"
            }
          `}
        >
          {!product.inStock ? "Out of Stock" : added ? "✓ Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}
