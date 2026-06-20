"use client"

import { useEffect, useState } from "react"
import AdminSidebar from "@/components/admin/Sidebar"
import brand from "@/config/brand.config"

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  // Each sidebar link/button calls onClose, so navigation already closes the
  // drawer. Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar — static on desktop, slide-in drawer on mobile */}
      <AdminSidebar open={open} onClose={() => setOpen(false)} />

      {/* Overlay behind the drawer (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar with hamburger */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center gap-3 h-14 px-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
          <span className="font-bold text-gray-900 truncate">{brand.storeName}</span>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Admin</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
