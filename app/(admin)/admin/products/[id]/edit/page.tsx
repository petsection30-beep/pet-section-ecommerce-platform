import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import ProductForm, { type ProductFormInitial } from "@/components/admin/ProductForm"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const session = await requireAdmin()
  if (!session) redirect("/login")

  const product = await prisma.product.findUnique({
    where:   { id },
    include: { images: { orderBy: { order: "asc" }, take: 1 }, variants: true },
  })
  if (!product) notFound()

  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)

  const initial: ProductFormInitial = {
    name:         product.name,
    slug:         product.slug,
    description:  product.description ?? "",
    categoryId:   product.categoryId,
    price:        String(product.price),
    comparePrice: product.comparePrice != null ? String(product.comparePrice) : "",
    stock:        String(totalStock),
    imageUrl:     product.images[0]?.url ?? "",
    isActive:     product.isActive,
    isFeatured:   product.isFeatured,
  }

  return <ProductForm productId={product.id} initial={initial} />
}
