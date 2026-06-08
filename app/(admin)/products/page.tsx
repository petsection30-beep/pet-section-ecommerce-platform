import Link from "next/link"
import { ALL_PRODUCTS } from "@/lib/mock-data"
import brand from "@/config/brand.config"

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{ALL_PRODUCTS.length} total products</p>
        </div>
        <Link href="/admin/products/new" className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
          <span className="text-base leading-none">+</span> Add Product
        </Link>
      </div>

      {/* Search + filter row */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input placeholder="Search products..." className="h-9 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all flex-1 min-w-48" />
        <select className="h-9 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white">
          <option>All Categories</option>
          <option>Dog Food</option>
          <option>Cat Food</option>
          <option>Accessories</option>
        </select>
        <select className="h-9 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Out of Stock</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ALL_PRODUCTS.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-xl shrink-0`}>
                        {p.emoji}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 leading-tight">{p.name}</p>
                        <p className="text-xs text-gray-400">PP-{p.id.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs">{p.category}</td>
                  <td className="px-5 py-3.5">
                    <div>
                      <span className="font-semibold text-gray-900">{brand.currencySymbol} {p.price.toLocaleString()}</span>
                      {p.comparePrice && (
                        <span className="text-xs text-gray-400 line-through ml-1">{brand.currencySymbol} {p.comparePrice.toLocaleString()}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.inStock ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success">Active</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${p.id}/edit`} className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">Edit</Link>
                      <span className="text-gray-200">·</span>
                      <button className="text-xs font-medium text-danger hover:text-danger/80 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/30">
          <span>Showing {ALL_PRODUCTS.length} of {ALL_PRODUCTS.length} products</span>
          <div className="flex gap-1">
            {[1].map(p => (
              <button key={p} className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-semibold">{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
