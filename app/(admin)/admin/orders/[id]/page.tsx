"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import brand from "@/config/brand.config"
import { statusLabel, statusBadge, PAYMENT_LABEL, type OrderStatus, type PaymentMethod } from "@/lib/order-status"

const STATUS_FLOW: { key: OrderStatus; label: string }[] = [
  { key: "PENDING_VERIFICATION", label: "Pending Verification" },
  { key: "PENDING_COD",          label: "Pending (COD)" },
  { key: "CONFIRMED",            label: "Confirmed" },
  { key: "SHIPPED",              label: "Shipped" },
  { key: "DELIVERED",            label: "Delivered" },
  { key: "REJECTED",             label: "Rejected" },
  { key: "CANCELLED",            label: "Cancelled" },
]

type Order = {
  id: string; status: OrderStatus; paymentMethod: PaymentMethod; txnId: string | null
  subtotal: number; deliveryFee: number; total: number; createdAt: string
  fullName: string; phone: string; addressLine1: string; addressLine2: string | null
  city: string; province: string; postalCode: string
  user: { name: string; email: string }
  items: { id: string; productName: string; qty: number; unitPrice: number }[]
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder]       = useState<Order | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [toast, setToast]       = useState("")

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(r => { if (r.status === 404) { setNotFound(true); return null } return r.json() })
      .then(d => { if (d) setOrder(d.order) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  async function changeStatus(next: OrderStatus) {
    if (!order || updating) return
    setUpdating(true)
    const prev = order.status
    setOrder({ ...order, status: next })
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) { setOrder({ ...order, status: prev }); setToast("Failed to update status") }
      else { setToast(`Status updated to ${statusLabel(next)}`) }
    } catch {
      setOrder({ ...order, status: prev }); setToast("Failed to update status")
    } finally {
      setUpdating(false)
      setTimeout(() => setToast(""), 2200)
    }
  }

  if (loading) {
    return <div className="py-24 flex justify-center"><svg className="size-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg></div>
  }
  if (notFound || !order) {
    return (
      <div className="py-24 text-center">
        <span className="text-5xl">😕</span>
        <p className="mt-4 font-bold text-gray-700">Order not found</p>
        <Link href="/admin/orders" className="inline-flex mt-4 h-10 px-5 items-center rounded-xl bg-primary text-white text-sm font-semibold">Back to Orders</Link>
      </div>
    )
  }

  const placedOn = new Date(order.createdAt).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium shadow-lg">{toast}</div>}

      <div className="flex items-start justify-between mb-8">
        <div>
          <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 mb-1">
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to Orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-mono">{order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{placedOn}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusBadge(order.status)}`}>{statusLabel(order.status)}</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main */}
        <div className="xl:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-900">Order Items</h2></div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Product", "Qty", "Unit Price", "Total"].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-3.5 font-medium text-gray-900">{item.productName}</td>
                    <td className="px-6 py-3.5 text-gray-600">{item.qty}</td>
                    <td className="px-6 py-3.5 text-gray-600">{brand.currencySymbol} {item.unitPrice.toLocaleString()}</td>
                    <td className="px-6 py-3.5 font-semibold text-gray-900">{brand.currencySymbol} {(item.unitPrice * item.qty).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-200 bg-gray-50/30 text-sm">
                <tr><td colSpan={3} className="px-6 py-2.5 text-right text-gray-500">Subtotal</td><td className="px-6 py-2.5 font-semibold text-gray-900">{brand.currencySymbol} {order.subtotal.toLocaleString()}</td></tr>
                <tr><td colSpan={3} className="px-6 py-2 text-right text-gray-500">Delivery</td><td className="px-6 py-2 text-gray-700">{order.deliveryFee === 0 ? "FREE" : `${brand.currencySymbol} ${order.deliveryFee.toLocaleString()}`}</td></tr>
                <tr className="border-t border-gray-200"><td colSpan={3} className="px-6 py-3 text-right font-bold text-gray-900">Total</td><td className="px-6 py-3 font-bold text-gray-900 text-base">{brand.currencySymbol} {order.total.toLocaleString()}</td></tr>
              </tfoot>
            </table>
          </div>

          {/* Payment verification */}
          {order.paymentMethod !== "COD" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4">Payment Verification</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-40">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Payment Method</p>
                  <p className="text-sm font-medium text-gray-900">{PAYMENT_LABEL[order.paymentMethod]}</p>
                </div>
                <div className="flex-1 min-w-40">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Transaction ID</p>
                  <p className="text-sm font-mono font-bold text-gray-900">{order.txnId || "—"}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => changeStatus("CONFIRMED")} disabled={updating}
                  className="h-9 px-4 rounded-xl bg-success/10 text-success text-sm font-semibold hover:bg-success/20 transition-colors disabled:opacity-50">✓ Approve Payment</button>
                <button onClick={() => changeStatus("REJECTED")} disabled={updating}
                  className="h-9 px-4 rounded-xl bg-danger/10 text-danger text-sm font-semibold hover:bg-danger/20 transition-colors disabled:opacity-50">✗ Reject</button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status update */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Update Status</h2>
            <div className="space-y-2">
              {STATUS_FLOW.map(s => (
                <button key={s.key} onClick={() => changeStatus(s.key)} disabled={updating}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium border transition-all disabled:opacity-60 ${
                    order.status === s.key ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${order.status === s.key ? "bg-primary" : "bg-gray-300"}`} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Customer</h2>
            <p className="text-sm font-semibold text-gray-900">{order.user.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{order.user.email}</p>
            <p className="text-xs text-gray-500 mt-0.5">{order.phone}</p>
          </div>

          {/* Delivery address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Delivery Address</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {order.fullName}<br />
              {order.addressLine1}<br />
              {order.addressLine2 && <>{order.addressLine2}<br /></>}
              {order.city}, {order.province}{order.postalCode ? ` ${order.postalCode}` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
