"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function signOut() {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={signOut}
      disabled={loading}
      className={className ?? "text-sm font-medium text-danger hover:text-danger/80 transition-colors disabled:opacity-60"}
    >
      {loading ? "Signing out…" : "Sign Out"}
    </button>
  )
}
