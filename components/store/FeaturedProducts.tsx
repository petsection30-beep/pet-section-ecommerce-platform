import Link from "next/link"
import ProductCard from "./ProductCard"
import { ALL_PRODUCTS } from "@/lib/mock-data"

const BEST_SELLER_SLUGS = [
  "royal-canin-adult-dog-food-3kg",
  "whiskas-tuna-cat-food-12-pack",
  "premium-bird-seed-mix-2kg",
  "aquarium-led-strip-light-60cm",
]

const BEST_SELLERS = ALL_PRODUCTS.filter(p => BEST_SELLER_SLUGS.includes(p.slug))

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1.5">Top Picks</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Best Sellers</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6"/></svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {BEST_SELLERS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  )
}
