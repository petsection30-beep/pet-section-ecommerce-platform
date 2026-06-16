import { notFound } from "next/navigation"
import Breadcrumb from "@/components/ui/Breadcrumb"
import ProductCard from "@/components/store/ProductCard"
import { prisma } from "@/lib/prisma"
import { getProductsByCategorySlug } from "@/lib/products"

export const dynamic = "force-dynamic"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) notFound()

  const products = await getProductsByCategorySlug(slug, 48)

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]} />

        <div className="mt-6 mb-8 flex items-center gap-5">
          <div className="text-6xl leading-none select-none">{category.emoji}</div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{category.name}</h1>
            {category.description && <p className="text-gray-500 text-sm mt-1">{category.description}</p>}
            <p className="text-gray-400 text-xs mt-1">{products.length} {products.length === 1 ? "product" : "products"}</p>
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
            <p className="text-gray-500 text-sm mt-1">Check back soon — we&apos;re adding new stock!</p>
          </div>
        )}
      </div>
    </div>
  )
}
