import Image from "next/image"
import { venues } from "@/lib/venues"
import { ReservationTriggerButton } from "./reservation-trigger-button"
import { DoodleArrow, DoodleStar } from "./doodles"

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#97B4C1] pb-16 pt-14 sm:pb-24 sm:pt-16"
    >
      <DoodleStar className="absolute left-[8%] top-[18%] size-5 sm:left-[12%]" />
      <DoodleStar className="absolute right-[10%] top-[65%] size-4 opacity-70" />
      <DoodleArrow className="absolute left-[4%] top-[55%] hidden -rotate-6 sm:block" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-6">
        <div className="relative z-10 flex flex-col items-start gap-5">
          <p className="font-body text-sm text-[#2F3E46]/70">
            Dipersembahkan oleh <span className="font-hand">Badan Gigs Nasional</span>
          </p>

          <h1 className="font-heading text-6xl leading-[0.95] text-[#F6EB35] drop-shadow-sm sm:text-7xl md:text-8xl">
            Manggung
            <br />
            Bergizi Gratis
          </h1>

          <p className="font-kalam text-xl text-[#2F3E46] sm:text-2xl">
            Intimate Show-nya Aldy Amis
          </p>

          <p className="max-w-md font-body text-base leading-relaxed text-[#2F3E46]/80">
            Empat kota, satu ruang temu. Musik, sajak, dan percakapan dalam suasana yang intim —
            bergerak dari kota ke kota, membawa cerita yang sama: kita masih percaya pada
            perjumpaan.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <ReservationTriggerButton className="h-11 px-6 text-base shadow-[3px_3px_0_0_#2F3E46]" />
            <a
              href="#lokasi-acara"
              className="font-hand text-base text-[#2F3E46] underline decoration-[#2F3E46]/40 decoration-2 underline-offset-4 hover:decoration-[#2F3E46]"
            >
              Lihat Lokasi Acara
            </a>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative w-full max-w-[320px] rotate-1 overflow-hidden rounded-md border-4 border-white/70 shadow-xl sm:max-w-[360px]">
            <div className="h-full w-full overflow-hidden">
              <Image
                src="/images/amis-hero.jpg"
                alt="Aldy Amis merokok sambil melihat ke atas langit, mengenakan kacamata hitam dan kaus bertuliskan lirik lagu"
                width={800}
                height={1050}
                priority
                className="h-auto w-full object-cover mbg-hover-sway-x"
              />
            </div>
          </div>

          <div className="w-full max-w-[360px] rounded-md border border-[#2F3E46]/15 bg-white/70 px-4 py-3 font-body text-xs text-[#2F3E46]/70 sm:text-sm">
            <p className="mb-1 font-hand text-sm text-[#2F3E46] sm:text-base">Rute Perjalanan</p>
            <ol className="flex flex-wrap gap-x-2 gap-y-1">
              {venues.map((venue, index) => (
                <li key={venue.id} className="flex items-center gap-2">
                  <span>{venue.city}</span>
                  {index < venues.length - 1 && <span aria-hidden="true">→</span>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
