"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import brand from "@/config/brand.config"
import { useCartStore } from "@/store/cartStore"
import { useCheckoutStore } from "@/store/checkoutStore"
import { computeDeliveryFee } from "@/lib/delivery"

const PROGRESS_STEPS = ["Address", "Payment", "Confirmation"]

type Method = "COD" | "EASYPAISA" | "NAYAPAY" | "BANK_TRANSFER"

export default function CheckoutPaymentPage() {
  const router = useRouter()

  const items      = useCartStore((s) => s.items)
  const totalPrice = useCartStore((s) => s.totalPrice)
  const clearCart  = useCartStore((s) => s.clearCart)
  const address      = useCheckoutStore((s) => s.address)
  const clearAddress = useCheckoutStore((s) => s.clear)

  const [mounted, setMounted] = useState(false)
  const [method, setMethod]   = useState<Method>("COD")
  const [txnId, setTxnId]     = useState("")
  const [txnErr, setTxnErr]   = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError]     = useState("")
  const [pay, setPay] = useState({
    codEnabled:          brand.codEnabled,
    easypaisaEnabled:    brand.easypaisaEnabled,
    easypaisaTitle:      brand.easypaisaTitle,
    easypaisaNumber:     brand.easypaisaNumber,
    nayapayEnabled:      brand.nayapayEnabled,
    nayapayTitle:        brand.nayapayTitle,
    nayapayNumber:       brand.nayapayNumber,
    bankTransferEnabled: brand.bankTransferEnabled,
    bankName:            brand.bankName,
    bankAccountTitle:    brand.bankAccountTitle,
    bankAccountNumber:   brand.bankAccountNumber,
    bankIban:            brand.bankIban,
    deliveryFee:           brand.deliveryFee,
    freeDeliveryEnabled:   brand.freeDeliveryEnabled,
    freeDeliveryThreshold: brand.freeDeliveryThreshold,
  })

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true) }, [])

  // Pull live payment settings (admin-editable) with brand defaults as fallback.
  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => { if (d.settings) setPay({
        codEnabled:          d.settings.codEnabled,
        easypaisaEnabled:    d.settings.easypaisaEnabled,
        easypaisaTitle:      d.settings.easypaisaTitle,
        easypaisaNumber:     d.settings.easypaisaNumber,
        nayapayEnabled:      d.settings.nayapayEnabled,
        nayapayTitle:        d.settings.nayapayTitle,
        nayapayNumber:       d.settings.nayapayNumber,
        bankTransferEnabled: d.settings.bankTransferEnabled,
        bankName:            d.settings.bankName,
        bankAccountTitle:    d.settings.bankAccountTitle,
        bankAccountNumber:   d.settings.bankAccountNumber,
        bankIban:            d.settings.bankIban,
        deliveryFee:           d.settings.deliveryFee,
        freeDeliveryEnabled:   d.settings.freeDeliveryEnabled,
        freeDeliveryThreshold: d.settings.freeDeliveryThreshold,
      }) })
      .catch(() => {})
  }, [])

  // Guard: if address step was skipped, send the user back.
  useEffect(() => {
    if (mounted && !address) router.replace("/checkout")
  }, [mounted, address, router])

  const subtotal    = totalPrice()
  const deliveryFee = computeDeliveryFee(subtotal, pay)
  const total       = subtotal + deliveryFee

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()
    setApiError("")

    if (method !== "COD" && !txnId.trim()) {
      setTxnErr("Transaction ID is required"); return
    }
    if (!address || items.length === 0) {
      router.replace("/cart"); return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: method,
          txnId:         method === "COD" ? undefined : txnId.trim(),
          fullName:      address.fullName,
          phone:         address.phone,
          addressLine1:  address.line1,
          addressLine2:  address.line2 || undefined,
          city:          address.city,
          province:      address.province,
          postalCode:    address.postalCode || "",
          items: items.map((i) => ({
            productId:   i.id,
            variantId:   i.variantId,
            productName: i.name,
            qty:         i.qty,
            unitPrice:   i.price,
          })),
        }),
      })
      const data = await res.json()
      if (res.status === 401) {
        router.push("/login?next=/checkout/payment"); return
      }
      if (!res.ok) {
        setApiError(data.error ?? "Failed to place order. Please try again.")
        return
      }
      clearCart()
      clearAddress()
      router.push(`/checkout/confirmation?orderId=${data.orderId}`)
    } catch {
      setApiError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const paymentInfo = {
    EASYPAISA: { title: pay.easypaisaTitle, number: pay.easypaisaNumber },
    NAYAPAY:   { title: pay.nayapayTitle,   number: pay.nayapayNumber },
  }

  if (!mounted) return null

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Progress */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {PROGRESS_STEPS.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                i === 1 ? "bg-primary text-white" : i === 0 ? "bg-success/10 text-success" : "text-gray-400"
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  i === 0 ? "border-success bg-success text-white" : i === 1 ? "border-white" : "border-gray-300"
                }`}>{i === 0 ? "✓" : i + 1}</span>
                {step}
              </div>
              {i < PROGRESS_STEPS.length - 1 && <div className="w-8 h-0.5 bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-5">
            <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-5">Payment Method</h2>

              <div className="space-y-3">
                {/* COD */}
                {pay.codEnabled && (
                  <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${method === "COD" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" className="mt-0.5 accent-primary" checked={method === "COD"} onChange={() => { setMethod("COD"); setTxnErr("") }} />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">🚚 Cash on Delivery</p>
                      <p className="text-xs text-gray-500 mt-0.5">Pay when your order arrives at your doorstep. No advance payment required.</p>
                    </div>
                  </label>
                )}

                {/* EasyPaisa */}
                {pay.easypaisaEnabled && (
                  <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${method === "EASYPAISA" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" className="mt-0.5 accent-primary" checked={method === "EASYPAISA"} onChange={() => { setMethod("EASYPAISA"); setTxnErr("") }} />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">💚 EasyPaisa</p>
                      <p className="text-xs text-gray-500 mt-0.5">Send payment via EasyPaisa mobile wallet.</p>
                      {method === "EASYPAISA" && (
                        <div className="mt-3 p-3 rounded-xl bg-green-50 border border-green-100 text-xs space-y-1">
                          <p className="font-semibold text-green-800">Send {brand.currencySymbol} {total.toLocaleString()} to:</p>
                          <p className="text-green-700">Account: <span className="font-mono font-bold">{paymentInfo.EASYPAISA.number}</span></p>
                          <p className="text-green-700">Title: <span className="font-semibold">{paymentInfo.EASYPAISA.title}</span></p>
                        </div>
                      )}
                    </div>
                  </label>
                )}

                {/* NayaPay */}
                {pay.nayapayEnabled && (
                  <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${method === "NAYAPAY" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" className="mt-0.5 accent-primary" checked={method === "NAYAPAY"} onChange={() => { setMethod("NAYAPAY"); setTxnErr("") }} />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">💜 NayaPay</p>
                      <p className="text-xs text-gray-500 mt-0.5">Send payment via NayaPay wallet.</p>
                      {method === "NAYAPAY" && (
                        <div className="mt-3 p-3 rounded-xl bg-purple-50 border border-purple-100 text-xs space-y-1">
                          <p className="font-semibold text-purple-800">Send {brand.currencySymbol} {total.toLocaleString()} to:</p>
                          <p className="text-purple-700">Account: <span className="font-mono font-bold">{paymentInfo.NAYAPAY.number}</span></p>
                          <p className="text-purple-700">Title: <span className="font-semibold">{paymentInfo.NAYAPAY.title}</span></p>
                        </div>
                      )}
                    </div>
                  </label>
                )}

                {/* Bank Transfer */}
                {pay.bankTransferEnabled && (
                  <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${method === "BANK_TRANSFER" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" className="mt-0.5 accent-primary" checked={method === "BANK_TRANSFER"} onChange={() => { setMethod("BANK_TRANSFER"); setTxnErr("") }} />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">🏦 Bank Transfer</p>
                      <p className="text-xs text-gray-500 mt-0.5">Transfer to our bank account via app or branch.</p>
                      {method === "BANK_TRANSFER" && (
                        <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs space-y-1">
                          <p className="font-semibold text-blue-800">Transfer {brand.currencySymbol} {total.toLocaleString()} to:</p>
                          <p className="text-blue-700">Bank: <span className="font-semibold">{pay.bankName}</span></p>
                          <p className="text-blue-700">Title: <span className="font-semibold">{pay.bankAccountTitle}</span></p>
                          <p className="text-blue-700">Account #: <span className="font-mono font-bold">{pay.bankAccountNumber}</span></p>
                          {pay.bankIban && <p className="text-blue-700">IBAN: <span className="font-mono font-bold">{pay.bankIban}</span></p>}
                        </div>
                      )}
                    </div>
                  </label>
                )}
              </div>

              {/* TXN ID / reference input for non-COD payments */}
              {method !== "COD" && (
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Transaction ID *</label>
                  <input
                    value={txnId} onChange={e => { setTxnId(e.target.value); setTxnErr("") }}
                    placeholder="Enter the TXN ID from your payment confirmation"
                    className={`w-full h-10 px-3 rounded-xl border text-sm font-mono outline-none transition-all focus:ring-2 ${txnErr ? "border-danger focus:ring-danger/20" : "border-gray-200 focus:border-primary focus:ring-primary/20"}`}
                  />
                  {txnErr && <p className="text-xs text-danger mt-1">{txnErr}</p>}
                  <p className="text-xs text-gray-400 mt-1">Your order will be confirmed after we verify your payment.</p>
                </div>
              )}

              {apiError && (
                <div className="mt-5 px-4 py-3 rounded-xl bg-danger/10 text-danger text-sm font-medium">{apiError}</div>
              )}
            </div>

            <div className="flex justify-between gap-4">
              <Link href="/checkout" className="h-11 px-6 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
                ← Back
              </Link>
              <button type="submit" disabled={submitting}
                className="h-11 px-8 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all disabled:opacity-60 flex items-center gap-2">
                {submitting ? (
                  <><svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg> Placing Order...</>
                ) : "Place Order →"}
              </button>
            </div>
          </form>

          {/* Order summary */}
          <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-6 h-fit sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.id}-${item.variantId ?? ""}`} className="flex justify-between gap-2">
                  <span className="truncate mr-2">{item.name} {item.qty > 1 && <span className="text-gray-400">×{item.qty}</span>}</span>
                  <span className="font-medium text-gray-900 shrink-0">{brand.currencySymbol} {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-900">{brand.currencySymbol} {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className={`font-medium ${deliveryFee === 0 ? "text-success" : "text-gray-900"}`}>
                  {deliveryFee === 0 ? "FREE" : `${brand.currencySymbol} ${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t"><span>Total</span><span>{brand.currencySymbol} {total.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
