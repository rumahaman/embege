import Image from "next/image"
import { ReservationTriggerButton } from "./reservation-trigger-button"
import { MobileNav } from "./mobile-nav"

const navLinks = [
  { href: "#lokasi-acara", label: "Lokasi Acara" },
  { href: "#tentang-acara", label: "Tentang Acara" },
  { href: "#setor-sajak", label: "$etor $ajak" },
  { href: "#kontak", label: "Kontak" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-[#97B4C1]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <Image
            src="/images/logo-bgn.jpg"
            alt="Logo Badan Gigs Nasional"
            width={36}
            height={36}
            className="size-9 rounded-full border border-[#2F3E46]/20 object-cover"
          />
          <span className="font-hand text-sm leading-tight text-[#2F3E46] sm:text-base">
            Badan Gigs
            <br className="sm:hidden" /> Nasional
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigasi utama">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-sm text-[#2F3E46]/80 transition-colors hover:text-[#2F3E46]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <ReservationTriggerButton>Reservasi Kehadiran</ReservationTriggerButton>
        </div>

        <MobileNav />
      </div>
    </header>
  )
}
