"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import brand from "@/config/brand.config"
import { buildTimeline, statusLabel, statusBadge, PAYMENT_LABEL, type OrderStatus, type PaymentMethod } from "@/lib/order-status"

type OrderItem = { id: string; productName: string; qty: number; unitPrice: number }
type Order = {
  id: string; status: OrderStatus; paymentMethod: PaymentMethod; txnId: string | null
  subtotal: number; deliveryFee: number; total: number
  fullName: string; city: string; province: string
  items: OrderItem[]
}

function ConfirmationInner() {
  const params  = useSearchParams()
  const orderId = params.get("orderId")
  const [order, setOrder]     = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  useEffect(() => {
    if (!orderId) { setLoading(false); setError(true); return }
    fetch(`/api/orders/${orderId}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setOrder(d.order))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <svg className="size-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <span className="text-5xl mb-4">😕</span>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Order not found</h1>
        <p className="text-gray-500 text-sm mb-6">We couldn&apos;t load this order. Check your order history.</p>
        <Link href="/account/orders" className="h-11 px-6 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all inline-flex items-center">View My Orders</Link>
      </div>
    )
  }

  const timeline = buildTimeline(order.status, order.paymentMethod)

  return (
    <div className="bg-page min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-5xl mx-auto mb-6">✅</div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Thank you for your order. We&apos;ve received it and will start processing right away.
        </p>

        <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-6 text-left mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Order Number</p>
              <p className="font-bold text-gray-900 text-lg font-mono">{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(order.status)}`}>
              {statusLabel(order.status)}
            </span>
          </div>

          <div className="space-y-2.5 text-sm text-gray-600 mb-4">
            <div className="flex gap-3"><span className="font-medium text-gray-500 w-24 shrink-0">Items</span><span className="text-gray-900">{order.items.map(i => `${i.productName}${i.qty > 1 ? ` ×${i.qty}` : ""}`).join(", ")}</span></div>
            <div className="flex gap-3"><span className="font-medium text-gray-500 w-24 shrink-0">Total</span><span className="text-gray-900 font-semibold">{brand.currencySymbol} {order.total.toLocaleString()}</span></div>
            <div className="flex gap-3"><span className="font-medium text-gray-500 w-24 shrink-0">Payment</span><span className="text-gray-900">{PAYMENT_LABEL[order.paymentMethod]}</span></div>
            <div className="flex gap-3"><span className="font-medium text-gray-500 w-24 shrink-0">Delivery to</span><span className="text-gray-900">{order.city}, {order.province}</span></div>
          </div>

          {/* Timeline */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Order Timeline</p>
            <div className="space-y-3">
              {timeline.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    step.state === "done" ? "bg-success text-white" : step.state === "active" ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {step.state === "done" ? "✓" : i + 1}
                  </div>
                  <span className={`text-sm ${step.state !== "pending" ? "font-semibold text-gray-900" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                  {step.state === "active" && <span className="ml-auto text-xs text-primary font-medium">In Progress</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-6">A confirmation email has been sent to your registered email address.</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/orders/${order.id}`} className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Track Order
          </Link>
          <Link href="/products" className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all active:scale-[0.97]">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ConfirmationInner />
    </Suspense>
  )
}
