import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { TRPCProvider } from "@/lib/trpc/provider"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Campaign Manager",
  description: "Manage your marketing campaigns and influencer partnerships",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <TRPCProvider>{children}</TRPCProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
