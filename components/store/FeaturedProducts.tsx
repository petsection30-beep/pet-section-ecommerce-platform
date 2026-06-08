import Link from "next/link"
import ProductCard, { type Product } from "./ProductCard"

const BEST_SELLERS: Product[] = [
  {
    id: "bs1",
    name: "Royal Canin Adult Dog Food 3kg",
    category: "Dog Food",
    price: 3500,
    comparePrice: 4200,
    emoji: "🐕",
    gradient: "from-orange-50 to-orange-100",
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "bs2",
    name: "Whiskas Tuna Cat Food — 12 Pack",
    category: "Cat Food",
    price: 1200,
    comparePrice: 1500,
    emoji: "🐈",
    gradient: "from-purple-50 to-purple-100",
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: "bs3",
    name: "Premium Bird Seed Mix 2kg",
    category: "Bird Food",
    price: 850,
    emoji: "🦜",
    gradient: "from-green-50 to-green-100",
    inStock: true,
    rating: 4.5,
    reviewCount: 42,
  },
  {
    id: "bs4",
    name: "Aquarium LED Strip Light 60cm",
    category: "Aquarium",
    price: 2200,
    comparePrice: 2800,
    emoji: "🐠",
    gradient: "from-blue-50 to-blue-100",
    inStock: true,
    rating: 4.7,
    reviewCount: 67,
  },
]

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
