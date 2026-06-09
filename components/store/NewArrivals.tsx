import Link from "next/link"
import ProductCard, { type Product } from "./ProductCard"

const NEW_ARRIVALS: Product[] = [
  {
    id: "na1",
    slug: "orthopedic-dog-bed-large",
    name: "Orthopedic Dog Bed Large",
    category: "Dog Accessories",
    price: 4500,
    emoji: "🛏️",
    gradient: "from-rose-50 to-rose-100",
    inStock: true,
    rating: 4.7,
    reviewCount: 28,
  },
  {
    id: "na2",
    slug: "interactive-cat-toy-set",
    name: "Interactive Cat Toy Set",
    category: "Cat Toys",
    price: 890,
    comparePrice: 1100,
    emoji: "🧶",
    gradient: "from-violet-50 to-violet-100",
    inStock: true,
    rating: 4.5,
    reviewCount: 19,
  },
  {
    id: "na3",
    slug: "stainless-steel-pet-bowl-set",
    name: "Stainless Steel Pet Bowl Set",
    category: "Accessories",
    price: 450,
    emoji: "🥣",
    gradient: "from-sky-50 to-sky-100",
    inStock: true,
    rating: 4.8,
    reviewCount: 63,
  },
  {
    id: "na4",
    slug: "hamster-running-wheel-21cm",
    name: "Hamster Running Wheel 21cm",
    category: "Small Pets",
    price: 1200,
    comparePrice: 1500,
    emoji: "🐹",
    gradient: "from-lime-50 to-lime-100",
    inStock: true,
    rating: 4.3,
    reviewCount: 15,
  },
  {
    id: "na5",
    slug: "cat-scratching-post-tower",
    name: "Cat Scratching Post Tower",
    category: "Cat Accessories",
    price: 3200,
    emoji: "🏰",
    gradient: "from-fuchsia-50 to-fuchsia-100",
    inStock: true,
    rating: 4.6,
    reviewCount: 47,
  },
  {
    id: "na6",
    slug: "parrot-cage-premium-xl",
    name: "Parrot Cage Premium XL",
    category: "Bird Accessories",
    price: 8500,
    comparePrice: 9500,
    emoji: "🦅",
    gradient: "from-emerald-50 to-emerald-100",
    inStock: false,
    rating: 4.4,
    reviewCount: 22,
  },
  {
    id: "na7",
    slug: "dog-training-clicker-kit",
    name: "Dog Training Clicker Kit",
    category: "Dog Training",
    price: 750,
    emoji: "🎯",
    gradient: "from-yellow-50 to-yellow-100",
    inStock: true,
    rating: 4.7,
    reviewCount: 91,
  },
  {
    id: "na8",
    slug: "aquarium-canister-filter-pump",
    name: "Aquarium Canister Filter Pump",
    category: "Aquarium",
    price: 2800,
    comparePrice: 3200,
    emoji: "💧",
    gradient: "from-cyan-50 to-cyan-100",
    inStock: true,
    rating: 4.5,
    reviewCount: 38,
  },
]

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
