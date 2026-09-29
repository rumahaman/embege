import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Caveat, Inter, Kalam, Patrick_Hand } from "next/font/google"
import "./globals.css"

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["500", "600", "700"],
})

const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-kalam",
  weight: ["400", "700"],
})

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  variable: "--font-patrick-hand",
  weight: ["400"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const siteUrl = "https://www.manggungbergizigratis.id"
const GA_MEASUREMENT_ID = "G-GTXD2C2Y22"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Manggung Bergizi Gratis",
    template: "%s — Manggung Bergizi Gratis",
  },

  description:
    "Manggung Bergizi Gratis oleh Badan Gigs Nasional bersama Aldy Amis. Pertunjukan intim musik dan sajak di Tangerang, Cirebon, Yogyakarta, dan Malang, Oktober 2026.",

  alternates: {
    canonical: siteUrl,
  },

  keywords: [
    "Manggung Bergizi Gratis",
    "Badan Gigs Nasional",
    "Aldy Amis",
    "musik dan sajak",
    "pertunjukan musik",
    "acara musik Tangerang",
    "acara musik Cirebon",
    "acara musik Yogyakarta",
    "acara musik Malang",
  ],

  openGraph: {
    title: "Manggung Bergizi Gratis — Badan Gigs Nasional",
    description:
      "Empat kota, satu perjalanan. Musik dan sajak bersama Aldy Amis di Tangerang, Cirebon, Yogyakarta, dan Malang.",
    url: siteUrl,
    siteName: "Manggung Bergizi Gratis",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/amis-stage-red.jpg",
        width: 900,
        height: 600,
        type: "image/jpeg",
        alt: "Manggung Bergizi Gratis — Badan Gigs Nasional",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Manggung Bergizi Gratis — Badan Gigs Nasional",
    description:
      "Empat kota, satu perjalanan. Musik dan sajak bersama Aldy Amis.",
    images: ["/images/amis-stage-red.jpg"],
  },

  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#97B4C1",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${caveat.variable} ${kalam.variable} ${patrickHand.variable} ${inter.variable}`}
    >
      <body className="font-body antialiased">
        {children}


        {process.env.NODE_ENV === "production" && <Analytics />}

        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />

        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}