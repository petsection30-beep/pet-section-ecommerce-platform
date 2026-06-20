"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import brand from "@/config/brand.config"

// Builds a wa.me link from a stored number or full URL. Pakistani local numbers
// (leading 0) are converted to international form (92…) so wa.me works.
function waLink(raw: string): string {
  const v = raw.trim()
  if (v.startsWith("http")) return v
  let digits = v.replace(/[^0-9]/g, "")
  if (digits.startsWith("0")) digits = "92" + digits.slice(1)
  return `https://wa.me/${digits}`
}

export default function WhatsAppButton() {
  const pathname = usePathname()
  const [number, setNumber] = useState(brand.socialLinks.whatsapp ?? "")

  // Pull the live, admin-editable WhatsApp number (same source as the footer).
  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => { const w = d.settings?.socialLinks?.whatsapp; if (w) setNumber(w) })
      .catch(() => {})
  }, [])

  // Don't show on admin or auth screens — storefront only.
  const hidden =
    pathname.startsWith("/admin") ||
    ["/login", "/register", "/forgot-password", "/reset-password"].some(p => pathname.startsWith(p))

  if (hidden || !number) return null

  return (
    <a
      href={waLink(number)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 h-12 sm:h-14 px-3.5 sm:px-4 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 hover:bg-[#1ebe5b] hover:shadow-xl active:scale-95 transition-all duration-200 group"
    >
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-60 animate-ping -z-10" aria-hidden />
      <svg className="size-7 sm:size-8 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.515 5.26l-.999 3.648 3.973-1.039zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/>
      </svg>
      <span className="hidden sm:inline pr-1 font-semibold text-sm">Chat with us</span>
    </a>
  )
}
