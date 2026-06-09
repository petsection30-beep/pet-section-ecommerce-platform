"use client"

import { use, useState } from "react"
import Link from "next/link"
import brand from "@/config/brand.config"

const STATUS_FLOW = [
  { key: "PENDING_VERIFICATION", label: "Pending Verification" },
  { key: "CONFIRMED",            label: "Confirmed"            },
  { key: "SHIPPED",              label: "Shipped"              },
  { key: "DELIVERED",            label: "Delivered"            },
]
const STATUS_COLORS: Record<string, string> = {
  PENDING_VERIFICATION: "text-warning bg-warning/10",
  CONFIRMED:            "text-blue-600 bg-blue-50",
  SHIPPED:              "text-purple-600 bg-purple-50",
  DELIVERED:            "text-success bg-success/10",
  REJECTED:             "text-danger bg-danger/10",
}

const MOCK_ORDER = {
  id: "ORD-2026-00042",
  date: "June 8, 2026 · 11:24 AM",
  status: "PENDING_VERIFICATION" as keyof typeof STATUS_COLORS,
  customer: { name: "Muhammad Ali", email: "mali@email.com", phone: "+92 312 345 6789" },
  address: { line1: "House 12, Street 5, F-8/2", city: "Islamabad", province: "Islamabad Capital Territory", postalCode: "44000" },
  payment: { method: "JazzCash", txnId: "JC-20260608-4421" },
  items: [
    { name: "Royal Canin Adult Dog Food 3kg", qty: 2, price: 2100 },
    { name: "Dog Collar — Medium",            qty: 1, price: 750  },
    { name: "Stainless Steel Food Bowl",      qty: 1, price: 400  },
  ],
  deliveryFee: 200,
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [status, setStatus] = useState(MOCK_ORDER.status)
  const [updating, setUpdating] = useState(false)

  const subtotal = MOCK_ORDER.items.reduce((s, i) => s + i.price * i.qty, 0)
  const total    = subtotal + MOCK_ORDER.deliveryFee

  function handleStatusChange(next: string) {
    setUpdating(true)
    setStatus(next as typeof status)
    setTimeout(() => setUpdating(false), 800)
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 mb-1">
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to Orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-mono">{id}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{MOCK_ORDER.date}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[status]}`}>
          {STATUS_FLOW.find(s => s.key === status)?.label ?? status}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main */}
        <div className="xl:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Order Items</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Product", "Qty", "Unit Price", "Total"].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_ORDER.items.map(item => (
                  <tr key={item.name}>
                    <td className="px-6 py-3.5 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-3.5 text-gray-600">{item.qty}</td>
                    <td className="px-6 py-3.5 text-gray-600">{brand.currencySymbol} {item.price.toLocaleString()}</td>
                    <td className="px-6 py-3.5 font-semibold text-gray-900">{brand.currencySymbol} {(item.price * item.qty).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-200 bg-gray-50/30 text-sm">
                <tr>
                  <td colSpan={3} className="px-6 py-2.5 text-right text-gray-500">Subtotal</td>
                  <td className="px-6 py-2.5 font-semibold text-gray-900">{brand.currencySymbol} {subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-6 py-2 text-right text-gray-500">Delivery</td>
                  <td className="px-6 py-2 text-gray-700">{brand.currencySymbol} {MOCK_ORDER.deliveryFee}</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td colSpan={3} className="px-6 py-3 text-right font-bold text-gray-900">Total</td>
                  <td className="px-6 py-3 font-bold text-gray-900 text-base">{brand.currencySymbol} {total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment verification */}
          {MOCK_ORDER.payment.method !== "COD" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4">Payment Verification</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-40">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Payment Method</p>
                  <p className="text-sm font-medium text-gray-900">{MOCK_ORDER.payment.method}</p>
                </div>
                <div className="flex-1 min-w-40">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Transaction ID</p>
                  <p className="text-sm font-mono font-bold text-gray-900">{MOCK_ORDER.payment.txnId}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleStatusChange("CONFIRMED")}
                  className="h-9 px-4 rounded-xl bg-success/10 text-success text-sm font-semibold hover:bg-success/20 transition-colors">
                  ✓ Approve Payment
                </button>
                <button onClick={() => handleStatusChange("REJECTED")}
                  className="h-9 px-4 rounded-xl bg-danger/10 text-danger text-sm font-semibold hover:bg-danger/20 transition-colors">
                  ✗ Reject
                </button>
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
                <button key={s.key} onClick={() => handleStatusChange(s.key)}
                  disabled={updating}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    status === s.key ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${status === s.key ? "bg-primary" : "bg-gray-300"}`} />
                  {s.label}
                </button>
              ))}
              <button onClick={() => handleStatusChange("REJECTED")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  status === "REJECTED" ? "border-danger bg-danger/5 text-danger" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${status === "REJECTED" ? "bg-danger" : "bg-gray-300"}`} />
                Rejected
              </button>
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Customer</h2>
            <p className="text-sm font-semibold text-gray-900">{MOCK_ORDER.customer.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{MOCK_ORDER.customer.email}</p>
            <p className="text-xs text-gray-500 mt-0.5">{MOCK_ORDER.customer.phone}</p>
          </div>

          {/* Delivery address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Delivery Address</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {MOCK_ORDER.address.line1}<br />
              {MOCK_ORDER.address.city}, {MOCK_ORDER.address.province}<br />
              {MOCK_ORDER.address.postalCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
