"use client"

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

export function MobileNav() {
  return (
    <Sheet>
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
  )
}
