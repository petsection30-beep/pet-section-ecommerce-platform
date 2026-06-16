import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import Breadcrumb from "@/components/ui/Breadcrumb"
import brand from "@/config/brand.config"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/session"
import { buildTimeline, statusLabel, statusBadge, PAYMENT_LABEL, type OrderStatus, type PaymentMethod } from "@/lib/order-status"

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const session = await requireAuth()
  if (!session) redirect(`/login?next=/orders/${id}`)

  const order = await prisma.order.findFirst({
    where:   { id, userId: session.userId },
    include: { items: true },
  })
  if (!order) notFound()

  const status   = order.status as OrderStatus
  const method   = order.paymentMethod as PaymentMethod
  const timeline = buildTimeline(status, method)
  const placedOn = new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  const shortId  = order.id.slice(0, 8).toUpperCase()

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Orders", href: "/account/orders" }, { label: shortId }]} />

        {/* Header */}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-mono">{shortId}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Placed on {placedOn} · {PAYMENT_LABEL[method]}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusBadge(status)}`}>
            {statusLabel(status)}
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="md:col-span-2 bg-surface rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6">Order Status</h2>
            <div className="space-y-0">
              {timeline.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                      step.state === "done" ? "bg-success text-white"
                      : step.state === "active" ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-400"
                    }`}>
                      {step.state === "done" ? "✓" : i + 1}
                    </div>
                    {i < timeline.length - 1 && (
                      <div className={`w-0.5 h-10 mt-1 ${step.state === "done" ? "bg-success" : "bg-gray-100"}`} />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className={`text-sm font-semibold ${step.state !== "pending" ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                    {step.state === "active" && <p className="text-xs mt-0.5 text-primary font-medium">In Progress</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info panels */}
          <div className="space-y-4">
            {/* Delivery address */}
            <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-sm text-gray-900 mb-3">📍 Delivery Address</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.fullName}<br />
                {order.addressLine1}<br />
                {order.addressLine2 && <>{order.addressLine2}<br /></>}
                {order.city}, {order.province}{order.postalCode ? ` ${order.postalCode}` : ""}<br />
                {order.phone}
              </p>
            </div>

            {/* Payment */}
            <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-sm text-gray-900 mb-3">💳 Payment</h3>
              <p className="text-sm text-gray-600">Method: <span className="font-medium text-gray-900">{PAYMENT_LABEL[method]}</span></p>
              {order.txnId && <p className="text-sm text-gray-600 mt-1">TXN ID: <span className="font-mono font-medium text-gray-900">{order.txnId}</span></p>}
              <p className="text-sm text-gray-600 mt-1">Status: <span className="font-medium text-gray-900">{statusLabel(status)}</span></p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-6 bg-surface rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Order Items</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                <div className="size-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-xl shrink-0">🐾</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Qty: {item.qty} · {brand.currencySymbol} {item.unitPrice.toLocaleString()} each</p>
                </div>
                <p className="font-semibold text-sm text-gray-900 shrink-0">{brand.currencySymbol} {(item.unitPrice * item.qty).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm font-medium text-gray-900">{brand.currencySymbol} {order.subtotal.toLocaleString()}</span>
          </div>
          <div className="px-6 py-3 bg-gray-50/50 flex justify-between items-center">
            <span className="text-sm text-gray-600">Delivery Fee</span>
            <span className="text-sm font-medium text-gray-900">{order.deliveryFee === 0 ? "FREE" : `${brand.currencySymbol} ${order.deliveryFee.toLocaleString()}`}</span>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-lg text-gray-900">{brand.currencySymbol} {order.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/account/orders" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">← Back to Order History</Link>
        </div>
      </div>
    </div>
  )
}
