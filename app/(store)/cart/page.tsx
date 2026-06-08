"use client"

import { useState } from "react"
import Link from "next/link"
import Breadcrumb from "@/components/ui/Breadcrumb"
import brand from "@/config/brand.config"

type CartItem = { id: string; name: string; category: string; price: number; emoji: string; gradient: string; qty: number; variant: string }

const INITIAL_CART: CartItem[] = [
  { id: "p1", name: "Royal Canin Adult Dog Food 3kg", category: "Dog Food",    price: 3500, emoji: "🐕", gradient: "from-orange-50 to-orange-100", qty: 1, variant: "Medium (3kg) · Chicken" },
  { id: "p7", name: "Stainless Steel Pet Bowl Set",  category: "Accessories", price: 450,  emoji: "🥣", gradient: "from-sky-50 to-sky-100",       qty: 2, variant: "Standard" },
  { id: "p11",name: "Dog Training Clicker Kit",      category: "Dog Training",price: 750,  emoji: "🎯", gradient: "from-yellow-50 to-yellow-100",  qty: 1, variant: "Standard" },
]
const DELIVERY_FEE = 200

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART)

  function updateQty(id: string, delta: number) {
    setItems(prev => prev
      .map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)
    )
  }
  function remove(id: string) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const total    = subtotal + (items.length > 0 ? DELIVERY_FEE : 0)
  const freeDelivery = subtotal >= 2000

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-28">
            <span className="text-7xl">🛒</span>
            <p className="mt-5 text-xl font-bold text-gray-700">Your cart is empty</p>
            <p className="text-gray-500 text-sm mt-2">Add some products to get started!</p>
            <Link href="/products" className="mt-6 inline-flex items-center gap-2 h-11 px-8 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
                  <div className={`size-20 shrink-0 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl select-none`}>
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted uppercase tracking-wide mb-0.5">{item.category}</p>
                    <h3 className="font-semibold text-sm text-gray-900 leading-snug">{item.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{item.variant}</p>
                    <div className="mt-3 flex items-center justify-between gap-4">
                      {/* Qty stepper */}
                      <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden">
                        <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-base font-medium">−</button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold border-x border-gray-200">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, +1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-base font-medium">+</button>
                      </div>
                      <span className="font-bold text-gray-900 text-sm">{brand.currencySymbol} {(item.price * item.qty).toLocaleString()}</span>
                      <button onClick={() => remove(item.id)} className="text-xs text-danger hover:text-danger/80 font-medium transition-colors">Remove</button>
                    </div>
                  </div>
                </div>
              ))}

              <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <div>
              <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                <h2 className="font-bold text-gray-900 mb-5">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.reduce((s,i) => s + i.qty, 0)} items)</span>
                    <span className="font-medium text-gray-900">{brand.currencySymbol} {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className={`font-medium ${freeDelivery ? "text-success" : "text-gray-900"}`}>
                      {freeDelivery ? "Free" : `${brand.currencySymbol} ${DELIVERY_FEE}`}
                    </span>
                  </div>
                  {!freeDelivery && (
                    <p className="text-xs text-gray-400">Add {brand.currencySymbol} {(2000 - subtotal).toLocaleString()} more for free delivery</p>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{brand.currencySymbol} {(freeDelivery ? subtotal : total).toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97]"
                >
                  Proceed to Checkout
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>

                <div className="mt-5 flex items-center justify-center gap-3 text-xs text-gray-400">
                  <span>🔒 Secure checkout</span>
                  <span>·</span>
                  <span>COD available</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
