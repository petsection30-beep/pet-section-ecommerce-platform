import Breadcrumb from "@/components/ui/Breadcrumb"
import brand from "@/config/brand.config"

const TIMELINE = [
  { label: "Order Placed",          date: "Jun 8, 2026 · 14:32", done: true,  active: false },
  { label: "Payment Verification",  date: "Awaiting admin review",done: false, active: true  },
  { label: "Confirmed & Processing",date: "—",                   done: false, active: false },
  { label: "Shipped",               date: "—",                   done: false, active: false },
  { label: "Delivered",             date: "—",                   done: false, active: false },
]

const ORDER_ITEMS = [
  { name: "Royal Canin Adult Dog Food 3kg", qty: 1, price: 3500, emoji: "🐕", gradient: "from-orange-50 to-orange-100" },
  { name: "Stainless Steel Pet Bowl Set",   qty: 2, price: 450,  emoji: "🥣", gradient: "from-sky-50 to-sky-100" },
  { name: "Dog Training Clicker Kit",       qty: 1, price: 750,  emoji: "🎯", gradient: "from-yellow-50 to-yellow-100" },
]

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Orders", href: "/account/orders" }, { label: id }]} />

        {/* Header */}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-mono">{id}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Placed on June 8, 2026 · JazzCash</p>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-semibold">
            Pending Verification
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="md:col-span-2 bg-surface rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6">Order Status</h2>
            <div className="space-y-0">
              {TIMELINE.map((step, i) => (
                <div key={i} className="flex gap-4">
                  {/* Dot + line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                      step.done ? "bg-success text-white"
                      : step.active ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-400"
                    }`}>
                      {step.done ? "✓" : i + 1}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className={`w-0.5 h-10 mt-1 ${step.done ? "bg-success" : "bg-gray-100"}`} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-8">
                    <p className={`text-sm font-semibold ${step.done || step.active ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                    <p className={`text-xs mt-0.5 ${step.active ? "text-primary font-medium" : "text-gray-400"}`}>{step.date}</p>
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
                Muhammad Ali<br />
                House 12, Street 4, F-7/2<br />
                Islamabad, ICT<br />
                0300-1234567
              </p>
            </div>

            {/* Payment */}
            <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-sm text-gray-900 mb-3">💳 Payment</h3>
              <p className="text-sm text-gray-600">Method: <span className="font-medium text-gray-900">JazzCash</span></p>
              <p className="text-sm text-gray-600 mt-1">Status: <span className="font-medium text-warning">Pending Verification</span></p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-6 bg-surface rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Order Items</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {ORDER_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-xl shrink-0`}>
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Qty: {item.qty}</p>
                </div>
                <p className="font-semibold text-sm text-gray-900 shrink-0">{brand.currencySymbol} {(item.price * item.qty).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-600">Delivery Fee</span>
            <span className="text-sm font-medium text-gray-900">{brand.currencySymbol} 200</span>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-lg text-gray-900">{brand.currencySymbol} 5,350</span>
          </div>
        </div>
      </div>
    </div>
  )
}
