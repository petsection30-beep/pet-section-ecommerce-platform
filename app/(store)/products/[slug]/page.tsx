import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProductDetailClient, { type DetailProduct, type DetailVariantGroup } from "@/components/store/ProductDetailClient"

export const dynamic = "force-dynamic"

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { name: true } },
      images:   { orderBy: { order: "asc" } },
      variants: true,
      reviews:  { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  })

  if (!product || !product.isActive) notFound()

  const rating = product.reviews.length
    ? Math.round((product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length) * 10) / 10
    : null

  // Group variants by name, skipping the implicit "Default" variant.
  const groupsMap = new Map<string, DetailVariantGroup>()
  for (const v of product.variants) {
    if (v.name === "Default") continue
    const g = groupsMap.get(v.name) ?? { name: v.name, options: [] }
    g.options.push({ id: v.id, value: v.value, stock: v.stock })
    groupsMap.set(v.name, g)
  }

  const data: DetailProduct = {
    id: product.id, slug: product.slug, name: product.name,
    description: product.description ?? "",
    category: product.category.name,
    price: product.price, comparePrice: product.comparePrice,
    images: product.images.map(i => i.url),
    inStock: product.variants.some(v => v.stock > 0),
    rating, reviewCount: product.reviews.length,
    sku: `PS-${product.id.slice(0, 6).toUpperCase()}`,
    variantGroups: Array.from(groupsMap.values()),
    reviews: product.reviews.map(r => ({
      id: r.id,
      author: r.user?.name ?? "Customer",
      rating: r.rating,
      date: new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      body: r.body ?? "",
    })),
  }

  return <ProductDetailClient product={data} />
}
