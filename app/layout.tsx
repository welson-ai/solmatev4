import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Solmate - Intelligent Yield Optimization on Avalanche',
  description: 'Solmate uses advanced AI to monitor and optimize your DeFi positions on Avalanche in real-time.',
    icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <meta name="talentapp:project_verification" content="a1eddc008e5871428bf63b833758be9caf661dc0a69cadb95685095ee892f6d8b7aee409e68b0e630472cce73172f51691b862d0819f67b28b1b452a967794fb" />
      </head>
      <body className={`${inter.className} font-sans antialiased bg-background text-foreground`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
