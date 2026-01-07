import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
