import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Caveat, Inter, Kalam, Patrick_Hand } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['500', '600', '700'],
})

const kalam = Kalam({
  subsets: ['latin'],
  variable: '--font-kalam',
  weight: ['400', '700'],
})

const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  variable: '--font-patrick-hand',
  weight: ['400'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const siteUrl = 'https://manggungbergizigratis.id'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Manggung Bergizi Gratis',
    template: '%s — Manggung Bergizi Gratis',
  },
  description:
    'Manggung Bergizi Gratis adalah perjalanan lintas kota yang mempertemukan musik, sajak, buku, dan ruang temu dalam suasana yang hangat dan intim.',
  keywords: [
    'Manggung Bergizi Gratis',
    'Aldy Amis',
    'Badan Gigs Nasional',
    'Setor Sajak',
    'acara musik intim',
    'komunitas sastra',
  ],
  generator: 'v0.app',
  openGraph: {
    title: 'Manggung Bergizi Gratis',
    description:
      'Empat kota, satu perjalanan. Musik, sajak, dan perjumpaan manusia. Masuk dengan sajak, pulang dengan cerita.',
    url: siteUrl,
    siteName: 'Manggung Bergizi Gratis',
    locale: 'id_ID',
    type: 'website',
    images: ['/images/amis-hero.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manggung Bergizi Gratis',
    description:
      'Empat kota, satu perjalanan. Musik, sajak, dan perjumpaan manusia. Masuk dengan sajak, pulang dengan cerita.',
    images: ['/images/amis-hero.jpg'],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#97B4C1',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${caveat.variable} ${kalam.variable} ${patrickHand.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
