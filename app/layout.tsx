import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import brand from "@/config/brand.config"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: `${brand.storeName} — ${brand.storeTagline}`,
  description: brand.storeDescription,
  keywords: brand.metaKeywords,
  openGraph: {
    siteName: brand.storeName,
    description: brand.storeDescription,
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <style>{`
          :root {
            --brand-primary:   ${brand.primaryColor};
            --brand-secondary: ${brand.secondaryColor};
            --brand-accent:    ${brand.accentColor};
            --brand-page:      ${brand.backgroundColor};
            --brand-surface:   ${brand.surfaceColor};
            --brand-muted:     ${brand.mutedColor};
          }
        `}</style>
      </head>
      <body className="min-h-screen bg-page font-sans text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
