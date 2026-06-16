"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Breadcrumb from "@/components/ui/Breadcrumb"
import brand from "@/config/brand.config"
import { useCartStore } from "@/store/cartStore"

export type DetailReview = { id: string; author: string; rating: number; date: string; body: string }
export type DetailVariantGroup = { name: string; options: { id: string; value: string; stock: number }[] }
export type DetailProduct = {
  id: string; slug: string; name: string; description: string
  category: string; price: number; comparePrice: number | null
  images: string[]; inStock: boolean; rating: number | null; reviewCount: number
  sku: string; variantGroups: DetailVariantGroup[]; reviews: DetailReview[]
}

export default function ProductDetailClient({ product }: { product: DetailProduct }) {
  const router  = useRouter()
  const addItem = useCartStore((s) => s.addItem)

  const [activeImg, setActiveImg] = useState(0)
  const [selected, setSelected] = useState<Record<string, string>>(
    Object.fromEntries(product.variantGroups.map(g => [g.name, g.options[0]?.value ?? ""]))
  )
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc")
  const [wishlisted, setWishlisted] = useState(false)
  const [wishBusy, setWishBusy] = useState(false)
  const [added, setAdded] = useState(false)

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  function addToCart() {
    if (!product.inStock) return
    addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, emoji: "🐾", gradient: "from-orange-50 to-amber-100", qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  async function toggleWishlist() {
    if (wishBusy) return
    const next = !wishlisted
    setWishlisted(next); setWishBusy(true)
    try {
      const res = next
        ? await fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id }) })
        : await fetch(`/api/wishlist/${product.id}`, { method: "DELETE" })
      if (res.status === 401) { setWishlisted(false); router.push("/login?next=/account/wishlist") }
    } catch { setWishlisted(!next) } finally { setWishBusy(false) }
  }

  const mainImg = product.images[activeImg] ?? product.images[0]

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
              {mainImg ? (
                <Image src={mainImg} alt={product.name} width={600} height={600} className="w-full h-full object-cover" priority />
              ) : (
                <span className="text-[120px] leading-none select-none">🐾</span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border-2 transition-colors ${i === activeImg ? "border-primary" : "border-transparent hover:border-gray-200"}`}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} width={120} height={120} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">{product.category}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            </div>

            {product.rating !== null && product.reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(n => (
                    <svg key={n} className={`size-4 ${n <= Math.round(product.rating!) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">{brand.currencySymbol} {product.price.toLocaleString()}</span>
              {product.comparePrice && <span className="text-lg text-gray-400 line-through">{brand.currencySymbol} {product.comparePrice.toLocaleString()}</span>}
              {discount && <span className="px-2 py-0.5 rounded-lg bg-danger text-white text-xs font-bold">Save {discount}%</span>}
            </div>

            <div>
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
                  <span className="size-1.5 rounded-full bg-success" /> In Stock — Ready to Ship
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 text-danger text-xs font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Variant groups (only real ones) */}
            {product.variantGroups.map(g => (
              <div key={g.name}>
                <p className="text-sm font-semibold text-gray-700 mb-2">{g.name}</p>
                <div className="flex flex-wrap gap-2">
                  {g.options.map(opt => (
                    <button key={opt.id} onClick={() => setSelected(prev => ({ ...prev, [g.name]: opt.value }))}
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all duration-150 ${selected[g.name] === opt.value ? "border-primary bg-primary/10 text-primary" : "border-gray-200 text-gray-700 hover:border-primary/50"}`}>
                      {opt.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0 rounded-xl border border-gray-200 overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium">−</button>
                <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium">+</button>
              </div>

              <button onClick={addToCart} disabled={!product.inStock}
                className={`flex-1 h-10 rounded-xl text-sm font-semibold transition-all duration-150 ${!product.inStock ? "bg-gray-100 text-gray-400 cursor-not-allowed" : added ? "bg-success/10 text-success" : "bg-primary text-white hover:bg-primary/90 active:scale-[0.97]"}`}>
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </button>

              <button onClick={toggleWishlist} disabled={wishBusy} className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 hover:border-danger/50 transition-colors" aria-label="Add to wishlist">
                <svg className={`size-5 transition-colors ${wishlisted ? "fill-danger stroke-danger" : "fill-transparent stroke-gray-400"}`} viewBox="0 0 24 24" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>

            <div className="rounded-2xl border border-gray-100 divide-y divide-gray-100 bg-surface">
              {[
                { icon: "🚚", text: "Free delivery on orders above ₨ 2,000" },
                { icon: "💳", text: "Pay via COD, EasyPaisa, or JazzCash" },
                { icon: "↩️", text: "7-day easy returns" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600">
                  <span className="text-base leading-none">{item.icon}</span>{item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <div className="flex border-b border-gray-200 gap-1">
            {(["desc", "specs", "reviews"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-900"}`}>
                {tab === "desc" ? "Description" : tab === "specs" ? "Specifications" : `Reviews (${product.reviews.length})`}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "desc" && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                <p>{product.description || `This premium ${product.name.toLowerCase()} is crafted to give your pet the very best.`}</p>
              </div>
            )}
            {activeTab === "specs" && (
              <table className="w-full max-w-lg text-sm">
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["SKU", product.sku],
                    ["Category", product.category],
                    ["Brand", brand.storeName],
                    ["Country", "Pakistan"],
                    ["Warranty", "30-day quality guarantee"],
                  ].map(([k, v]) => (
                    <tr key={k}><td className="py-2.5 pr-6 font-medium text-gray-500 w-32">{k}</td><td className="py-2.5 text-gray-900">{v}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
            {activeTab === "reviews" && (
              <div className="space-y-5 max-w-2xl">
                {product.reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-4xl">⭐</span>
                    <p className="mt-3 font-semibold text-gray-700">No reviews yet</p>
                    <p className="text-sm text-gray-500 mt-1">Be the first to review this product.</p>
                  </div>
                ) : product.reviews.map(r => (
                  <div key={r.id} className="bg-surface rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{r.author}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[1,2,3,4,5].map(n => (
                            <svg key={n} className={`size-3 ${n <= r.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
