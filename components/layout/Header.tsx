"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useCartStore } from "@/store/cartStore"
import brand from "@/config/brand.config"

const NAV_LINKS = [
  { label: "Home",       href: "/" },
  { label: "Products",   href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "About",      href: "/about" },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [storeName, setStoreName]   = useState(brand.storeName)
  const totalItems = useCartStore((s) => s.totalItems())

  // Reflect the admin-editable store name from settings.
  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => { if (d.settings?.storeName) setStoreName(d.settings.storeName) })
      .catch(() => {})
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo + brand name */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={brand.logoUrl}
              alt={storeName}
              width={40}
              height={40}
              className="size-9 sm:size-10 rounded-full object-cover ring-1 ring-gray-100 shrink-0"
              priority
            />
            <span className="font-bold text-lg sm:text-xl text-secondary tracking-tight leading-none">
              {storeName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-primary hover:bg-page transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-1">
            <Link
              href="/search"
              className="hidden sm:flex p-2 rounded-xl text-gray-500 hover:text-primary hover:bg-page transition-colors duration-150"
              aria-label="Search"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </Link>

            <Link
              href="/account"
              className="p-2 rounded-xl text-gray-500 hover:text-primary hover:bg-page transition-colors duration-150"
              aria-label="My account"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            <Link
              href="/cart"
              className="relative p-2 rounded-xl text-gray-500 hover:text-primary hover:bg-page transition-colors duration-150"
              aria-label="Shopping cart"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" x2="21" y1="6" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-xl text-gray-500 hover:text-primary hover:bg-page transition-colors duration-150"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              ) : (
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <line x1="4" x2="20" y1="6" y2="6"/>
                  <line x1="4" x2="20" y1="12" y2="12"/>
                  <line x1="4" x2="20" y1="18" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-gray-100 py-3 space-y-0.5" aria-label="Mobile navigation">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-primary hover:bg-page transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
