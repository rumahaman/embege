import Image from "next/image"
import { MapPin, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { venues } from "@/lib/venues"
import { ReservationTriggerButton } from "./reservation-trigger-button"
import { DoodleStar } from "./doodles"

export function LokasiAcaraSection() {
  return (
    <section id="lokasi-acara" className="relative bg-[#EDF2F5] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-3 flex items-center gap-2">
          <DoodleStar className="size-4" />
          <p className="font-body text-sm uppercase tracking-wide text-[#2F3E46]/60">
            Rute Perjalanan MBG
          </p>
        </div>
        <h2 className="font-heading text-5xl text-[#2F3E46] sm:text-6xl">Pilih Kota, Temui di Sana</h2>
        <p className="mt-3 max-w-xl font-body text-base text-[#2F3E46]/70">
          Empat kota, empat ruang alternatif — dari toko buku hingga rumah budaya. Cerita berbeda,
          rasa yang sama: manusia yang tetap ingin bertemu.
        </p>

        {/* route line */}
        <div className="mt-10 hidden items-center justify-between md:flex">
          {venues.map((venue, index) => (
            <div key={venue.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <span className="size-2.5 rounded-full bg-[#2F3E46]" />
                <span className="font-hand text-xs text-[#2F3E46]/70">{venue.city}</span>
              </div>
              {index < venues.length - 1 && <div className="mbg-dashed-route mx-2 flex-1" />}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {venues.map((venue) => (
            <article
              key={venue.id}
              className="flex flex-col overflow-hidden rounded-lg border border-[#2F3E46]/10 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative">
                <Image
                  src={venue.image || "/placeholder.svg"}
                  alt={`Fasad ${venue.name} di ${venue.city}`}
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
                  <h3 className="font-hand text-lg leading-tight text-[#2F3E46]">{venue.name}</h3>
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
                  <ReservationTriggerButton city={venue.city} className="w-full">
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
