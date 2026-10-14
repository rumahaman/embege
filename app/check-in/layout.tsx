import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Check-in Petugas",
  description: "Panel operasional petugas Manggung Bergizi Gratis.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: "https://www.manggungbergizigratis.id/check-in",
  },
}

export default function CheckInLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
