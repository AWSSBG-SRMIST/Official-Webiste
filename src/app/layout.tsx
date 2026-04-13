import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'AWSCC-SRMIST',
    template: '%s | AWSCC-SRMIST',
  },
  description: 'Official student community for cloud builders at SRM Institute of Science and Technology. Workshops, events, and AWS learning.',
  icons: {
    icon: '/logo.ico',
    shortcut: '/logo.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
