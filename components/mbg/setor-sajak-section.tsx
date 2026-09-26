import Image from "next/image"
import { Check, X, FileText } from "lucide-react"
import { DoodleStar } from "./doodles"
import { ReservationTriggerButton } from "./reservation-trigger-button"

const yangDibawa = ["Tulisan tangan", "Cetakan kertas", "Catatan di buku", "Hasil print"]

const tidakWajib = ["Membacakan sajak di depan umum", "Menjelaskan isi sajak", "Membawa karya sendiri"]

export function SetorSajakSection() {
  return (
    <section id="setor-sajak" className="relative overflow-hidden bg-[#EDF2F5] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="relative order-2 hidden justify-self-center lg:order-1 lg:flex">
            <div className="relative w-full max-w-sm rotate-2 overflow-hidden rounded-md border-4 border-white shadow-xl">
              <Image
                src="/images/amis-crowd.jpg"
                alt="Aldy Amis tampil di depan kerumunan penonton yang duduk dekat dengan panggung"
                width={700}
                height={500}
                className="h-auto w-full object-cover"
              />
            </div>
            <DoodleStar className="absolute -right-3 -top-3 size-6" />
          </div>

          <div className="order-1 flex flex-col gap-4 lg:order-2">
            <p className="font-hand text-2xl text-[#2F3E46]/70 sm:text-3xl">$etor $ajak</p>
            <h2 className="font-heading text-5xl text-[#2F3E46] sm:text-6xl">
              HTM Acara Ini Ditukar dengan Satu Sajak
            </h2>
            <p className="max-w-xl font-body text-base leading-relaxed text-[#2F3E46]/80">
              Manggung Bergizi Gratis tidak menggunakan tiket masuk berbayar. Sebagai bentuk
              partisipasi, setiap peserta cukup membawa satu sajak saat hadir di lokasi acara —
              boleh karya sendiri, boleh karya orang lain yang punya makna bagimu.
            </p>

            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-[#2F3E46]/10 bg-white p-4">
                <p className="mb-3 flex items-center gap-2 font-hand text-lg text-[#2F3E46]">
                  <FileText className="size-4" />
                  Yang Perlu Dibawa
                </p>
                <ul className="flex flex-col gap-2 font-body text-sm text-[#2F3E46]/80">
                  {yangDibawa.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-[#2F3E46]/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-[#2F3E46]/10 bg-white p-4">
                <p className="mb-3 font-hand text-lg text-[#2F3E46]">Tidak Wajib</p>
                <ul className="flex flex-col gap-2 font-body text-sm text-[#2F3E46]/80">
                  {tidakWajib.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <X className="mt-0.5 size-4 shrink-0 text-[#2F3E46]/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="font-heading text-3xl text-[#2F3E46]">
              &ldquo;Masuk dengan sajak, pulang dengan cerita.&rdquo;
            </p>

            <ReservationTriggerButton className="mt-2 w-fit shadow-[3px_3px_0_0_#2F3E46]" />
          </div>
        </div>
      </div>
    </section>
  )
}
