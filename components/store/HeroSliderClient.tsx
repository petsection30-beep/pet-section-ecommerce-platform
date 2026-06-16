"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { getHeroTheme } from "@/lib/hero-themes"

export type HeroSlideData = {
  id: string
  badge: string
  headline: string
  highlight: string
  subtitle: string
  cta1Label: string
  cta1Href: string
  cta2Label: string
  cta2Href: string
  theme: string
}

const STATS = [
  { value: "500+", label: "Products" },
  { value: "10K+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
  { value: "COD",  label: "Cash on Delivery" },
]

export default function HeroSliderClient({ slides }: { slides: HeroSlideData[] }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused]   = useState(false)

  const go = useCallback((idx: number) => {
    setCurrent((idx + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (paused || slides.length <= 1) return
    const t = setInterval(() => go(current + 1), 5000)
    return () => clearInterval(t)
  }, [current, paused, go, slides.length])

  if (slides.length === 0) return null

  const slide = slides[Math.min(current, slides.length - 1)]
  const theme = getHeroTheme(slide.theme)

  return (
    <section
      className="relative min-h-[88vh] flex flex-col overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide backgrounds */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 bg-gradient-to-br ${getHeroTheme(s.theme).bg} transition-all duration-700 ease-in-out ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          aria-hidden={i !== current}
        />
      ))}

      {/* Blobs */}
      <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full ${theme.blob1} blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none z-10 transition-all duration-700`} />
      <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full ${theme.blob2} blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none z-10 transition-all duration-700`} />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Floating emojis */}
      {theme.emojis.map((em, i) => (
        <span key={i} className={`absolute ${em.cls} z-10 select-none pointer-events-none transition-all duration-700`}>{em.e}</span>
      ))}

      {/* Content */}
      <div className="relative z-20 flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-20 w-full">
            <div className={`inline-flex items-center gap-2 ${theme.badgeBg} border rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide mb-8 transition-all duration-500`}>
              <span className={`size-1.5 rounded-full ${theme.accent.replace("text-", "bg-")} animate-pulse inline-block`} />
              {slide.badge}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-5 transition-all duration-500 whitespace-pre-line">
              {slide.headline.split("\n").map((line, i) =>
                slide.highlight && line.includes(slide.highlight) ? (
                  <span key={i} className={`${theme.accent} block`}>{line}</span>
                ) : (
                  <span key={i} className="block">{line}</span>
                )
              )}
            </h1>

            <p className="text-white/65 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-10 transition-all duration-500">
              {slide.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={slide.cta1Href || "/products"} className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-primary text-white font-semibold text-sm transition-all duration-150 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97]">
                {slide.cta1Label}
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              {slide.cta2Label && (
                <Link href={slide.cta2Href || "/categories"} className="inline-flex items-center justify-center h-12 px-8 rounded-xl border border-white/25 text-white font-medium text-sm transition-all duration-150 hover:bg-white/10 hover:border-white/40 active:scale-[0.97]">
                  {slide.cta2Label}
                </Link>
              )}
            </div>

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

        {/* Navigation */}
        {slides.length > 1 && (
          <div className="relative z-20 pb-7 flex items-center justify-center gap-5">
            <button onClick={() => go(current - 1)} className="size-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all active:scale-90" aria-label="Previous slide">
              <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button key={i} onClick={() => go(i)} className={`rounded-full transition-all duration-300 ${i === current ? "w-7 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/35 hover:bg-white/60"}`} aria-label={`Go to slide ${i + 1}`} />
              ))}
            </div>
            <button onClick={() => go(current + 1)} className="size-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all active:scale-90" aria-label="Next slide">
              <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          <div key={`${current}-${paused}`} className={`h-full bg-primary origin-left ${!paused && slides.length > 1 ? "animate-progress" : ""}`} style={{ width: paused ? "0%" : undefined }} />
        </div>
      </div>

      {/* Side arrows (desktop) */}
      {slides.length > 1 && (
        <>
          <button onClick={() => go(current - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 size-11 rounded-full bg-black/20 hover:bg-black/35 border border-white/15 hidden lg:flex items-center justify-center transition-all hover:scale-105 active:scale-95 backdrop-blur-sm" aria-label="Previous slide">
            <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={() => go(current + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 size-11 rounded-full bg-black/20 hover:bg-black/35 border border-white/15 hidden lg:flex items-center justify-center transition-all hover:scale-105 active:scale-95 backdrop-blur-sm" aria-label="Next slide">
            <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </>
      )}
    </section>
  )
}
