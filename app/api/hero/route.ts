import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// Public — active hero slides for the storefront, in display order.
export async function GET() {
  const slides = await prisma.heroSlide.findMany({
    where:   { isActive: true },
    orderBy: { order: "asc" },
  })
  return NextResponse.json({ slides })
}
