import Link from "next/link"
import Breadcrumb from "@/components/ui/Breadcrumb"
import brand from "@/config/brand.config"

const ORDERS = [
  { id: "ORD-2026-00042", date: "2026-06-08", items: ["Royal Canin Dog Food", "Pet Bowl Set", "Training Clicker"], total: 5350, method: "JazzCash",  status: "Pending Verification", statusColor: "text-warning  bg-warning/10"  },
  { id: "ORD-2026-00031", date: "2026-05-22", items: ["Orthopedic Dog Bed", "Leather Leash"],                     total: 5150, method: "EasyPaisa", status: "Delivered",            statusColor: "text-success  bg-success/10"  },
  { id: "ORD-2026-00018", date: "2026-04-10", items: ["Aquarium LED Light"],                                      total: 2400, method: "COD",       status: "Delivered",            statusColor: "text-success  bg-success/10"  },
  { id: "ORD-2026-00009", date: "2026-03-02", items: ["Cat Scratching Post", "Interactive Toy Set"],              total: 4090, method: "EasyPaisa", status: "Delivered",            statusColor: "text-success  bg-success/10"  },
  { id: "ORD-2026-00003", date: "2026-01-15", items: ["Whiskas Cat Food 12-Pack"],                                total: 1200, method: "COD",       status: "Delivered",            statusColor: "text-success  bg-success/10"  },
]

export default function OrdersPage() {
  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account", href: "/account" }, { label: "Orders" }]} />
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">Order History</h1>

        <div className="mt-6 space-y-4">
          {ORDERS.map(order => (
            <div key={order.id} className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono font-bold text-gray-900">{order.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.date} · {order.method}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.statusColor}`}>{order.status}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{order.items.join(" · ")}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{brand.currencySymbol} {order.total.toLocaleString()}</span>
                <Link href={`/orders/${order.id}`} className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                  Track Order
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6"/></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
