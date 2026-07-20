import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import brand from "@/config/brand.config"

export const metadata: Metadata = {
  title: `About Us — ${brand.storeName}`,
  description: `Learn about ${brand.storeName} — Pakistan's trusted online pet store. Our story, mission, and commitment to your pets.`,
}

const STATS = [
  { value: "5,000+", label: "Happy Customers" },
  { value: "500+",   label: "Products" },
  { value: "50+",    label: "Cities Served" },
  { value: "4.8★",   label: "Average Rating" },
]

const VALUES = [
  {
    emoji: "🐾",
    title: "Pet-First Always",
    desc: "Every product we stock is vetted for safety, nutrition, and quality. If we wouldn't give it to our own pets, it doesn't make the shelf.",
  },
  {
    emoji: "🚚",
    title: "Fast Nationwide Delivery",
    desc: "We ship across Pakistan — from Karachi to Gilgit. Orders placed before 3 PM are dispatched the same day.",
  },
  {
    emoji: "💳",
    title: "Flexible Payments",
    desc: "Pay on delivery, or use EasyPaisa, NayaPay and bank transfer. No hidden charges — the price you see is the price you pay.",
  },
  {
    emoji: "↩️",
    title: "Hassle-Free Returns",
    desc: "Not satisfied? Return within 7 days, no questions asked. Your peace of mind matters as much as your pet's.",
  },
  {
    emoji: "🎓",
    title: "Expert Guidance",
    desc: "Our team includes trained vets and experienced pet owners who can help you pick the right food, toys, and accessories.",
  },
  {
    emoji: "🌿",
    title: "Responsible Sourcing",
    desc: "We partner with trusted local and international brands committed to ethical manufacturing and animal welfare.",
  },
]

const TEAM = [
  { name: "Ali Hassan",    role: "Founder & CEO",        emoji: "👨‍💼", bg: "from-orange-50 to-orange-100" },
  { name: "Sara Khan",     role: "Head of Operations",   emoji: "👩‍💼", bg: "from-purple-50 to-purple-100" },
  { name: "Dr. Usman Mir", role: "Veterinary Advisor",   emoji: "👨‍⚕️", bg: "from-green-50 to-green-100"  },
  { name: "Fatima Raza",   role: "Customer Experience",  emoji: "👩‍💻", bg: "from-blue-50 to-blue-100"    },
]

export default function AboutPage() {
  return (
    <div className="bg-page">

      {/* Hero */}
      <section className="relative bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none text-[200px] flex items-center justify-center">
          🐾
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-5">
            Pakistan&apos;s Home for<br className="hidden sm:block" /> Happy, Healthy Pets
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            {brand.storeName} started with a simple belief — every pet deserves the best care,
            and every owner deserves a store they can trust.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-bold">{s.value}</p>
                <p className="text-white/80 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Image / visual */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center overflow-hidden">
                <Image
                  src={brand.logoUrl}
                  alt={brand.storeName}
                  width={320}
                  height={240}
                  className="object-contain w-64 h-auto drop-shadow-xl"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-surface rounded-2xl shadow-lg px-5 py-3 border border-gray-100">
                <p className="text-2xl font-bold text-secondary">2021</p>
                <p className="text-xs text-gray-500 font-medium">Est. Islamabad</p>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-5">
              <p className="text-primary text-xs font-semibold uppercase tracking-widest">Who We Are</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                Born from a love of animals, built for Pakistani pet owners
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {brand.storeName} was founded in Islamabad in 2021 by a group of pet owners tired of
                overpriced imports, unreliable delivery, and a lack of genuine pet-care expertise in
                local stores.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We set out to create something different — a store where quality products, honest
                pricing, and real pet knowledge come together. Today we serve customers across 50+
                cities, carrying everything from daily nutrition to specialist accessories.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our team includes veterinary advisors, experienced breeders, and passionate pet
                parents. When you shop with us, you&apos;re not just getting a product — you&apos;re getting
                the backing of people who genuinely care.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Shop Now
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-surface border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Why Choose Us</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What sets us apart</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="bg-page rounded-2xl p-6 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-200">
                <span className="text-3xl leading-none block mb-4">{v.emoji}</span>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">The People Behind It</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Meet our team</h2>
            <p className="mt-3 text-gray-500 text-sm max-w-xl mx-auto">
              A small but passionate group united by one thing — a genuine love for animals and the people who care for them.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {TEAM.map(m => (
              <div key={m.name} className="text-center">
                <div className={`aspect-square rounded-2xl bg-gradient-to-br ${m.bg} flex items-center justify-center text-5xl mb-3`}>
                  {m.emoji}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission banner */}
      <section className="bg-gradient-to-br from-secondary to-secondary/80 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-5xl block mb-5">🐾</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-white/75 text-lg leading-relaxed">
            To make quality pet care accessible to every family in Pakistan — because every pet,
            regardless of breed or budget, deserves to live a happy, healthy life.
          </p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get in touch</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Have a question about a product, need advice for your pet, or want to partner with us?
                We&apos;d love to hear from you.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-base shrink-0">✉️</span>
                  <a href={`mailto:${brand.contactEmail}`} className="hover:text-primary transition-colors">{brand.contactEmail}</a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-base shrink-0">📞</span>
                  <a href={`tel:${brand.contactPhone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">{brand.contactPhone}</a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-base shrink-0">📍</span>
                  <span>{brand.address}</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Browse Products
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6"/></svg>
              </Link>
              {brand.socialLinks.instagram && (
                <a
                  href={brand.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary/50 hover:text-primary transition-colors"
                >
                  Follow on Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
