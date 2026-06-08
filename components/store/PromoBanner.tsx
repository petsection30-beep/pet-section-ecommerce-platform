import Link from "next/link"

export default function PromoBanner() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary to-secondary/90 p-8 sm:p-10 lg:p-12">

          {/* Decorative blobs */}
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-primary/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <span className="absolute top-4 right-6 text-6xl opacity-10 select-none pointer-events-none">🐾</span>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-primary/20 border border-primary/30 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Limited Time Offer
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                Get 20% Off Your<br className="hidden sm:block" /> First Order
              </h2>
              <p className="text-white/65 text-sm leading-relaxed max-w-md">
                New to PawsPoint? Use code{" "}
                <span className="bg-primary/20 border border-primary/30 text-primary font-mono font-bold px-2 py-0.5 rounded-md text-sm">
                  WELCOME20
                </span>{" "}
                at checkout and spoil your pet today.
              </p>
            </div>

            <Link
              href="/products"
              className="flex-shrink-0 inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-primary text-white font-semibold text-sm transition-all duration-150 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97] whitespace-nowrap"
            >
              Shop Now
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
