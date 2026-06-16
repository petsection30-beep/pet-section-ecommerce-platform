import Link from "next/link"
import { redirect } from "next/navigation"
import Breadcrumb from "@/components/ui/Breadcrumb"
import brand from "@/config/brand.config"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/session"
import SignOutButton from "@/components/account/SignOutButton"
import { statusLabel, statusBadge, type OrderStatus } from "@/lib/order-status"

const QUICK_LINKS = [
  { label: "Order History",    href: "/account/orders",    emoji: "📋", desc: "View and track your past orders" },
  { label: "Saved Addresses",  href: "/account/addresses", emoji: "📍", desc: "Manage your delivery addresses" },
  { label: "Wishlist",         href: "/account/wishlist",  emoji: "❤️",  desc: "Items you've saved for later" },
  { label: "Continue Shopping",href: "/products",          emoji: "🛍️", desc: "Browse the full catalog" },
]

export default async function AccountPage() {
  const session = await requireAuth()
  if (!session) redirect("/login?next=/account")

  const [orderCount, wishlistCount, addressCount, user, recentOrders] = await Promise.all([
    prisma.order.count({ where: { userId: session.userId } }),
    prisma.wishlistItem.count({ where: { userId: session.userId } }),
    prisma.address.count({ where: { userId: session.userId } }),
    prisma.user.findUnique({ where: { id: session.userId }, select: { createdAt: true } }),
    prisma.order.findMany({
      where:   { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take:    3,
      include: { items: { select: { qty: true } } },
    }),
  ])

  const memberSince = user
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : ""
  const firstName = session.name.split(" ")[0]

  const stats = [
    { label: "Total Orders",    value: String(orderCount),    emoji: "🛍️" },
    { label: "Wishlist Items",  value: String(wishlistCount), emoji: "❤️" },
    { label: "Saved Addresses", value: String(addressCount),  emoji: "📍" },
  ]

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account" }]} />

        {/* Greeting */}
        <div className="mt-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl select-none">👤</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Welcome back, {firstName}!</h1>
            {memberSince && <p className="text-sm text-gray-500">Member since {memberSince}</p>}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {stats.map(stat => (
            <div key={stat.label} className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {QUICK_LINKS.map(link => (
            <Link key={link.href} href={link.href} className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
              <span className="text-3xl leading-none block mb-3 group-hover:scale-110 transition-transform duration-200">{link.emoji}</span>
              <p className="font-semibold text-sm text-gray-900">{link.label}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">{link.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link href="/account/orders" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">View all</Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <span className="text-4xl">📦</span>
              <p className="mt-3 font-semibold text-gray-700">No orders yet</p>
              <p className="text-sm text-gray-500 mt-1">When you place an order, it&apos;ll show up here.</p>
              <Link href="/products" className="inline-flex mt-4 h-10 px-5 items-center rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Start Shopping</Link>
            </div>
          ) : (
            <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      {["Order #", "Date", "Items", "Total", "Status", ""].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map(o => {
                      const itemCount = o.items.reduce((s, i) => s + i.qty, 0)
                      return (
                        <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3.5 font-mono font-semibold text-gray-900">{o.id.slice(0, 8).toUpperCase()}</td>
                          <td className="px-5 py-3.5 text-gray-500">{new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                          <td className="px-5 py-3.5 text-gray-700">{itemCount} {itemCount === 1 ? "item" : "items"}</td>
                          <td className="px-5 py-3.5 font-semibold text-gray-900">{brand.currencySymbol} {o.total.toLocaleString()}</td>
                          <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(o.status as OrderStatus)}`}>{statusLabel(o.status as OrderStatus)}</span></td>
                          <td className="px-5 py-3.5">
                            <Link href={`/orders/${o.id}`} className="text-primary hover:text-primary/80 font-medium text-xs transition-colors">Track →</Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sign out */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}
