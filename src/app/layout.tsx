import {Inter} from 'next/font/google'
import type {Metadata} from 'next'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'Modulr Resource Centre',
    template: '%s · Modulr Resource Centre',
  },
  description: 'Modulr case studies and customer stories.',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased font-sans text-slate-900">{children}</body>
    </html>
  )
}
