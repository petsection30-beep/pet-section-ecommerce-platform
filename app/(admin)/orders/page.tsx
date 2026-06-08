"use client"

import { useState } from "react"
import Link from "next/link"
import brand from "@/config/brand.config"

const ORDERS = [
  { id: "ORD-2026-00042", customer: "Muhammad Ali",   email: "mali@email.com",   items: 3, amount: 5350, method: "JazzCash",  date: "2026-06-08", status: "PENDING_VERIFICATION" },
  { id: "ORD-2026-00041", customer: "Sara Khan",      email: "sara@email.com",   items: 1, amount: 1200, method: "EasyPaisa", date: "2026-06-07", status: "CONFIRMED"            },
  { id: "ORD-2026-00040", customer: "Usman Tariq",    email: "usman@email.com",  items: 2, amount: 3700, method: "COD",       date: "2026-06-06", status: "SHIPPED"              },
  { id: "ORD-2026-00039", customer: "Fatima Raza",    email: "fatima@email.com", items: 1, amount: 890,  method: "EasyPaisa", date: "2026-06-05", status: "DELIVERED"            },
  { id: "ORD-2026-00038", customer: "Ahmed Sheikh",   email: "ahmed@email.com",  items: 4, amount: 4500, method: "COD",       date: "2026-06-04", status: "DELIVERED"            },
  { id: "ORD-2026-00037", customer: "Nadia Hussain",  email: "nadia@email.com",  items: 2, amount: 2650, method: "JazzCash",  date: "2026-06-03", status: "REJECTED"             },
  { id: "ORD-2026-00036", customer: "Bilal Chaudhry", email: "bilal@email.com",  items: 1, amount: 8700, method: "EasyPaisa", date: "2026-06-02", status: "CONFIRMED"            },
]

const STATUS_COLORS: Record<string, string> = {
  PENDING_VERIFICATION: "text-warning  bg-warning/10",
  CONFIRMED:            "text-blue-600 bg-blue-50",
  SHIPPED:              "text-purple-600 bg-purple-50",
  DELIVERED:            "text-success  bg-success/10",
  REJECTED:             "text-danger   bg-danger/10",
  PENDING_COD:          "text-gray-600 bg-gray-100",
  CANCELLED:            "text-gray-400 bg-gray-50",
}
const STATUS_LABEL: Record<string, string> = {
  PENDING_VERIFICATION: "Pending Verification",
  CONFIRMED: "Confirmed", SHIPPED: "Shipped",
  DELIVERED: "Delivered", REJECTED: "Rejected",
  PENDING_COD: "Pending COD", CANCELLED: "Cancelled",
}
const TABS = ["All", "Pending", "Confirmed", "Shipped", "Delivered"]

export default function AdminOrdersPage() {
  const [tab, setTab] = useState("All")

  const filtered = tab === "All" ? ORDERS
    : ORDERS.filter(o => STATUS_LABEL[o.status]?.toLowerCase().includes(tab.toLowerCase()))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{ORDERS.length} total orders</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {["Order", "Customer", "Items", "Amount", "Payment", "Date", "Status", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-900">{o.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{o.customer}</p>
                    <p className="text-xs text-gray-400">{o.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{o.items}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{brand.currencySymbol} {o.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{o.method}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{o.date}</td>
                  <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status]}`}>{STATUS_LABEL[o.status]}</span></td>
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/orders/${o.id}`} className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/30 text-sm text-gray-500">
          Showing {filtered.length} of {ORDERS.length} orders
        </div>
      </div>
    </div>
  )
}
