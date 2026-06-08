import Breadcrumb from "@/components/ui/Breadcrumb"
import ProductCard from "@/components/store/ProductCard"
import { ALL_PRODUCTS } from "@/lib/mock-data"

const CATEGORY_META: Record<string, { name: string; emoji: string; description: string }> = {
  dogs:        { name: "Dogs",        emoji: "🐕", description: "Everything your dog needs — food, toys, beds, leashes and more." },
  cats:        { name: "Cats",        emoji: "🐈", description: "Premium cat food, grooming supplies, toys and accessories." },
  birds:       { name: "Birds",       emoji: "🦜", description: "Bird cages, seed mixes, perches and accessories." },
  fish:        { name: "Fish",        emoji: "🐠", description: "Aquariums, filters, lighting, food and decorations." },
  grooming:    { name: "Grooming",    emoji: "✂️", description: "Keep your pet clean and comfortable with our grooming range." },
  food:        { name: "Food",        emoji: "🦴", description: "Premium dry food, wet food, treats and supplements." },
  accessories: { name: "Accessories", emoji: "🎾", description: "Bowls, collars, harnesses, toys and travel accessories." },
  "small-pets":{ name: "Small Pets",  emoji: "🐹", description: "Supplies for hamsters, rabbits and other small animals." },
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const meta = CATEGORY_META[slug] ?? { name: slug, emoji: "🐾", description: "Browse products in this category." }

  // In production this would filter by DB category; for now show a subset
  const products = ALL_PRODUCTS.slice(0, 8)

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: meta.name },
        ]} />

        {/* Category hero */}
        <div className="mt-6 mb-8 flex items-center gap-5">
          <div className="text-6xl leading-none select-none">{meta.emoji}</div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{meta.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{meta.description}</p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="text-6xl">📭</span>
            <p className="mt-4 text-lg font-semibold text-gray-700">No products yet</p>
            <p className="text-gray-500 text-sm mt-1">Check back soon — we're adding new stock!</p>
          </div>
        )}
      </div>
    </div>
  )
}
