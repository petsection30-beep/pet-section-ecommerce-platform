import { NextResponse } from "next/server"
import { getSettings } from "@/lib/settings"

export const dynamic = "force-dynamic"

// Public, read-only merged settings — used by client components
// (e.g. checkout payment screen) that need store/payment info.
export async function GET() {
  const settings = await getSettings()
  return NextResponse.json({ settings })
}
