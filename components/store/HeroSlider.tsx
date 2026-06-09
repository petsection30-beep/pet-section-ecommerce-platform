"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

const SLIDES = [
  {
    id: 1,
    badge:      "Pakistan's #1 Pet Store",
    headline:   "Everything Your\nPet Deserves",
    highlight:  "Pet Deserves",
    sub:        "Premium food, toys, grooming & accessories for dogs, cats, birds, fish and more — delivered to your door.",
    cta1:       { label: "Shop Now",          href: "/products"   },
    cta2:       { label: "Browse Categories", href: "/categories" },
    bg:         "from-[#1E3A5F] via-[#162d4a] to-[#0f1f35]",
    blob1:      "bg-orange-500/15",
    blob2:      "bg-orange-400/8",
    accent:     "text-orange-400",
    badgeBg:    "bg-orange-500/20 border-orange-500/30 text-orange-400",
    emojis:     [
      { e: "🐕", cls: "top-[12%] left-[8%]  text-5xl opacity-20  rotate-12   hidden sm:block" },
      { e: "🐈", cls: "top-[20%] right-[6%] text-6xl opacity-10  -rotate-6   hidden sm:block" },
      { e: "🐠", cls: "bottom-[18%] left-[12%] text-4xl opacity-15  rotate-3  hidden md:block" },
      { e: "🦜", cls: "bottom-[12%] right-[10%] text-3xl opacity-20 -rotate-12 hidden md:block" },
    ],
  },
  {
    id: 2,
    badge:      "🔥 Limited Time Offer",
    headline:   "Summer Sale —\nUp to 40% Off!",
    highlight:  "Up to 40% Off!",
    sub:        "Stock up on your pet's favourite food & treats before the deals run out. Shop hundreds of discounted items today.",
    cta1:       { label: "Shop the Sale",  href: "/products"           },
    cta2:       { label: "View All Deals", href: "/products?sort=price-asc" },
    bg:         "from-[#7c2d12] via-[#9a3412] to-[#c2410c]",
    blob1:      "bg-yellow-400/20",
    blob2:      "bg-red-400/10",
    accent:     "text-yellow-300",
    badgeBg:    "bg-yellow-400/20 border-yellow-400/30 text-yellow-300",
    emojis:     [
      { e: "☀️", cls: "top-[10%] left-[6%]   text-5xl opacity-25  rotate-12  hidden sm:block" },
      { e: "🦴", cls: "top-[22%] right-[7%]  text-4xl opacity-20  -rotate-6  hidden sm:block" },
      { e: "🐾", cls: "bottom-[20%] left-[10%] text-3xl opacity-20 rotate-12  hidden md:block" },
      { e: "🎁", cls: "bottom-[14%] right-[8%] text-4xl opacity-20 -rotate-6  hidden md:block" },
    ],
  },
  {
    id: 3,
    badge:      "✨ Just Landed",
    headline:   "Fresh Products\nJust Arrived",
    highlight:  "Just Arrived",
    sub:        "Explore our newest collection — premium nutrition, interactive toys, and stylish accessories your pet will love.",
    cta1:       { label: "Shop New Arrivals", href: "/products"             },
    cta2:       { label: "Explore All",       href: "/categories"           },
    bg:         "from-[#1e3a5f] via-[#1d4e6a] to-[#155e75]",
    blob1:      "bg-cyan-400/15",
    blob2:      "bg-teal-400/10",
    accent:     "text-cyan-300",
    badgeBg:    "bg-cyan-400/20 border-cyan-400/30 text-cyan-300",
    emojis:     [
      { e: "🐟", cls: "top-[14%] left-[7%]    text-5xl opacity-20  rotate-6   hidden sm:block" },
      { e: "🧶", cls: "top-[18%] right-[8%]   text-5xl opacity-15  -rotate-12 hidden sm:block" },
      { e: "🐠", cls: "bottom-[16%] left-[11%] text-4xl opacity-20  rotate-3   hidden md:block" },
      { e: "🐾", cls: "bottom-[10%] right-[9%] text-3xl opacity-15 -rotate-6  hidden md:block" },
    ],
  },
  {
    id: 4,
    badge:      "🚚 Free Delivery",
    headline:   "Free Delivery on\nOrders ₨2,000+",
    highlight:  "Orders ₨2,000+",
    sub:        "No minimum fuss — just shop your pet's essentials and we'll deliver right to your doorstep, anywhere in Pakistan.",
    cta1:       { label: "Order Now",    href: "/products"   },
    cta2:       { label: "Learn More",   href: "/categories" },
    bg:         "from-[#14532d] via-[#166534] to-[#15803d]",
    blob1:      "bg-green-300/15",
    blob2:      "bg-emerald-400/10",
    accent:     "text-green-300",
    badgeBg:    "bg-green-400/20 border-green-400/30 text-green-300",
    emojis:     [
      { e: "🚀", cls: "top-[12%] left-[6%]    text-5xl opacity-20  rotate-12  hidden sm:block" },
      { e: "📦", cls: "top-[20%] right-[6%]   text-5xl opacity-15  -rotate-6  hidden sm:block" },
      { e: "🐕", cls: "bottom-[20%] left-[10%] text-4xl opacity-20  rotate-3   hidden md:block" },
      { e: "🐾", cls: "bottom-[12%] right-[9%] text-3xl opacity-20 -rotate-12 hidden md:block" },
    ],
  },
]

const STATS = [
  { value: "500+",  label: "Products"        },
  { value: "10K+",  label: "Happy Customers" },
  { value: "4.9★",  label: "Average Rating"  },
  { value: "COD",   label: "Cash on Delivery"},
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)
  const [animDir, setAnimDir] = useState<"next" | "prev">("next")

  const go = useCallback((idx: number, dir: "next" | "prev" = "next") => {
    setAnimDir(dir)
    setCurrent((idx + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => go(current + 1, "next"), 5000)
    return () => clearInterval(t)
  }, [current, paused, go])

  const slide = SLIDES[current]

  return (
    <section
      className="relative min-h-[88vh] flex flex-col overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 bg-gradient-to-br ${s.bg} transition-all duration-700 ease-in-out ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={i !== current}
        />
      ))}

      {/* Blobs — per slide */}
      <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full ${slide.blob1} blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none z-10 transition-all duration-700`} />
      <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full ${slide.blob2} blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none z-10 transition-all duration-700`} />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Floating emojis */}
      {slide.emojis.map((em, i) => (
        <span key={i} className={`absolute ${em.cls} z-10 select-none pointer-events-none transition-all duration-700`}>{em.e}</span>
      ))}

      {/* Content */}
      <div className="relative z-20 flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-20 w-full">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 ${slide.badgeBg} border rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide mb-8 transition-all duration-500`}>
              <span className={`size-1.5 rounded-full ${slide.accent.replace("text-", "bg-")} animate-pulse inline-block`} />
              {slide.badge}
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-5 transition-all duration-500 whitespace-pre-line">
              {slide.headline.split("\n").map((line, i) =>
                line.includes(slide.highlight) ? (
                  <span key={i} className={`${slide.accent} block`}>{line}</span>
                ) : (
                  <span key={i} className="block">{line}</span>
                )
              )}
            </h1>

            {/* Sub */}
            <p className="text-white/65 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-10 transition-all duration-500">
              {slide.sub}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={slide.cta1.href}
                className={`inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-primary text-white font-semibold text-sm transition-all duration-150 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97]`}
              >
                {slide.cta1.label}
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link
                href={slide.cta2.href}
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl border border-white/25 text-white font-medium text-sm transition-all duration-150 hover:bg-white/10 hover:border-white/40 active:scale-[0.97]"
              >
                {slide.cta2.label}
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
        </div>

        {/* Navigation bar */}
        <div className="relative z-20 pb-7 flex items-center justify-center gap-5">
          {/* Prev */}
          <button
            onClick={() => go(current - 1, "prev")}
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all active:scale-90"
            aria-label="Previous slide"
          >
            <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > current ? "next" : "prev")}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-7 h-2.5 bg-white"
                    : "w-2.5 h-2.5 bg-white/35 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => go(current + 1, "next")}
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all active:scale-90"
            aria-label="Next slide"
          >
            <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          <div
            key={`${current}-${paused}`}
            className={`h-full bg-primary origin-left ${!paused ? "animate-progress" : ""}`}
            style={{ width: paused ? "0%" : undefined }}
          />
        </div>
      </div>

      {/* Prev / Next side arrows (desktop) */}
      <button
        onClick={() => go(current - 1, "prev")}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 size-11 rounded-full bg-black/20 hover:bg-black/35 border border-white/15 hidden lg:flex items-center justify-center transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button
        onClick={() => go(current + 1, "next")}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 size-11 rounded-full bg-black/20 hover:bg-black/35 border border-white/15 hidden lg:flex items-center justify-center transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </section>
  )
}
