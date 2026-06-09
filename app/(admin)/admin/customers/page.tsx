import brand from "@/config/brand.config"

const CUSTOMERS = [
  { id: 1, name: "Muhammad Ali",   email: "mali@email.com",   phone: "+92 312 345 6789", orders: 8,  total: 24600, joined: "2025-03-12", status: "Active"   },
  { id: 2, name: "Sara Khan",      email: "sara@email.com",   phone: "+92 321 987 6543", orders: 5,  total: 11200, joined: "2025-07-04", status: "Active"   },
  { id: 3, name: "Usman Tariq",    email: "usman@email.com",  phone: "+92 333 456 7890", orders: 12, total: 38900, joined: "2024-11-20", status: "Active"   },
  { id: 4, name: "Fatima Raza",    email: "fatima@email.com", phone: "+92 300 111 2233", orders: 2,  total: 2750,  joined: "2026-01-08", status: "Active"   },
  { id: 5, name: "Ahmed Sheikh",   email: "ahmed@email.com",  phone: "+92 345 678 9012", orders: 7,  total: 19500, joined: "2025-05-22", status: "Active"   },
  { id: 6, name: "Nadia Hussain",  email: "nadia@email.com",  phone: "+92 311 222 3344", orders: 3,  total: 6300,  joined: "2025-12-01", status: "Inactive" },
  { id: 7, name: "Bilal Chaudhry",email: "bilal@email.com",  phone: "+92 323 445 5678", orders: 15, total: 52000, joined: "2024-08-15", status: "Active"   },
  { id: 8, name: "Ayesha Malik",   email: "ayesha@email.com", phone: "+92 302 334 4556", orders: 4,  total: 8900,  joined: "2026-02-17", status: "Active"   },
]

export default function CustomersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{CUSTOMERS.length} registered customers</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input placeholder="Search customers..." className="h-9 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all flex-1 min-w-48" />
        <select className="h-9 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {["Customer", "Phone", "Orders", "Total Spent", "Joined", "Status", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CUSTOMERS.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-bold text-secondary shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 leading-tight">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{c.phone}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{c.orders}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{brand.currencySymbol} {c.total.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{c.joined}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.status === "Active" ? "bg-success/10 text-success" : "bg-gray-100 text-gray-500"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/30 text-sm text-gray-500">
          Showing {CUSTOMERS.length} customers
        </div>
      </div>
    </div>
  )
}
