import brand from "@/config/brand.config"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    where:   { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, createdAt: true,
      orders: { select: { total: true } },
    },
  })

  const rows = customers.map(c => ({
    id:         c.id,
    name:       c.name,
    email:      c.email,
    joined:     new Date(c.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    orderCount: c.orders.length,
    totalSpent: c.orders.reduce((s, o) => s + o.total, 0),
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{rows.length} registered {rows.length === 1 ? "customer" : "customers"}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {["Customer", "Orders", "Total Spent", "Joined"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-bold text-secondary shrink-0 uppercase">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 leading-tight">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{c.orderCount}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{brand.currencySymbol} {c.totalSpent.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{c.joined}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-16 text-center text-gray-400 text-sm">No customers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/30 text-sm text-gray-500">
          Showing {rows.length} {rows.length === 1 ? "customer" : "customers"}
        </div>
      </div>
    </div>
  )
}
