import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import HeroBanner from "@/components/store/HeroBanner"
import CategoryGrid from "@/components/store/CategoryGrid"
import FeaturedProducts from "@/components/store/FeaturedProducts"
import PromoBanner from "@/components/store/PromoBanner"
import NewArrivals from "@/components/store/NewArrivals"
import TrustBadges from "@/components/store/TrustBadges"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <CategoryGrid />
        <FeaturedProducts />
        <PromoBanner />
        <NewArrivals />
        <TrustBadges />
      </main>
      <Footer />
    </div>
  )
}
