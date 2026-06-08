import Link from "next/link"
import brand from "@/config/brand.config"

const ORDER_NUMBER = "ORD-2026-00042"

export default function ConfirmationPage() {
  return (
    <div className="bg-page min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Success animation */}
        <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-5xl mx-auto mb-6">
          ✅
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Thank you for your order. We've received it and will start processing right away.
        </p>

        {/* Order card */}
        <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-6 text-left mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Order Number</p>
              <p className="font-bold text-gray-900 text-lg font-mono">{ORDER_NUMBER}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-semibold">
              Pending Verification
            </span>
          </div>

          <div className="space-y-2.5 text-sm text-gray-600 mb-4">
            {[
              ["Items", "Royal Canin Dog Food, Pet Bowl Set, Training Clicker"],
              ["Total", `${brand.currencySymbol} 5,350`],
              ["Payment", "JazzCash (Pending Verification)"],
              ["Delivery to", "Islamabad, Punjab"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <span className="font-medium text-gray-500 w-24 shrink-0">{k}</span>
                <span className="text-gray-900">{v}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Order Timeline</p>
            <div className="space-y-3">
              {[
                { label: "Order Placed",         done: true,  active: false },
                { label: "Payment Verification", done: false, active: true  },
                { label: "Confirmed & Processing",done:false, active: false },
                { label: "Shipped",              done: false, active: false },
                { label: "Delivered",            done: false, active: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    step.done ? "bg-success text-white" : step.active ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {step.done ? "✓" : i + 1}
                  </div>
                  <span className={`text-sm ${step.done || step.active ? "font-semibold text-gray-900" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                  {step.active && <span className="ml-auto text-xs text-primary font-medium">In Progress</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-6">
          A confirmation email has been sent to your registered email address.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/orders/${ORDER_NUMBER}`} className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
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
