import Link from "next/link"
import { redirect } from "next/navigation"
import Breadcrumb from "@/components/ui/Breadcrumb"
import brand from "@/config/brand.config"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/session"
import { statusLabel, statusBadge, PAYMENT_LABEL, type OrderStatus, type PaymentMethod } from "@/lib/order-status"

export default async function OrdersPage() {
  const session = await requireAuth()
  if (!session) redirect("/login?next=/account/orders")

  const orders = await prisma.order.findMany({
    where:   { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { items: { select: { productName: true, qty: true } } },
  })

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account", href: "/account" }, { label: "Orders" }]} />
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">Order History</h1>

        {orders.length === 0 ? (
          <div className="mt-6 bg-surface rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <span className="text-5xl">📦</span>
            <p className="mt-4 text-lg font-bold text-gray-700">No orders yet</p>
            <p className="text-gray-500 text-sm mt-1">Your placed orders will appear here.</p>
            <Link href="/products" className="inline-flex mt-5 h-11 px-6 items-center rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Start Shopping</Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map(order => {
              const itemNames = order.items.map(i => `${i.productName}${i.qty > 1 ? ` ×${i.qty}` : ""}`).join(" · ")
              return (
                <div key={order.id} className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-mono font-bold text-gray-900">{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} · {PAYMENT_LABEL[order.paymentMethod as PaymentMethod]}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(order.status as OrderStatus)}`}>{statusLabel(order.status as OrderStatus)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{itemNames}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{brand.currencySymbol} {order.total.toLocaleString()}</span>
                    <Link href={`/orders/${order.id}`} className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                      Track Order
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6"/></svg>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
