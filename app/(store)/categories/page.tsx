import Link from "next/link"
import Breadcrumb from "@/components/ui/Breadcrumb"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const PALETTE = [
  { from: "from-orange-50", to: "to-orange-100", border: "border-orange-200/60", accent: "text-orange-600" },
  { from: "from-purple-50", to: "to-purple-100", border: "border-purple-200/60", accent: "text-purple-600" },
  { from: "from-green-50",  to: "to-green-100",  border: "border-green-200/60",  accent: "text-green-600"  },
  { from: "from-blue-50",   to: "to-blue-100",   border: "border-blue-200/60",   accent: "text-blue-600"   },
  { from: "from-pink-50",   to: "to-pink-100",   border: "border-pink-200/60",   accent: "text-pink-600"   },
  { from: "from-amber-50",  to: "to-amber-100",  border: "border-amber-200/60",  accent: "text-amber-600"  },
  { from: "from-teal-50",   to: "to-teal-100",   border: "border-teal-200/60",   accent: "text-teal-600"   },
  { from: "from-lime-50",   to: "to-lime-100",   border: "border-lime-200/60",   accent: "text-lime-600"   },
  { from: "from-cyan-50",   to: "to-cyan-100",   border: "border-cyan-200/60",   accent: "text-cyan-600"   },
  { from: "from-rose-50",   to: "to-rose-100",   border: "border-rose-200/60",   accent: "text-rose-600"   },
  { from: "from-indigo-50", to: "to-indigo-100", border: "border-indigo-200/60", accent: "text-indigo-600" },
  { from: "from-violet-50", to: "to-violet-100", border: "border-violet-200/60", accent: "text-violet-600" },
]

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  })

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

        <div className="mt-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop by Category</h1>
          <p className="text-gray-500 mt-1 text-sm">Find everything your pet needs in one place</p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl">🏷️</span>
            <p className="mt-4 text-lg font-semibold text-gray-700">No categories yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, i) => {
              const c = PALETTE[i % PALETTE.length]
              return (
                <Link key={cat.slug} href={`/categories/${cat.slug}`}
                  className={`group bg-gradient-to-br ${c.from} ${c.to} border ${c.border} rounded-3xl p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-200`}>
                  <div className="flex items-start justify-between">
                    <span className="text-5xl leading-none group-hover:scale-110 transition-transform duration-200 select-none">{cat.emoji}</span>
                    <span className="text-xs font-medium text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">{cat._count.products} items</span>
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${c.accent}`}>{cat.name}</h2>
                    {cat.description && <p className="text-gray-600 text-xs leading-relaxed mt-1">{cat.description}</p>}
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${c.accent} mt-auto`}>
                    Shop now
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
