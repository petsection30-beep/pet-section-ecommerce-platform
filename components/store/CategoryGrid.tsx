import Link from "next/link"
import { prisma } from "@/lib/prisma"

const PALETTE = [
  { from: "from-orange-50", to: "to-orange-100", text: "text-orange-600", border: "border-orange-200/60" },
  { from: "from-purple-50", to: "to-purple-100", text: "text-purple-600", border: "border-purple-200/60" },
  { from: "from-green-50",  to: "to-green-100",  text: "text-green-600",  border: "border-green-200/60"  },
  { from: "from-blue-50",   to: "to-blue-100",   text: "text-blue-600",   border: "border-blue-200/60"   },
  { from: "from-pink-50",   to: "to-pink-100",   text: "text-pink-600",   border: "border-pink-200/60"   },
  { from: "from-amber-50",  to: "to-amber-100",  text: "text-amber-600",  border: "border-amber-200/60"  },
  { from: "from-teal-50",   to: "to-teal-100",   text: "text-teal-600",   border: "border-teal-200/60"   },
  { from: "from-lime-50",   to: "to-lime-100",   text: "text-lime-600",   border: "border-lime-200/60"   },
]

export default async function CategoryGrid() {
  let categories: { name: string; slug: string; emoji: string }[] = []
  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      take: 8,
      select: { name: true, slug: true, emoji: true },
    })
  } catch { categories = [] }

  if (categories.length === 0) return null

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1.5">Explore</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop by Category</h2>
          </div>
          <Link href="/categories" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            View all
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6"/></svg>
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:grid sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((cat, i) => {
            const c = PALETTE[i % PALETTE.length]
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`snap-start flex-shrink-0 flex flex-col items-center justify-center gap-2.5 w-28 h-28 sm:w-auto sm:h-auto sm:aspect-square bg-gradient-to-br ${c.from} ${c.to} border ${c.border} rounded-2xl p-3 group transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
              >
                <span className="text-3xl sm:text-4xl leading-none group-hover:scale-110 transition-transform duration-200 select-none">{cat.emoji}</span>
                <span className={`text-xs sm:text-sm font-semibold ${c.text} text-center leading-tight`}>{cat.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
