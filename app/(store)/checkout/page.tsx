"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import brand from "@/config/brand.config"
import { useCartStore } from "@/store/cartStore"
import { useCheckoutStore } from "@/store/checkoutStore"

const PROVINCES = ["Punjab", "Sindh", "KPK", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "AJK"]
const PROGRESS_STEPS = ["Address", "Payment", "Confirmation"]

const DELIVERY_FEE   = 200
const FREE_THRESHOLD = 2000

function sanitizePhone(v: string) {
  return v.replace(/[\s-]/g, "")
}

export default function CheckoutAddressPage() {
  const router = useRouter()

  const items      = useCartStore((s) => s.items)
  const totalPrice = useCartStore((s) => s.totalPrice)
  const savedAddress = useCheckoutStore((s) => s.address)
  const setAddress   = useCheckoutStore((s) => s.setAddress)

  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({
    fullName: "", phone: "", line1: "", line2: "",
    city: "", province: "Punjab", postalCode: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (savedAddress) {
      setForm({
        fullName: savedAddress.fullName, phone: savedAddress.phone,
        line1: savedAddress.line1, line2: savedAddress.line2,
        city: savedAddress.city, province: savedAddress.province,
        postalCode: savedAddress.postalCode,
      })
    }
  }, [savedAddress])

  const subtotal    = totalPrice()
  const deliveryFee = subtotal >= FREE_THRESHOLD ? 0 : DELIVERY_FEE
  const total       = subtotal + deliveryFee
  const itemCount   = items.reduce((s, i) => s + i.qty, 0)

  function set(field: string, val: string) {
    setForm(prev => ({ ...prev, [field]: val }))
    setErrors(prev => ({ ...prev, [field]: "" }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.fullName.trim())                     e.fullName = "Full name is required"
    const phone = sanitizePhone(form.phone)
    if (!phone)                                    e.phone = "Phone number is required"
    else if (!/^(\+92|0)[0-9]{10}$/.test(phone))   e.phone = "Enter a valid PK number (e.g. 03001234567)"
    if (form.line1.trim().length < 5)              e.line1 = "Address must be at least 5 characters"
    if (!form.city.trim())                         e.city = "City is required"
    if (form.postalCode && !/^\d{5}$/.test(form.postalCode)) e.postalCode = "Postal code must be 5 digits"
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setAddress({ ...form, phone: sanitizePhone(form.phone) })
    router.push("/checkout/payment")
  }

  // Empty cart guard (after hydration)
  if (mounted && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <span className="text-6xl mb-4 block">🛒</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some products before checking out.</p>
        <Link href="/products" className="h-11 px-8 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all inline-flex items-center">
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Progress */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {PROGRESS_STEPS.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                i === 0 ? "bg-primary text-white" : "text-gray-400"
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  i === 0 ? "border-white" : "border-gray-300"
                }`}>{i + 1}</span>
                {step}
              </div>
              {i < PROGRESS_STEPS.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-200 mx-1" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-5">Delivery Address</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Full Name *</label>
                  <input value={form.fullName} onChange={e => set("fullName", e.target.value)}
                    className={`w-full h-10 px-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${errors.fullName ? "border-danger focus:ring-danger/20" : "border-gray-200 focus:border-primary focus:ring-primary/20"}`}
                    placeholder="Muhammad Ali"
                  />
                  {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Phone Number *</label>
                  <input value={form.phone} onChange={e => set("phone", e.target.value)}
                    className={`w-full h-10 px-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${errors.phone ? "border-danger focus:ring-danger/20" : "border-gray-200 focus:border-primary focus:ring-primary/20"}`}
                    placeholder="03001234567"
                  />
                  {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Address Line 1 *</label>
                  <input value={form.line1} onChange={e => set("line1", e.target.value)}
                    className={`w-full h-10 px-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${errors.line1 ? "border-danger focus:ring-danger/20" : "border-gray-200 focus:border-primary focus:ring-primary/20"}`}
                    placeholder="House no., street, area"
                  />
                  {errors.line1 && <p className="text-xs text-danger mt-1">{errors.line1}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Address Line 2 <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input value={form.line2} onChange={e => set("line2", e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Landmark, nearby area"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">City *</label>
                  <input value={form.city} onChange={e => set("city", e.target.value)}
                    className={`w-full h-10 px-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${errors.city ? "border-danger focus:ring-danger/20" : "border-gray-200 focus:border-primary focus:ring-primary/20"}`}
                    placeholder="Islamabad"
                  />
                  {errors.city && <p className="text-xs text-danger mt-1">{errors.city}</p>}
                </div>

                {/* Province */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Province *</label>
                  <select value={form.province} onChange={e => set("province", e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                  >
                    {PROVINCES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>

                {/* Postal */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Postal Code <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input value={form.postalCode} onChange={e => set("postalCode", e.target.value)}
                    className={`w-full h-10 px-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${errors.postalCode ? "border-danger focus:ring-danger/20" : "border-gray-200 focus:border-primary focus:ring-primary/20"}`}
                    placeholder="44000"
                  />
                  {errors.postalCode && <p className="text-xs text-danger mt-1">{errors.postalCode}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <Link href="/cart" className="h-11 px-6 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
                ← Back to Cart
              </Link>
              <button type="submit" className="h-11 px-8 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all">
                Continue to Payment →
              </button>
            </div>
          </form>

          {/* Mini summary */}
          <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-6 h-fit sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between"><span>{itemCount} {itemCount === 1 ? "item" : "items"}</span><span className="font-medium text-gray-900">{brand.currencySymbol} {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className={`font-medium ${deliveryFee === 0 ? "text-success" : "text-gray-900"}`}>
                  {deliveryFee === 0 ? "FREE" : `${brand.currencySymbol} ${deliveryFee}`}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span><span>{brand.currencySymbol} {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
