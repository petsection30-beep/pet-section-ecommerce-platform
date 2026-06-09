"use client"

import Link from "next/link"
import { useCartStore } from "@/store/cartStore"
import brand from "@/config/brand.config"

const DELIVERY_FEE   = 200
const FREE_THRESHOLD = 2000

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice } = useCartStore()
  const subtotal    = totalPrice()
  const deliveryFee = subtotal >= FREE_THRESHOLD ? 0 : DELIVERY_FEE
  const total       = subtotal + deliveryFee

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <span className="text-6xl mb-4 block">🛒</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some products to get started.</p>
        <Link href="/products" className="h-11 px-8 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all inline-flex items-center">
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart <span className="text-gray-400 font-normal text-lg">({items.length})</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={`${item.id}-${item.variantId ?? ""}`} className="flex gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className={`size-20 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl shrink-0`}>
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2 block">
                  {item.name}
                </Link>
                {item.variantName && <p className="text-xs text-gray-500 mt-0.5">{item.variantName}</p>}
                <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-0.5">
                    <button onClick={() => updateQty(item.id, item.qty - 1, item.variantId)}
                      className="size-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all font-bold">−</button>
                    <span className="w-7 text-center text-sm font-semibold text-gray-900">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1, item.variantId)}
                      className="size-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all font-bold">+</button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900">{brand.currencySymbol} {(item.price * item.qty).toLocaleString()}</span>
                    <button onClick={() => removeItem(item.id, item.variantId)} className="text-xs text-danger hover:text-danger/80 transition-colors">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-medium text-gray-900">{brand.currencySymbol} {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className={`font-medium ${deliveryFee === 0 ? "text-success" : "text-gray-900"}`}>
                  {deliveryFee === 0 ? "FREE" : `${brand.currencySymbol} ${deliveryFee}`}
                </span>
              </div>
              {subtotal < FREE_THRESHOLD && (
                <p className="text-xs text-primary bg-primary/5 rounded-xl px-3 py-2">
                  Add {brand.currencySymbol} {(FREE_THRESHOLD - subtotal).toLocaleString()} more for free delivery!
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-lg text-primary">{brand.currencySymbol} {total.toLocaleString()}</span>
              </div>
            </div>
            <Link href="/checkout" className="w-full mt-5 h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-[0.97]">
              Proceed to Checkout
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Secure checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
