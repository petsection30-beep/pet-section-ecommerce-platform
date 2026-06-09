import Link from "next/link"
import ProductCard from "./ProductCard"
import { ALL_PRODUCTS } from "@/lib/mock-data"

const NEW_ARRIVAL_SLUGS = [
  "orthopedic-dog-bed-large",
  "interactive-cat-toy-set",
  "stainless-steel-pet-bowl-set",
  "hamster-running-wheel-21cm",
  "cat-scratching-post-tower",
  "parrot-cage-premium-xl",
  "dog-training-clicker-kit",
  "aquarium-canister-filter-pump",
]

const NEW_ARRIVALS = ALL_PRODUCTS.filter(p => NEW_ARRIVAL_SLUGS.includes(p.slug))

export default function NewArrivals() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1.5">Fresh Stock</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">New Arrivals</h2>
          </div>
          <Link
            href="/products?sort=newest"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6"/></svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {NEW_ARRIVALS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  )
}
