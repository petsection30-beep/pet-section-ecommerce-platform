try { process.loadEnvFile(".env") } catch {}

import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

const pool    = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma  = new PrismaClient({ adapter })

async function main() {
  console.log("🧹 Cleaning up seeded products...")

  // Delete the 4 seeded products that were pre-marked as featured
  // Cascade deletes handle images, variants, reviews, and wishlist items
  const ids = ["p1", "p2", "p3", "p4"]
  for (const id of ids) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) { console.log(`  - Product ${id} not found, skipping`); continue }
    await prisma.product.delete({ where: { id } })
    console.log(`  ✗ Deleted product ${id}`)
  }

  // Ensure no other products are accidentally marked as featured
  const updated = await prisma.product.updateMany({ data: { isFeatured: false } })
  console.log(`  ✓ Reset featured flag on ${updated.count} remaining products`)

  console.log("🎉 Cleanup complete!")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
