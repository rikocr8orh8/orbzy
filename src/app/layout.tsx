import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Providers from '@/components/Providers'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Orbzy - Home Maintenance Scheduler',
  description: 'Never miss home maintenance again. Schedule, track, and book local service providers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="termly-consent"
          strategy="beforeInteractive"
          src="https://app.termly.io/resource-blocker/2abbe41f-1ebf-4a4a-a61d-3ca45cea30cd?autoBlock=on"
        />
      </head>
      <body>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
