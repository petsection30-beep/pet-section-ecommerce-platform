import Link from "next/link"
import brand from "@/config/brand.config"
import { prisma } from "@/lib/prisma"
import { statusLabel, statusBadge, PAYMENT_LABEL, type OrderStatus, type PaymentMethod } from "@/lib/order-status"

const TABS: { label: string; status: OrderStatus | "ALL" }[] = [
  { label: "All",          status: "ALL" },
  { label: "Pending Ver.", status: "PENDING_VERIFICATION" },
  { label: "Pending COD",  status: "PENDING_COD" },
  { label: "Confirmed",    status: "CONFIRMED" },
  { label: "Shipped",      status: "SHIPPED" },
  { label: "Delivered",    status: "DELIVERED" },
  { label: "Rejected",     status: "REJECTED" },
]

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const active = (status ?? "ALL") as OrderStatus | "ALL"

  const where = active !== "ALL" ? { status: active } : {}

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user:  { select: { name: true, email: true } },
        items: { select: { qty: true } },
      },
    }),
    prisma.order.count(),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{totalCount} total orders</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <Link
            key={t.status}
            href={t.status === "ALL" ? "/admin/orders" : `/admin/orders?status=${t.status}`}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${active === t.status ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t.label}
          </Link>
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
              {orders.map(o => {
                const itemCount = o.items.reduce((s, i) => s + i.qty, 0)
                return (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-900">{o.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{o.user.name}</p>
                      <p className="text-xs text-gray-400">{o.user.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{itemCount}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">{brand.currencySymbol} {o.total.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{PAYMENT_LABEL[o.paymentMethod as PaymentMethod]}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                    <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(o.status as OrderStatus)}`}>{statusLabel(o.status as OrderStatus)}</span></td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/orders/${o.id}`} className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">View →</Link>
                    </td>
                  </tr>
                )
              })}
              {orders.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-16 text-center text-gray-400 text-sm">No orders in this view.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/30 text-sm text-gray-500">
          Showing {orders.length} {orders.length === 1 ? "order" : "orders"}
        </div>
      </div>
    </div>
  )
}
