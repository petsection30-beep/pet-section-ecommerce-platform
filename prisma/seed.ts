// Load .env before anything accesses process.env (Node 20.6+ built-in)
try { process.loadEnvFile(".env") } catch {}

import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth/password"

const pool    = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma  = new PrismaClient({ adapter })

// Single store-wide category — all products live under "Accessories".
const CATEGORIES = [
  { name: "Accessories", slug: "accessories", emoji: "🛍️", description: "All products." },
]

// Unsplash photo URLs — w=600&h=600&fit=crop for square images
const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop&q=80`

const PRODUCTS = [
  { id: "p1",  slug: "royal-canin-adult-dog-food-3kg", name: "Royal Canin Adult Dog Food 3kg", category: "dog-food",         price: 3500, comparePrice: 4200, image: u("1568640347023-a616a30bc3bd"), featured: true,  stock: 40 },
  { id: "p2",  slug: "whiskas-tuna-cat-food-12-pack",  name: "Whiskas Tuna Cat Food — 12 Pack", category: "cat-food",         price: 1200, comparePrice: 1500, image: u("1514888286974-6c03e2ca1dba"), featured: true,  stock: 60 },
  { id: "p3",  slug: "premium-bird-seed-mix-2kg",      name: "Premium Bird Seed Mix 2kg",       category: "bird-food",        price: 850,  comparePrice: null, image: u("1552728089-57bdde30beb3"),  featured: true,  stock: 35 },
  { id: "p4",  slug: "aquarium-led-strip-light-60cm",  name: "Aquarium LED Strip Light 60cm",   category: "aquarium",         price: 2200, comparePrice: 2800, image: u("1535591273668-578e31182c4f"), featured: true,  stock: 25 },
  { id: "p5",  slug: "orthopedic-dog-bed-large",       name: "Orthopedic Dog Bed Large",        category: "dog-accessories",  price: 4500, comparePrice: null, image: u("1548199973-03cce0bbc87b"),  featured: false, stock: 18 },
  { id: "p6",  slug: "interactive-cat-toy-set",        name: "Interactive Cat Toy Set",         category: "cat-toys",         price: 890,  comparePrice: 1100, image: u("1574158622682-e40e69881006"), featured: false, stock: 50 },
  { id: "p7",  slug: "stainless-steel-pet-bowl-set",   name: "Stainless Steel Pet Bowl Set",    category: "accessories",      price: 450,  comparePrice: null, image: u("1601758228041-f3b2795255f1"), featured: false, stock: 80 },
  { id: "p8",  slug: "hamster-running-wheel-21cm",     name: "Hamster Running Wheel 21cm",      category: "small-pets",       price: 1200, comparePrice: 1500, image: u("1425082661705-1834bfd09dca"), featured: false, stock: 22 },
  { id: "p9",  slug: "cat-scratching-post-tower",      name: "Cat Scratching Post Tower",       category: "cat-accessories",  price: 3200, comparePrice: null, image: u("1478098711619-5ab0b478d6e6"), featured: false, stock: 15 },
  { id: "p10", slug: "parrot-cage-premium-xl",         name: "Parrot Cage Premium XL",          category: "bird-accessories", price: 8500, comparePrice: 9500, image: u("1544568100-847a948585b9"),  featured: false, stock: 0  },
  { id: "p11", slug: "dog-training-clicker-kit",       name: "Dog Training Clicker Kit",        category: "dog-training",     price: 750,  comparePrice: null, image: u("1587300003388-59208cc962cb"), featured: false, stock: 90 },
  { id: "p12", slug: "aquarium-canister-filter-pump",  name: "Aquarium Canister Filter Pump",   category: "aquarium",         price: 2800, comparePrice: 3200, image: u("1521651201144-634f700b36ef"), featured: false, stock: 30 },
  { id: "p13", slug: "dog-grooming-kit-8-piece",       name: "Dog Grooming Kit 8-Piece",        category: "grooming",         price: 1800, comparePrice: 2200, image: u("1516734212186-a967f81ad0d7"), featured: false, stock: 28 },
  { id: "p14", slug: "genuine-leather-dog-leash",      name: "Genuine Leather Dog Leash",       category: "dog-accessories",  price: 650,  comparePrice: null, image: u("1507146426996-ef05306b995a"), featured: false, stock: 120 },
  { id: "p15", slug: "soft-pet-carrier-bag",           name: "Soft Pet Carrier Bag",            category: "cat-accessories",  price: 2500, comparePrice: 3000, image: u("1592194996308-7b43878e84a6"), featured: false, stock: 33 },
  { id: "p16", slug: "tetra-fish-food-flakes-200g",    name: "Tetra Fish Food Flakes 200g",     category: "aquarium",         price: 480,  comparePrice: null, image: u("1522069169874-c58ec4b76be5"), featured: false, stock: 45 },
]

async function main() {
  console.log("🌱 Seeding database...")

  // ── Categories ──────────────────────────────────────────────
  const categoryIdBySlug: Record<string, string> = {}
  for (const cat of CATEGORIES) {
    const row = await prisma.category.upsert({
      where:  { slug: cat.slug },
      update: { name: cat.name, emoji: cat.emoji, description: cat.description },
      create: cat,
    })
    categoryIdBySlug[cat.slug] = row.id
  }
  console.log(`✅ ${CATEGORIES.length} categories upserted`)

  // ── Products (with one image + a default variant for stock) ──
  // Everything lives under the single "accessories" category.
  for (const p of PRODUCTS) {
    const categoryId = categoryIdBySlug["accessories"]
    if (!categoryId) throw new Error(`Missing "accessories" category`)

    await prisma.product.upsert({
      where:  { id: p.id },
      update: {
        slug: p.slug, name: p.name, price: p.price,
        comparePrice: p.comparePrice, categoryId, isFeatured: p.featured, isActive: true,
        description: `Premium ${p.name} — trusted quality for your pet, available now at a great price.`,
      },
      create: {
        id: p.id, slug: p.slug, name: p.name, price: p.price,
        comparePrice: p.comparePrice, categoryId, isFeatured: p.featured, isActive: true,
        description: `Premium ${p.name} — trusted quality for your pet, available now at a great price.`,
      },
    })

    // Reset image + variant so re-seeding stays idempotent
    await prisma.productImage.deleteMany({ where: { productId: p.id } })
    await prisma.productImage.create({
      data: { productId: p.id, url: p.image, altText: p.name, order: 0 },
    })

    await prisma.productVariant.deleteMany({ where: { productId: p.id } })
    await prisma.productVariant.create({
      data: { productId: p.id, name: "Default", value: "Standard", stock: p.stock },
    })
  }
  console.log(`✅ ${PRODUCTS.length} products upserted`)

  // ── Admin user ──────────────────────────────────────────────
  // ── Hero slides (only seed if none exist, so admin edits aren't clobbered) ──
  const heroCount = await prisma.heroSlide.count()
  if (heroCount === 0) {
    await prisma.heroSlide.createMany({
      data: [
        { order: 0, theme: "navy",   badge: "Pakistan's #1 Pet Store", headline: "Everything Your\nPet Deserves", highlight: "Pet Deserves", subtitle: "Premium food, toys, grooming & accessories for dogs, cats, birds, fish and more — delivered to your door.", cta1Label: "Shop Now", cta1Href: "/products", cta2Label: "Browse Categories", cta2Href: "/categories" },
        { order: 1, theme: "orange", badge: "🔥 Limited Time Offer", headline: "Summer Sale —\nUp to 40% Off!", highlight: "Up to 40% Off!", subtitle: "Stock up on your pet's favourite food & treats before the deals run out. Shop hundreds of discounted items today.", cta1Label: "Shop the Sale", cta1Href: "/products", cta2Label: "View All Deals", cta2Href: "/products?sort=price-asc" },
        { order: 2, theme: "cyan",   badge: "✨ Just Landed", headline: "Fresh Products\nJust Arrived", highlight: "Just Arrived", subtitle: "Explore our newest collection — premium nutrition, interactive toys, and stylish accessories your pet will love.", cta1Label: "Shop New Arrivals", cta1Href: "/products", cta2Label: "Explore All", cta2Href: "/categories" },
        { order: 3, theme: "green",  badge: "🚚 Free Delivery", headline: "Free Delivery on\nOrders ₨2,000+", highlight: "Orders ₨2,000+", subtitle: "No minimum fuss — just shop your pet's essentials and we'll deliver right to your doorstep, anywhere in Pakistan.", cta1Label: "Order Now", cta1Href: "/products", cta2Label: "Learn More", cta2Href: "/categories" },
      ],
    })
    console.log("✅ 4 hero slides seeded")
  } else {
    console.log(`ℹ️  ${heroCount} hero slides already exist — skipped`)
  }

  // ── Site settings (singleton row, seeded from brand defaults if absent) ──
  await prisma.siteSetting.upsert({
    where:  { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      storeName: "Pet Section", storeTagline: "Everything Your Pet Deserves",
      storeDescription: "Pakistan's #1 online pet store — dogs, cats, birds & more.",
      contactEmail: "hello@petsection.pk", contactPhone: "+92 300 0000000",
      address: "Islamabad, Pakistan",
      instagram: "https://instagram.com/petsection", facebook: "https://facebook.com/petsection",
      whatsapp: "+923103270033",
      codEnabled: true,
      easypaisaEnabled: true, easypaisaTitle: "Pet Section", easypaisaNumber: "03103270033",
      nayapayEnabled: true,   nayapayTitle: "Pet Section",   nayapayNumber: "03103270033",
      bankTransferEnabled: true, bankName: "Bank AL Habib", bankAccountTitle: "Pet Section",
      bankAccountNumber: "00170095009687016", bankIban: "",
      deliveryFee: 200, freeDeliveryEnabled: true, freeDeliveryThreshold: 2000,
    },
  })
  console.log("✅ Site settings ensured")

  const adminEmail    = process.env.ADMIN_EMAIL    ?? "admin@petsection.pk"
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345"
  const adminName     = process.env.ADMIN_NAME     ?? "Admin"

  const passwordHash = await hashPassword(adminPassword)

  await prisma.user.upsert({
    where:  { email: adminEmail },
    update: { passwordHash, name: adminName },
    create: { name: adminName, email: adminEmail, passwordHash, role: "ADMIN" },
  })
  console.log(`✅ Admin user upserted: ${adminEmail}`)

  console.log("🎉 Seed complete!")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
