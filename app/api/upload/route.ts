import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/session"

const MAX_SIZE = 500 * 1024 // 500 KB after compression

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const form = await req.formData()
    const file = form.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()

    if (bytes.byteLength > MAX_SIZE) {
      return NextResponse.json(
        { error: `Image too large. Max size is ${MAX_SIZE / 1024} KB` },
        { status: 400 }
      )
    }

    const base64 = Buffer.from(bytes).toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    return NextResponse.json({ url: dataUrl })
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
