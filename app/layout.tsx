import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Zalaegerszegi Nordmann Fenyők - Karácsonyfák",
  description:
    "Nordmann karácsonyfák Zalaegerszeg határában. Családias hangulat, barátoknak és ismerősöknek, beszélgetéssel – nem futószalagon.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png",  media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg",             type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu" className={plusJakarta.variable}>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <Navigation />
        {/* pt-16 compensates for the fixed nav (h-16) so content on all pages isn't hidden underneath it */}
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
