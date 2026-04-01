import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" })
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "Zalaegerszegi Nordmann fenyők",
  description: "Nordmann fenyők Zalaegerszeg közelében. Családias hangulat, egységes ár, nyugodt hétvégi látogatás és előre megjelölt fa.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu">
      <body className={`${manrope.variable} ${cormorant.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
