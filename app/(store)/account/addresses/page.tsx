"use client"

import { useState } from "react"
import Breadcrumb from "@/components/ui/Breadcrumb"

const SAVED = [
  { id: 1, label: "Home", fullName: "Muhammad Ali", phone: "0300-1234567", line1: "House 12, Street 4, F-7/2", city: "Islamabad", province: "ICT", isDefault: true },
  { id: 2, label: "Office", fullName: "Muhammad Ali", phone: "0300-1234567", line1: "Office 3B, Blue Area", city: "Islamabad", province: "ICT", isDefault: false },
]

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(SAVED)

  function setDefault(id: number) {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
  }
  function remove(id: number) {
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account", href: "/account" }, { label: "Addresses" }]} />
        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Addresses</h1>
          <button className="h-9 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
            + Add New
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {addresses.map(addr => (
            <div key={addr.id} className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <span className="font-bold text-sm text-gray-900">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold">Default</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!addr.isDefault && (
                    <button onClick={() => setDefault(addr.id)} className="text-xs text-primary font-medium hover:text-primary/80 transition-colors">Set Default</button>
                  )}
                  <button onClick={() => remove(addr.id)} className="text-xs text-danger font-medium hover:text-danger/80 transition-colors">Remove</button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600 leading-relaxed">
                <p className="font-medium text-gray-900">{addr.fullName}</p>
                <p>{addr.line1}</p>
                <p>{addr.city}, {addr.province}</p>
                <p>{addr.phone}</p>
              </div>
            </div>
          ))}
          {addresses.length === 0 && (
            <div className="text-center py-16">
              <span className="text-5xl">📍</span>
              <p className="mt-4 font-semibold text-gray-700">No saved addresses</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
