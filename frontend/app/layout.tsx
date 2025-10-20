import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oríkì - Ancestral Intelligence Network',
  description: 'Preserving cultural wisdom through AI',
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
