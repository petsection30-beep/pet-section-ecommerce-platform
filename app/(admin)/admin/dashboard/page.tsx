import brand from "@/config/brand.config"

const STATS = [
  { label: "Revenue Today",   value: "₨ 24,500", delta: "+12%",  emoji: "💰", color: "from-orange-50 to-orange-100",   border: "border-orange-200/60", text: "text-orange-600" },
  { label: "Total Orders",    value: "142",       delta: "+8%",   emoji: "🛍️", color: "from-blue-50 to-blue-100",       border: "border-blue-200/60",   text: "text-blue-600"   },
  { label: "New Customers",   value: "18",        delta: "+24%",  emoji: "👥", color: "from-green-50 to-green-100",     border: "border-green-200/60",  text: "text-green-600"  },
  { label: "Low Stock Items", value: "5",         delta: "Action",emoji: "⚠️", color: "from-red-50 to-red-100",         border: "border-red-200/60",    text: "text-red-600"    },
]

const RECENT_ORDERS = [
  { id: "ORD-2026-00042", customer: "Muhammad Ali",   amount: 5350, method: "JazzCash",  status: "Pending Verification", statusColor: "text-warning bg-warning/10"   },
  { id: "ORD-2026-00041", customer: "Sara Khan",      amount: 1200, method: "EasyPaisa", status: "Confirmed",            statusColor: "text-success bg-success/10"   },
  { id: "ORD-2026-00040", customer: "Usman Tariq",    amount: 3700, method: "COD",       status: "Shipped",              statusColor: "text-blue-600 bg-blue-50"     },
  { id: "ORD-2026-00039", customer: "Fatima Raza",    amount: 890,  method: "EasyPaisa", status: "Delivered",            statusColor: "text-success bg-success/10"   },
  { id: "ORD-2026-00038", customer: "Ahmed Sheikh",   amount: 4500, method: "COD",       status: "Delivered",            statusColor: "text-success bg-success/10"   },
]

const LOW_STOCK = [
  { name: "Parrot Cage Premium XL",   sku: "PP-P10", stock: 2  },
  { name: "Cat Scratching Post Tower",sku: "PP-P9",  stock: 3  },
  { name: "Hamster Running Wheel",    sku: "PP-P8",  stock: 4  },
  { name: "Interactive Cat Toy Set",  sku: "PP-P6",  stock: 5  },
  { name: "Dog Grooming Kit",         sku: "PP-P13", stock: 6  },
]

export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back — here's what's happening today.</p>
        </div>
        <span className="text-sm text-gray-400">June 9, 2026</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} border ${s.border} rounded-2xl p-5`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl leading-none">{s.emoji}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.delta.startsWith("+") ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                {s.delta}
              </span>
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
            <a href="/admin/orders" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">View all →</a>
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
                {RECENT_ORDERS.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-900">{o.id}</td>
                    <td className="px-5 py-3.5 text-gray-700">{o.customer}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">{brand.currencySymbol} {o.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{o.method}</td>
                    <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${o.statusColor}`}>{o.status}</span></td>
                  </tr>
                ))}
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
            {LOW_STOCK.map(item => (
              <div key={item.sku} className="px-6 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.sku}</p>
                </div>
                <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${item.stock <= 3 ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"}`}>
                  {item.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
