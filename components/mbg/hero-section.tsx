import Image from "next/image"
import { ReservationTriggerButton } from "./reservation-trigger-button"
import { DoodleArrow, DoodleStar } from "./doodles"

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#97B4C1] pb-16 pt-6 sm:pb-24 sm:pt-8"
    >
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[#97B4C1]" />

        <div className="absolute inset-0 opacity-[0.08]">
          <div className="mbg-paper h-full w-full" />
        </div>
      </div>

      {/* Aldy Amis */}
      <div
        className="pointer-events-none absolute bottom-0 right-[-5%] z-[1] w-[58%] sm:right-[-3%] sm:w-[50%] md:right-[3%] md:w-[45%] lg:right-[10%] lg:w-[42%] xl:right-[12%] xl:w-[39%]"
        aria-hidden="true"
      >
        <Image
          src="/images/amis-hero.png"
          alt=""
          width={1216}
          height={753}
          priority
          sizes="(min-width: 1280px) 39vw, (min-width: 1024px) 42vw, (min-width: 768px) 45vw, (min-width: 640px) 50vw, 58vw"
          className="h-auto w-full opacity-[0.85] drop-shadow-[0_14px_18px_rgba(47,62,70,0.14)] sm:drop-shadow-[0_16px_22px_rgba(47,62,70,0.15)] lg:drop-shadow-[0_20px_26px_rgba(47,62,70,0.16)]"
        />
      </div>

      {/* Decorative elements */}
      <DoodleStar className="absolute left-[8%] top-[18%] z-10 size-5 sm:left-[12%]" />

      <DoodleStar className="absolute right-[10%] top-[28%] z-10 size-4 opacity-70" />

      <DoodleArrow className="absolute left-[4%] top-[55%] z-10 hidden -rotate-6 sm:block" />

      {/* Main Hero Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-body text-sm text-[#2F3E46]/70">
            Dipersembahkan oleh{" "}
            <span className="font-hand">
              Badan Gigs Nasional
            </span>
          </p>

          <h1 className="mt-5 font-heading text-6xl leading-[0.95] text-[#F6EB35] drop-shadow-sm sm:text-7xl md:text-8xl">
            Manggung
            <br />
            Bergizi Gratis
          </h1>

          <p className="mt-5 font-kalam text-xl text-[#2F3E46] sm:text-2xl">
            Intimate Show-nya Aldy Amis
          </p>

          <p className="mt-4 max-w-md font-body text-base leading-relaxed text-[#2F3E46]/80">
            Empat kota, empat ruang temu. Musik, sajak, dan percakapan dalam
            suasana yang intim — membawa cerita, merayakan perjumpaan
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ReservationTriggerButton className="h-11 px-6 text-base shadow-[3px_3px_0_0_#2F3E46]" />

            <a
              href="#lokasi-acara"
              className="font-hand text-base text-[#2F3E46] underline decoration-[#2F3E46]/40 decoration-2 underline-offset-4 hover:decoration-[#2F3E46]"
            >
              Lihat Lokasi Acara
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}