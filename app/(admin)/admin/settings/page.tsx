"use client"

import { useState } from "react"
import brand from "@/config/brand.config"

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState<string | null>(null)

  function save(section: string) {
    setSaved(section)
    setTimeout(() => setSaved(null), 1800)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure store details, payments, and notifications.</p>
      </div>

      <div className="space-y-6">
        {/* Store info */}
        <Section title="Store Information" emoji="🏪">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Store Name"    defaultValue={brand.storeName} />
            <Field label="Contact Email" defaultValue={brand.contactEmail} type="email" />
            <Field label="Contact Phone" defaultValue={brand.contactPhone} />
            <Field label="Website URL"   defaultValue="https://pawspoint.pk" />
          </div>
          <SaveButton section="store" saved={saved} onClick={() => save("store")} />
        </Section>

        {/* Payments */}
        <Section title="Payment Methods" emoji="💳">
          <div className="space-y-4">
            {/* COD toggle */}
            <ToggleRow label="Cash on Delivery (COD)" desc="Allow customers to pay on delivery" defaultOn={brand.codEnabled} />

            {/* EasyPaisa */}
            <div className="p-4 rounded-xl border border-gray-200 space-y-3">
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-lg">📱</span> EasyPaisa
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Account Title"  defaultValue={brand.easypaisaTitle}  />
                <Field label="Account Number" defaultValue={brand.easypaisaNumber} />
              </div>
            </div>

            {/* JazzCash */}
            <div className="p-4 rounded-xl border border-gray-200 space-y-3">
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-lg">📲</span> JazzCash
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Account Title"  defaultValue={brand.jazzcashTitle}  />
                <Field label="Account Number" defaultValue={brand.jazzcashNumber} />
              </div>
            </div>
          </div>
          <SaveButton section="payments" saved={saved} onClick={() => save("payments")} />
        </Section>

        {/* SMTP */}
        <Section title="Email / SMTP" emoji="📧">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="SMTP Host"     defaultValue="smtp.gmail.com" />
            <Field label="SMTP Port"     defaultValue="587"            />
            <Field label="SMTP Username" defaultValue="your@gmail.com" />
            <Field label="SMTP Password" defaultValue="••••••••••••"   type="password" />
          </div>
          <div className="mt-4">
            <ToggleRow label="Use TLS (port 465)" desc="Disable for STARTTLS (port 587)" defaultOn={false} />
          </div>
          <SaveButton section="smtp" saved={saved} onClick={() => save("smtp")} />
        </Section>

        {/* Social links */}
        <Section title="Social Links" emoji="🔗">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Instagram" defaultValue={brand.socialLinks.instagram ?? ""} placeholder="https://instagram.com/..." />
            <Field label="Facebook"  defaultValue={brand.socialLinks.facebook  ?? ""} placeholder="https://facebook.com/..."  />
            <Field label="TikTok"    defaultValue={brand.socialLinks.tiktok    ?? ""} placeholder="https://tiktok.com/..."    />
            <Field label="WhatsApp"  defaultValue={brand.socialLinks.whatsapp  ?? ""} placeholder="https://wa.me/..."         />
          </div>
          <SaveButton section="social" saved={saved} onClick={() => save("social")} />
        </Section>
      </div>
    </div>
  )
}

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
        <span className="text-xl leading-none">{emoji}</span> {title}
      </h2>
      {children}
    </div>
  )
}

function Field({ label, defaultValue, type = "text", placeholder }: {
  label: string; defaultValue: string; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">{label}</label>
      <input type={type} defaultValue={defaultValue} placeholder={placeholder}
        className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
    </div>
  )
}

function ToggleRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
      <div onClick={() => setOn(o => !o)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${on ? "bg-primary" : "bg-gray-200"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </div>
    </div>
  )
}

function SaveButton({ section, saved, onClick }: { section: string; saved: string | null; onClick: () => void }) {
  const active = saved === section
  return (
    <button onClick={onClick} className={`mt-5 h-9 px-5 rounded-xl text-sm font-semibold transition-all ${active ? "bg-success/10 text-success" : "bg-primary text-white hover:bg-primary/90 active:scale-[0.97]"}`}>
      {active ? "✓ Saved!" : "Save Changes"}
    </button>
  )
}
