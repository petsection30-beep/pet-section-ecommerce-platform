import Link from "next/link"
import brand from "@/config/brand.config"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-page flex flex-col">
      <div className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-secondary">
          <span className="text-2xl leading-none">🐾</span>
          <span>{brand.storeName}</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </div>
    </div>
  )
}
