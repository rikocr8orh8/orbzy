import type { Metadata } from 'next'
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
      <body>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
