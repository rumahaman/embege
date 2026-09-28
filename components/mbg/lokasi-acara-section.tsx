import Image from "next/image"
import { BusFront, MapPin, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { venues } from "@/lib/venues"
import { ReservationTriggerButton } from "./reservation-trigger-button"
import { DoodleStar } from "./doodles"

export function LokasiAcaraSection() {
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
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#2F3E46]/10 bg-white/40 p-3 shadow-sm">
              <Image
                src="/images/mbg-van.jpg"
                alt="Ilustrasi van Badan Gigs Nasional dalam perjalanan MBG"
                width={700}
                height={440}
                className="w-full rounded-xl object-contain"
              />
            </div>
          </div>
        </div>

        {/* Route Illustration */}
        <div
          className="mt-12 rounded-2xl border border-[#2F3E46]/10 bg-white/45 px-5 py-8 shadow-sm sm:mt-14 sm:px-8 sm:py-10"
          aria-label="Ilustrasi rute perjalanan Manggung Bergizi Gratis dari Kabupaten Tangerang ke Cirebon, Yogyakarta, dan Malang"
        >
          {/* Desktop route */}
          <div className="relative hidden px-4 py-6 md:block">
            <svg
              viewBox="0 0 1200 220"
              className="pointer-events-none absolute inset-x-0 top-2 h-44 w-full"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <path
                d="M110 116 C205 165 290 165 385 114 S555 64 660 112 S815 164 910 111 S1050 75 1095 113"
                fill="none"
                stroke="#2F3E46"
                strokeWidth="3"
                strokeDasharray="9 11"
                strokeLinecap="round"
                opacity="0.35"
              />
            </svg>

            <div className="relative z-10 grid grid-cols-4 gap-6">
              {venues.map((venue, index) => (
                <div
                  key={venue.id}
                  className={
                    index % 2 === 0
                      ? "flex translate-y-3 flex-col items-center text-center"
                      : "flex -translate-y-3 flex-col items-center text-center"
                  }
                >
                  <div className="flex size-[76px] items-center justify-center rounded-full border-2 border-[#2F3E46]/80 bg-[#F6EB35] shadow-[6px_6px_0_rgba(47,62,70,0.18)] transition-transform duration-200 hover:-translate-y-1">
                    <BusFront
                      className="size-8 text-[#2F3E46]"
                      strokeWidth={1.8}
                    />
                  </div>

                  <span className="mt-4 font-heading text-2xl leading-none text-[#2F3E46]">
                    {venue.city}
                  </span>

                  <span className="mt-1 font-body text-sm text-[#2F3E46]/60">
                    {venue.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile route */}
          <div className="relative md:hidden">
            <div
              className="absolute bottom-8 left-7 top-8 border-l-2 border-dashed border-[#2F3E46]/30"
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-7">
              {venues.map((venue) => (
                <div
                  key={venue.id}
                  className="relative flex items-center gap-4"
                >
                  <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-[#2F3E46]/80 bg-[#F6EB35] shadow-[4px_4px_0_rgba(47,62,70,0.16)]">
                    <BusFront
                      className="size-6 text-[#2F3E46]"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div>
                    <p className="font-heading text-2xl leading-none text-[#2F3E46]">
                      {venue.city}
                    </p>
                    <p className="mt-1 font-body text-sm text-[#2F3E46]/60">
                      {venue.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Venue Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {venues.map((venue) => (
            <article
              key={venue.id}
              className="flex flex-col overflow-hidden rounded-lg border border-[#2F3E46]/10 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative">
                <Image
                  src={venue.image || "/placeholder.svg"}
                  alt={"Fasad " + venue.name + " di " + venue.city}
                  width={480}
                  height={320}
                  className="h-40 w-full object-cover"
                />

                <Badge className="absolute left-3 top-3 bg-[#F6EB35] font-hand text-sm text-[#2F3E46]">
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
          ))}
        </div>
      </div>
    </section>
  )
}
