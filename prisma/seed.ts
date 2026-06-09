// Load .env before anything accesses process.env (Node 20.6+ built-in)
try { process.loadEnvFile(".env") } catch {}

import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth/password"

const pool    = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma  = new PrismaClient({ adapter })

const CATEGORIES = [
  { name: "Dog Food",         slug: "dog-food",         emoji: "🐕", description: "Premium nutrition for dogs of all breeds and ages." },
  { name: "Cat Food",         slug: "cat-food",         emoji: "🐈", description: "Delicious and nutritious meals for your feline friends." },
  { name: "Bird Food",        slug: "bird-food",        emoji: "🦜", description: "Seed mixes and pellets for parrots, finches, and more." },
  { name: "Dog Accessories",  slug: "dog-accessories",  emoji: "🦴", description: "Collars, leashes, bowls, beds, and toys for dogs." },
  { name: "Cat Accessories",  slug: "cat-accessories",  emoji: "🧶", description: "Scratching posts, litter trays, toys and beds for cats." },
  { name: "Bird Accessories", slug: "bird-accessories", emoji: "🪺", description: "Cages, perches, swings, and accessories for pet birds." },
  { name: "Aquarium",         slug: "aquarium",         emoji: "🐠", description: "Fish tanks, filters, gravel, and aquarium décor." },
  { name: "Small Pets",       slug: "small-pets",       emoji: "🐹", description: "Supplies for hamsters, rabbits, guinea pigs, and more." },
]

async function main() {
  console.log("🌱 Seeding database...")

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where:  { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log(`✅ ${CATEGORIES.length} categories upserted`)

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
