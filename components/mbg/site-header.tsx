"use client"

import Image from "next/image"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ReservationTriggerButton } from "./reservation-trigger-button"

const navLinks = [
  { href: "#lokasi-acara", label: "Lokasi Acara" },
  { href: "#tentang-acara", label: "Tentang Acara" },
  { href: "#setor-sajak", label: "$etor $ajak" },
  { href: "#kontak", label: "Kontak" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

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

        <nav className="hidden items-center gap-6 md:flex">
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

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-[#2F3E46] hover:bg-white/30 md:hidden"
                aria-label="Buka menu navigasi"
              >
                <Menu className="size-5" />
              </Button>
            }
          />
          <SheetContent side="right" className="bg-[#EDF2F5]">
            <SheetHeader>
              <SheetTitle className="font-heading text-3xl text-[#2F3E46]">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 px-4">
              {navLinks.map((link) => (
                <SheetClose
                  key={link.href}
                  render={
                    <a
                      href={link.href}
                      className="font-body text-base text-[#2F3E46]/80 hover:text-[#2F3E46]"
                    >
                      {link.label}
                    </a>
                  }
                />
              ))}
              <SheetClose
                render={<ReservationTriggerButton className="mt-2 w-full" />}
              />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
