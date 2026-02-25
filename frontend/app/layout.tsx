import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EVE Frontier × Sui — Fleet Analytics Dashboard',
  description: 'On-chain fleet analytics for EVE Frontier using Sui blockchain. Track wallet assets, fleet composition, and transaction history.',
  keywords: ['EVE Frontier', 'Sui', 'blockchain', 'fleet analytics', 'NFT', 'gaming'],
  openGraph: {
    title: 'EVE Frontier × Sui Fleet Analytics',
    description: 'On-chain fleet analytics dashboard for EVE Frontier',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-eve-dark min-h-screen grid-bg">
        {children}
      </body>
    </html>
  )
}
