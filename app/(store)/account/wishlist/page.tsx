import Breadcrumb from "@/components/ui/Breadcrumb"
import ProductCard from "@/components/store/ProductCard"
import { ALL_PRODUCTS } from "@/lib/mock-data"

const WISHLIST_IDS = ["p5", "p9", "p14", "p15"]

export default function WishlistPage() {
  const wishlistProducts = ALL_PRODUCTS.filter(p => WISHLIST_IDS.includes(p.id))

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account", href: "/account" }, { label: "Wishlist" }]} />
        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500">{wishlistProducts.length} items</p>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {wishlistProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="text-6xl">❤️</span>
            <p className="mt-5 text-lg font-bold text-gray-700">Your wishlist is empty</p>
            <p className="text-gray-500 text-sm mt-2">Tap the heart icon on any product to save it here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
