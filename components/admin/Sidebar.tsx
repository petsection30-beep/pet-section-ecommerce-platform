"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import brand from "@/config/brand.config"

const NAV_ITEMS = [
  { label: "Dashboard",    href: "/admin/dashboard",    icon: "📊" },
  { label: "Products",     href: "/admin/products",     icon: "📦" },
  { label: "Best Sellers", href: "/admin/best-sellers", icon: "⭐" },
  { label: "Orders",       href: "/admin/orders",       icon: "🛍️"  },
  { label: "Customers",    href: "/admin/customers",    icon: "👥" },
  { label: "Categories",   href: "/admin/categories",   icon: "🏷️"  },
  { label: "Homepage",     href: "/admin/hero",         icon: "🖼️"  },
  { label: "Settings",     href: "/admin/settings",     icon: "⚙️"  },
]

export default function AdminSidebar({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const router   = useRouter()

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {})
    router.push("/login")
    router.refresh()
  }

  return (
    <aside
      className={`fixed lg:sticky top-0 z-40 h-screen w-64 lg:w-60 shrink-0 bg-secondary text-white flex flex-col transition-transform duration-200 ease-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between gap-2">
        <Link href="/admin/dashboard" onClick={onClose} className="flex items-center gap-2 font-bold text-lg min-w-0">
          <span className="text-xl leading-none">🐾</span>
          <span className="truncate">{brand.storeName}</span>
        </Link>
        {/* Close button (mobile only) */}
        <button onClick={onClose} aria-label="Close menu" className="lg:hidden p-1.5 -mr-1.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base leading-none w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer actions */}
      <div className="p-3 border-t border-white/10 space-y-0.5">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white transition-all duration-150"
        >
          <span className="text-base leading-none w-5 text-center">🏠</span>
          View Store
        </Link>
        <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white transition-all duration-150">
          <span className="text-base leading-none w-5 text-center">🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
