"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import brand from "@/config/brand.config"

const NAV_ITEMS = [
  { label: "Dashboard",  href: "/admin/dashboard",  icon: "📊" },
  { label: "Products",   href: "/admin/products",   icon: "📦" },
  { label: "Orders",     href: "/admin/orders",     icon: "🛍️"  },
  { label: "Customers",  href: "/admin/customers",  icon: "👥" },
  { label: "Categories", href: "/admin/categories", icon: "🏷️"  },
  { label: "Settings",   href: "/admin/settings",   icon: "⚙️"  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 lg:w-60 bg-secondary text-white flex flex-col sticky top-0 h-screen shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-xl leading-none">🐾</span>
          <span>{brand.storeName}</span>
        </Link>
        <p className="text-white/40 text-xs mt-0.5 font-medium tracking-wide uppercase">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white transition-all duration-150"
        >
          <span className="text-base leading-none w-5 text-center">🏠</span>
          View Store
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white transition-all duration-150">
          <span className="text-base leading-none w-5 text-center">🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
