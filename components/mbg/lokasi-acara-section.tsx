"use client"

import { useState } from "react"
import Image from "next/image"
import { BusFront, MapPin, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { venues } from "@/lib/venues"
import { ReservationTriggerButton } from "./reservation-trigger-button"
import { DoodleStar } from "./doodles"

export function LokasiAcaraSection() {
  const [activeVenue, setActiveVenue] = useState<string | null>(null)

  return (
    <section
      id="lokasi-acara"
      className="relative bg-[#EDF2F5] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header + Van */}
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <DoodleStar className="size-4" />

              <p className="font-body text-sm uppercase tracking-wide text-[#2F3E46]/60">
                Rute Perjalanan MBG
              </p>
            </div>

            <h2 className="font-heading text-5xl text-[#2F3E46] sm:text-6xl">
              Pilih Kota, Temui di Sana
            </h2>

            <p className="mt-3 max-w-xl font-body text-base leading-relaxed text-[#2F3E46]/70">
              Empat kota, empat ruang alternatif — dari toko buku hingga rumah
              budaya. Cerita berbeda, rasa yang sama: manusia yang tetap ingin
              bertemu.
            </p>
          </div>

          {/* Van */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-[360px] overflow-hidden rounded-md border-4 border-white/70 bg-[#A9C1CC] shadow-xl">
              <div className="mbg-van-frame relative aspect-[1216/753] overflow-hidden rounded-[2px] bg-[#A9C1CC]">
                <div
                  className="mbg-van-ground-shadow pointer-events-none absolute bottom-[5%] left-1/2 z-0 h-[10%] w-[68%] -translate-x-1/2 rounded-[50%]"
                  aria-hidden="true"
                />
                <Image
                  src="/mbg-van-transparent.png"
                  alt="Ilustrasi van Badan Gigs Nasional dalam perjalanan MBG"
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 360px, 100vw"
                  className="mbg-van-detached z-10 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Route Illustration */}
        <div
          className="relative mt-10 px-2 py-4 sm:mt-12 sm:px-4 sm:py-6"
          aria-label="Ilustrasi rute perjalanan Manggung Bergizi Gratis dari Kabupaten Tangerang ke Cirebon, Yogyakarta, dan Malang"
        >
          {/* Desktop route */}
          <div className="relative hidden min-h-[190px] px-2 md:block">
            <svg
              viewBox="0 0 1200 200"
              className="pointer-events-none absolute inset-x-0 top-1 h-40 w-full"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <path
                d="M105 102 C205 145 285 145 390 100 S565 58 675 100 S835 145 925 99 S1055 62 1095 102"
                fill="none"
                stroke="#2F3E46"
                strokeWidth="3"
                strokeDasharray="9 11"
                strokeLinecap="round"
                opacity="0.34"
              />
            </svg>

            <div className="relative z-10 grid grid-cols-4 gap-6">
              {venues.map((venue, index) => {
                const isActive = activeVenue === venue.id
                const cityName =
                  venue.city === "Kabupaten Tangerang"
                    ? "Tangerang"
                    : venue.city

                return (
                  <div
                    key={venue.id}
                    onMouseEnter={() => setActiveVenue(venue.id)}
                    onMouseLeave={() => setActiveVenue(null)}
                    className={
                      index % 2 === 0
                        ? "flex translate-y-3 flex-col items-center text-center"
                        : "flex -translate-y-3 flex-col items-center text-center"
                    }
                  >
                    <div
                      className={
                        "flex size-[76px] items-center justify-center rounded-full border-2 border-[#2F3E46]/80 bg-[#A9C1CC] shadow-[6px_6px_0_rgba(47,62,70,0.18)] transition-all duration-300 ease-out " +
                        (isActive
                          ? "scale-110 bg-[#F6EB35] shadow-[8px_8px_0_rgba(47,62,70,0.2)]"
                          : "scale-100")
                      }
                    >
                      <BusFront
                        className="size-8 text-[#2F3E46]"
                        strokeWidth={1.8}
                      />
                    </div>

                    <span
                      className={
                        "mt-4 font-heading text-2xl leading-none text-[#2F3E46] transition-transform duration-300 " +
                        (isActive ? "scale-105" : "scale-100")
                      }
                    >
                      {cityName}
                    </span>

                    <span className="mt-1 font-body text-sm text-[#2F3E46]/60">
                      {venue.date}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile route */}
          <div className="relative md:hidden">
            <div
              className="absolute bottom-8 left-7 top-8 border-l-2 border-dashed border-[#2F3E46]/30"
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-7">
              {venues.map((venue) => {
                const isActive = activeVenue === venue.id
                const cityName =
                  venue.city === "Kabupaten Tangerang"
                    ? "Tangerang"
                    : venue.city

                return (
                  <div
                    key={venue.id}
                    onMouseEnter={() => setActiveVenue(venue.id)}
                    onMouseLeave={() => setActiveVenue(null)}
                    className="relative flex items-center gap-4"
                  >
                    <div
                      className={
                        "relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-[#2F3E46]/80 bg-[#F6EB35] shadow-[4px_4px_0_rgba(47,62,70,0.16)] transition-transform duration-300 " +
                        (isActive ? "scale-105" : "scale-100")
                      }
                    >
                      <BusFront
                        className="size-6 text-[#2F3E46]"
                        strokeWidth={1.8}
                      />
                    </div>

                    <div>
                      <p className="font-heading text-2xl leading-none text-[#2F3E46]">
                        {cityName}
                      </p>
                      <p className="mt-1 font-body text-sm text-[#2F3E46]/60">
                        {venue.date}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Venue Cards */}
        <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {venues.map((venue, index) => {
            const isActive = activeVenue === venue.id

            return (
              <article
                key={venue.id}
                onMouseEnter={() => setActiveVenue(venue.id)}
                onMouseLeave={() => setActiveVenue(null)}
                className={
                  "group flex flex-col overflow-hidden rounded-lg border border-[#2F3E46]/10 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg " +
                  (index % 2 === 0 ? "lg:rotate-[-0.35deg]" : "lg:rotate-[0.35deg]") +
                  (isActive ? " ring-1 ring-[#F6EB35]/50" : "")
                }
              >
                <div className="group/image relative overflow-hidden">
                  <Image
                    src={venue.image || "/placeholder.svg"}
                    alt={"Fasad " + venue.name + " di " + venue.city}
                    width={480}
                    height={320}
                    sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 100vw"
                    height={320}
                    className="h-40 w-full object-cover transition-transform duration-500 ease-out group-hover/image:scale-105"
                  />

                  <Badge className="absolute left-3 top-3 border border-[#2F3E46]/15 bg-[#A9C1CC] font-hand text-sm text-[#2F3E46] shadow-[2px_2px_0_rgba(47,62,70,0.12)]">
                    {venue.dateShort}
                  </Badge>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <h3 className="font-hand text-lg leading-tight text-[#2F3E46]">
                      {venue.name}
                    </h3>

                    <p className="flex items-center gap-1 font-body text-sm text-[#2F3E46]/60">
                      <MapPin className="size-3.5" />
                      {venue.city}
                    </p>
                  </div>

                  <p className="flex items-center gap-1.5 font-body text-sm text-[#2F3E46]/70">
                    <Users className="size-3.5" />
                    Kuota {venue.quota} peserta
                  </p>

                  <div className="mt-auto flex flex-col gap-2 pt-2">
                    <ReservationTriggerButton
                      city={venue.city}
                      className="w-full"
                    >
                      Reservasi
                    </ReservationTriggerButton>

                    <a
                      href={venue.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 w-full items-center justify-center rounded-lg border border-[#2F3E46]/20 bg-transparent px-2.5 text-sm font-medium text-[#2F3E46] transition-colors hover:bg-[#2F3E46]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3E46]/30"
                    >
                      Lihat Lokasi
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
