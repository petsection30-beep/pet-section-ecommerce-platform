import Breadcrumb from "@/components/ui/Breadcrumb"
import ProductCard from "@/components/store/ProductCard"
import { ALL_PRODUCTS } from "@/lib/mock-data"

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams
  const query = q.trim().toLowerCase()

  const results = query
    ? ALL_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    : []

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

        <div className="mt-4 mb-8">
          {query ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Results for <span className="text-primary">"{q}"</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">{results.length} product{results.length !== 1 ? "s" : ""} found</p>
            </>
          ) : (
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Search Products</h1>
          )}
        </div>

        {query && results.length === 0 && (
          <div className="text-center py-24">
            <span className="text-6xl">🔍</span>
            <p className="mt-4 text-lg font-semibold text-gray-700">No results for "{q}"</p>
            <p className="text-gray-500 text-sm mt-1">Try different keywords or browse our categories</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {results.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {!query && (
          <div className="text-center py-24">
            <span className="text-6xl">🐾</span>
            <p className="mt-4 text-lg font-semibold text-gray-700">What are you looking for?</p>
            <p className="text-gray-500 text-sm mt-1">Use the search bar in the header to find products</p>
          </div>
        )}
      </div>
    </div>
  )
}
