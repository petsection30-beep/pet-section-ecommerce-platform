import Link from "next/link"
import Breadcrumb from "@/components/ui/Breadcrumb"

const CATEGORIES = [
  { name: "Dogs",        slug: "dogs",        emoji: "🐕", from: "from-orange-50", to: "to-orange-100",   border: "border-orange-200/60", accent: "text-orange-600",  count: 48, description: "Food, beds, leashes, toys & more for your furry friend" },
  { name: "Cats",        slug: "cats",        emoji: "🐈", from: "from-purple-50", to: "to-purple-100",   border: "border-purple-200/60", accent: "text-purple-600",  count: 36, description: "Scratching posts, carriers, food & grooming essentials" },
  { name: "Birds",       slug: "birds",       emoji: "🦜", from: "from-green-50",  to: "to-green-100",    border: "border-green-200/60",  accent: "text-green-600",   count: 22, description: "Cages, seed mixes, perches & bird accessories" },
  { name: "Fish",        slug: "fish",        emoji: "🐠", from: "from-blue-50",   to: "to-blue-100",     border: "border-blue-200/60",   accent: "text-blue-600",    count: 31, description: "Aquariums, filters, lights, food & decorations" },
  { name: "Grooming",    slug: "grooming",    emoji: "✂️", from: "from-pink-50",   to: "to-pink-100",     border: "border-pink-200/60",   accent: "text-pink-600",    count: 19, description: "Brushes, shampoos, nail clippers & grooming kits" },
  { name: "Food",        slug: "food",        emoji: "🦴", from: "from-amber-50",  to: "to-amber-100",    border: "border-amber-200/60",  accent: "text-amber-600",   count: 64, description: "Premium dry food, wet food, treats & supplements" },
  { name: "Accessories", slug: "accessories", emoji: "🎾", from: "from-teal-50",   to: "to-teal-100",     border: "border-teal-200/60",   accent: "text-teal-600",    count: 55, description: "Bowls, collars, harnesses, toys & travel accessories" },
  { name: "Small Pets",  slug: "small-pets",  emoji: "🐹", from: "from-lime-50",   to: "to-lime-100",     border: "border-lime-200/60",   accent: "text-lime-600",    count: 14, description: "Hamsters, rabbits & other small pet supplies" },
]

export default function CategoriesPage() {
  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

        <div className="mt-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop by Category</h1>
          <p className="text-gray-500 mt-1 text-sm">Find everything your pet needs in one place</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={`group bg-gradient-to-br ${cat.from} ${cat.to} border ${cat.border} rounded-3xl p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex items-start justify-between">
                <span className="text-5xl leading-none group-hover:scale-110 transition-transform duration-200 select-none">{cat.emoji}</span>
                <span className="text-xs font-medium text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">{cat.count} items</span>
              </div>
              <div>
                <h2 className={`text-lg font-bold ${cat.accent}`}>{cat.name}</h2>
                <p className="text-gray-600 text-xs leading-relaxed mt-1">{cat.description}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${cat.accent} mt-auto`}>
                Shop now
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
