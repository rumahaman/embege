import Image from "next/image"
import { DoodleStar } from "./doodles"
import { ReservationTriggerButton } from "./reservation-trigger-button"

export function CtaBannerSection() {
  return (
    <section className="relative overflow-hidden bg-[#2F3E46] py-16 text-white sm:py-20">
      <DoodleStar className="absolute left-[10%] top-8 size-5" />
      <DoodleStar className="absolute right-[14%] bottom-10 size-4 opacity-70" />
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <div className="relative w-full max-w-[420px] -rotate-1 overflow-hidden rounded-md border-4 border-white/20 shadow-2xl">
          <Image
            src="/images/amis-stage-red.jpg"
            alt="Aldy Amis bernyanyi memegang gitar dengan pencahayaan merah dramatis"
            width={900}
            height={600}
            className="h-auto w-full object-cover"
          />
        </div>
        <p className="font-heading text-4xl text-[#F6EB35] sm:text-5xl">
          Perjalanan masih panjang...
        </p>
        <p className="max-w-lg font-body text-base text-white/75">
Musik dan pertemuan manusia adalah cara kita tetap percaya pada kehidupan. Datang, bawa satu sajak, dan jadi bagian dari perjalanan ini.
        </p>
        <ReservationTriggerButton className="shadow-[3px_3px_0_0_rgba(255,255,255,0.3)]" />
      </div>
    </section>
  )
}
