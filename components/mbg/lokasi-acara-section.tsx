"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { BusFront, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { venues } from "@/lib/venues"
import { ReservationTriggerButton } from "./reservation-trigger-button"
import { DoodleStar } from "./doodles"
import type {
  VenueQuota,
  QuotaResponse,
} from "@/types/quota"

export function LokasiAcaraSection() {
  const [quotas, setQuotas] = useState<VenueQuota[]>([])
  const [loadingQuota, setLoadingQuota] = useState(true)
  const [quotaError, setQuotaError] = useState(false)

  useEffect(() => {
    async function loadQuota() {
      try {
        const response = await fetch("/api/kuota")

        const data: QuotaResponse =
          await response.json()

        if (data.success) {
          setQuotas(data.quotas)
        }
      } catch (error) {
        console.error(error)
        setQuotaError(true)
      } finally {
        setLoadingQuota(false)
      }
    }

    loadQuota()
  }, [])

  function getQuota(city: string) {
    return quotas.find(
      (item) => item.city === city
    )
  }

  return (
    <section
      id="lokasi-acara"
      className="relative bg-[#EDF2F5] py-16 sm:py-24"
    >
      <div className="mx-auto min-w-0 max-w-6xl px-4 sm:px-6">
        {/* Route Header + Van */}
<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-center lg:gap-8 xl:gap-10">
  {/* Route Header */}
  <div className="max-w-2xl">
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
      Empat kota, empat ruang — dari toko buku hingga ruang literasi
    </p>
  </div>

  {/* Van */}
  <div className="flex justify-center lg:justify-end">
    <div className="w-[min(88vw,360px)] sm:w-[min(72vw,380px)] lg:w-[min(34vw,420px)]">
      <Image
        src="/mbg-van-transparent.png"
        alt="Ilustrasi van Badan Gigs Nasional dalam perjalanan MBG"
        width={1216}
        height={753}
        sizes="(min-width: 1280px) 420px, (min-width: 1024px) 34vw, (min-width: 640px) 380px, 88vw"
        className="h-auto w-full object-contain"
      />
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
                const quota = getQuota(venue.city)

                const cityName =
                  venue.city === "Kabupaten Tangerang"
                    ? "Tangerang"
                    : venue.city

                return (
                  <div
                    key={venue.id}
                    data-venue-id={venue.id}
                    className={
                      "mbg-route-node flex flex-col items-center text-center " +
                      (index % 2 === 0
                        ? "translate-y-3"
                        : "-translate-y-3")
                    }
                  >
                    <div
                      className="mbg-route-node-icon flex size-[76px] items-center justify-center rounded-full border-2 border-[#2F3E46]/80 bg-[#A9C1CC] shadow-[6px_6px_0_rgba(47,62,70,0.18)] transition-all duration-300 ease-out"
                    >
                      <BusFront
                        className="size-8 text-[#2F3E46]"
                        strokeWidth={1.8}
                      />
                    </div>

                    <span
                      className={
                        "mbg-route-node-label mt-4 font-heading text-2xl leading-none text-[#2F3E46] transition-transform duration-300"
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
                const cityName =
                  venue.city === "Kabupaten Tangerang"
                    ? "Tangerang"
                    : venue.city

                return (
                  <div
                    key={venue.id}
                    data-venue-id={venue.id}
                    className="mbg-route-node relative flex items-center gap-4"
                  >
                    <div
                      className="mbg-route-node-icon relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-[#2F3E46]/80 bg-[#F6EB35] shadow-[4px_4px_0_rgba(47,62,70,0.16)] transition-transform duration-300"
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
            const quota = getQuota(venue.city)

            return (
              <article
                key={venue.id}
                data-venue-id={venue.id}
                className={
                  "mbg-venue-card group flex flex-col overflow-hidden rounded-lg border border-[#2F3E46]/10 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg " +
                  (index % 2 === 0
                    ? "lg:rotate-[-0.35deg]"
                    : "lg:rotate-[0.35deg]")
                }
              >
                <div className="group/image relative overflow-hidden">
                  <Image
                    src={venue.image || "/placeholder.svg"}
                    alt={
                      "Fasad " +
                      venue.name +
                      " di " +
                      venue.city
                    }
                    width={480}
                    height={320}
                    sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 100vw"
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

                    <div className="mt-2">
                      {!loadingQuota && quota && (
                        <p
                          className={
                            quota.status === "SOLD OUT"
                              ? "text-xs font-semibold text-[#B42318]"
                              : "text-xs font-semibold text-[#2F3E46]"
                          }
                        >
                          {quota.status === "SOLD OUT"
                            ? "PENUH"
                            : "TERSEDIA"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-2 pt-2">
                    <ReservationTriggerButton
                      city={venue.city}
                      className="w-full"
                      disabled={
                        quota?.status === "SOLD OUT"
                      }
                    >
                      {quota?.status === "SOLD OUT"
                        ? "PENUH"
                        : "Reservasi"}
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