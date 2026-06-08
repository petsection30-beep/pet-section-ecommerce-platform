"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import brand from "@/config/brand.config"

const PROVINCES = ["Punjab", "Sindh", "KPK", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "AJK"]

const PROGRESS_STEPS = ["Address", "Payment", "Confirmation"]

export default function CheckoutAddressPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: "", phone: "", line1: "", line2: "",
    city: "", province: "Punjab", postalCode: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set(field: string, val: string) {
    setForm(prev => ({ ...prev, [field]: val }))
    setErrors(prev => ({ ...prev, [field]: "" }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.fullName.trim())  e.fullName = "Full name is required"
    if (!form.phone.trim())     e.phone    = "Phone number is required"
    if (!form.line1.trim())     e.line1    = "Address is required"
    if (!form.city.trim())      e.city     = "City is required"
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    router.push("/checkout/payment")
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
                    placeholder="0300-0000000"
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
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="44000"
                  />
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
              <div className="flex justify-between"><span>3 items</span><span className="font-medium text-gray-900">{brand.currencySymbol} 4,700</span></div>
              <div className="flex justify-between"><span>Delivery</span><span className="font-medium text-gray-900">{brand.currencySymbol} 200</span></div>
              <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span><span>{brand.currencySymbol} 4,900</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
