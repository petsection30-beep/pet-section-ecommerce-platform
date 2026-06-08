import Link from "next/link"
import brand from "@/config/brand.config"

const STATS = [
  { value: "500+",  label: "Products" },
  { value: "10K+",  label: "Happy Customers" },
  { value: "4.9★",  label: "Average Rating" },
  { value: "COD",   label: "Cash on Delivery" },
]

export default function HeroBanner() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-secondary">
      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Floating pet emojis */}
      <span className="absolute top-[12%] left-[8%]  text-5xl opacity-20 rotate-12  select-none pointer-events-none hidden sm:block">🐕</span>
      <span className="absolute top-[20%] right-[6%] text-6xl opacity-10 -rotate-6  select-none pointer-events-none hidden sm:block">🐈</span>
      <span className="absolute bottom-[18%] left-[12%] text-4xl opacity-15 rotate-3  select-none pointer-events-none hidden md:block">🐠</span>
      <span className="absolute bottom-[12%] right-[10%] text-3xl opacity-20 -rotate-12 select-none pointer-events-none hidden md:block">🦜</span>
      <span className="absolute top-[45%] left-[3%]   text-2xl opacity-15 rotate-45  select-none pointer-events-none hidden lg:block">🐾</span>
      <span className="absolute top-[50%] right-[3%]  text-2xl opacity-15 -rotate-12 select-none pointer-events-none hidden lg:block">🐾</span>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-20">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide mb-8">
          <span className="size-1.5 rounded-full bg-primary animate-pulse inline-block" />
          Pakistan's #1 Pet Store
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-5">
          {brand.storeName} —{" "}
          <span className="relative">
            <span className="text-primary">{brand.storeTagline}</span>
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-white/65 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-10">
          Premium food, toys, grooming &amp; accessories for dogs, cats, birds, fish and more — delivered to your door.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-primary text-white font-semibold text-sm transition-all duration-150 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97]"
          >
            Shop Now
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center h-12 px-8 rounded-xl border border-white/25 text-white font-medium text-sm transition-all duration-150 hover:bg-white/10 hover:border-white/40 active:scale-[0.97]"
          >
            Browse Categories
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-14 pt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-xs text-white/45 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
