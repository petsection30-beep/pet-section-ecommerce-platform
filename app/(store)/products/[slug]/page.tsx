"use client"

import { useState } from "react"
import Link from "next/link"
import Breadcrumb from "@/components/ui/Breadcrumb"
import { ALL_PRODUCTS } from "@/lib/mock-data"
import brand from "@/config/brand.config"
import { notFound } from "next/navigation"
import { use } from "react"

const REVIEWS = [
  { id: 1, author: "Ahmad K.", rating: 5, date: "2026-05-12", body: "Absolutely love this product! My dog is obsessed and the quality is excellent. Highly recommend to all pet owners." },
  { id: 2, author: "Sara M.", rating: 4, date: "2026-04-28", body: "Great value for money. My pet took a few days to get used to it but now loves it. Delivery was fast too." },
  { id: 3, author: "Usman T.", rating: 5, date: "2026-04-10", body: "Ordered twice already. Superb quality and exactly as described. PawsPoint is my go-to store now." },
  { id: 4, author: "Fatima R.", rating: 4, date: "2026-03-22", body: "Good product, packaging was neat and arrived on time. Will order again." },
]

const VARIANTS = [
  { label: "Size", options: ["Small (1kg)", "Medium (3kg)", "Large (5kg)"] },
  { label: "Flavour", options: ["Chicken", "Beef", "Fish"] },
]

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const product = ALL_PRODUCTS.find(p => p.slug === slug)
  if (!product) notFound()

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({
    Size: "Medium (3kg)", Flavour: "Chicken",
  })
  const [qty, setQty]           = useState(1)
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc")
  const [wishlisted, setWishlisted] = useState(false)
  const [added, setAdded]         = useState(false)

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  function handleAddToCart() {
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image gallery */}
          <div className="space-y-3">
            <div className={`aspect-square rounded-3xl bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
              <span className="text-[120px] leading-none select-none">{product.emoji}</span>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {[product.emoji, "📸", "🖼️", "🔍"].map((e, i) => (
                <button key={i} className={`aspect-square rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-3xl border-2 transition-colors ${i === 0 ? "border-primary" : "border-transparent hover:border-gray-200"}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-5">
            {/* Category + name */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">{product.category}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(n => (
                    <svg key={n} className={`size-4 ${n <= Math.round(product.rating!) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {brand.currencySymbol} {product.price.toLocaleString()}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-gray-400 line-through">
                  {brand.currencySymbol} {product.comparePrice.toLocaleString()}
                </span>
              )}
              {discount && (
                <span className="px-2 py-0.5 rounded-lg bg-danger text-white text-xs font-bold">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Stock badge */}
            <div>
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
                  <span className="size-1.5 rounded-full bg-success" />
                  In Stock — Ready to Ship
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 text-danger text-xs font-semibold">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Variants */}
            {VARIANTS.map(v => (
              <div key={v.label}>
                <p className="text-sm font-semibold text-gray-700 mb-2">{v.label}</p>
                <div className="flex flex-wrap gap-2">
                  {v.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [v.label]: opt }))}
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
                        selectedVariants[v.label] === opt
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 text-gray-700 hover:border-primary/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-3">
              {/* Qty stepper */}
              <div className="flex items-center gap-0 rounded-xl border border-gray-200 overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium">−</button>
                <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium">+</button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 h-10 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  !product.inStock ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : added ? "bg-success/10 text-success"
                  : "bg-primary text-white hover:bg-primary/90 active:scale-[0.97]"
                }`}
              >
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </button>

              <button
                onClick={() => setWishlisted(w => !w)}
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 hover:border-danger/50 transition-colors"
                aria-label="Add to wishlist"
              >
                <svg className={`size-5 transition-colors ${wishlisted ? "fill-danger stroke-danger" : "fill-transparent stroke-gray-400"}`} viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Delivery info */}
            <div className="rounded-2xl border border-gray-100 divide-y divide-gray-100 bg-surface">
              {[
                { icon: "🚚", text: "Free delivery on orders above ₨ 2,000" },
                { icon: "💳", text: "Pay via COD, EasyPaisa, or JazzCash" },
                { icon: "↩️", text: "7-day easy returns" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600">
                  <span className="text-base leading-none">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <div className="flex border-b border-gray-200 gap-1">
            {(["desc", "specs", "reviews"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab === "desc" ? "Description" : tab === "specs" ? "Specifications" : `Reviews (${REVIEWS.length})`}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "desc" && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                <p>This premium {product.name.toLowerCase()} is crafted to give your pet the very best. Made with high-quality ingredients and durable materials, it's the perfect choice for pet owners who care.</p>
                <p className="mt-3">Whether you have a new puppy or a senior companion, this product is designed to meet their needs at every life stage. Trusted by thousands of Pakistani pet owners.</p>
              </div>
            )}
            {activeTab === "specs" && (
              <table className="w-full max-w-lg text-sm">
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["SKU", "PP-" + product.id.toUpperCase()],
                    ["Category", product.category],
                    ["Weight", "Available in multiple sizes"],
                    ["Brand", "PawsPoint Premium"],
                    ["Country", "Pakistan"],
                    ["Warranty", "30-day quality guarantee"],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td className="py-2.5 pr-6 font-medium text-gray-500 w-32">{k}</td>
                      <td className="py-2.5 text-gray-900">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {activeTab === "reviews" && (
              <div className="space-y-5 max-w-2xl">
                {REVIEWS.map(r => (
                  <div key={r.id} className="bg-surface rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{r.author}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[1,2,3,4,5].map(n => (
                            <svg key={n} className={`size-3 ${n <= r.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
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
