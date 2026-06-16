import Link from "next/link"
import brand from "@/config/brand.config"
import { prisma } from "@/lib/prisma"
import { statusLabel, statusBadge, PAYMENT_LABEL, type OrderStatus, type PaymentMethod } from "@/lib/order-status"

export const dynamic = "force-dynamic"

const REVENUE_STATUSES = ["CONFIRMED", "SHIPPED", "DELIVERED"] as const
const LOW_STOCK_THRESHOLD = 10

export default async function DashboardPage() {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const [
    revenueAgg, totalOrders, pendingOrders, customerCount,
    recentOrders, lowStockVariants,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: [...REVENUE_STATUSES] } },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["PENDING_COD", "PENDING_VERIFICATION"] } } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: { select: { name: true } } },
    }),
    prisma.productVariant.findMany({
      where: { stock: { lte: LOW_STOCK_THRESHOLD } },
      orderBy: { stock: "asc" },
      take: 6,
      include: { product: { select: { name: true, slug: true } } },
    }),
  ])

  const totalRevenue = revenueAgg._sum.total ?? 0

  const stats = [
    { label: "Revenue (confirmed+)", value: `${brand.currencySymbol} ${totalRevenue.toLocaleString()}`, emoji: "💰", color: "from-orange-50 to-orange-100", border: "border-orange-200/60", text: "text-orange-600" },
    { label: "Total Orders",         value: String(totalOrders),    emoji: "🛍️", color: "from-blue-50 to-blue-100",   border: "border-blue-200/60",   text: "text-blue-600"   },
    { label: "Pending Orders",       value: String(pendingOrders),  emoji: "⏳", color: "from-amber-50 to-amber-100", border: "border-amber-200/60",  text: "text-amber-600"  },
    { label: "Customers",            value: String(customerCount),  emoji: "👥", color: "from-green-50 to-green-100",  border: "border-green-200/60",  text: "text-green-600"  },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back — here&apos;s your store at a glance.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} border ${s.border} rounded-2xl p-5`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl leading-none">{s.emoji}</span>
            </div>
            <div className={`text-2xl font-bold ${s.text}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Order", "Customer", "Amount", "Method", "Status"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs font-semibold text-primary hover:underline">{o.id.slice(0, 8).toUpperCase()}</Link>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{o.user.name}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">{brand.currencySymbol} {o.total.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{PAYMENT_LABEL[o.paymentMethod as PaymentMethod]}</td>
                    <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(o.status as OrderStatus)}`}>{statusLabel(o.status as OrderStatus)}</span></td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">⚠️ Low Stock Alerts</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {lowStockVariants.map(v => (
              <div key={v.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{v.product.name}</p>
                  <p className="text-xs text-gray-400">{v.product.slug}</p>
                </div>
                <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${v.stock <= 3 ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"}`}>
                  {v.stock} left
                </span>
              </div>
            ))}
            {lowStockVariants.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-400 text-sm">All products well stocked. 🎉</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
