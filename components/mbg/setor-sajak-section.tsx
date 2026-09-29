import { Check, FileText } from "lucide-react"
import { MbgPhotoGallery } from "./photo-gallery"
import { ReservationTriggerButton } from "./reservation-trigger-button"

const yangDibawa = ["Tulisan tangan", "Catatan di buku", "Sajak atau lirik", "Gambar atau coretan"]

export function SetorSajakSection() {
  return (
    <section id="setor-sajak" className="relative overflow-hidden bg-[#EDF2F5] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="relative order-2 justify-self-center lg:order-1 lg:-translate-x-16 xl:-translate-x-20">
            <MbgPhotoGallery />
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

            <div className="mt-2 max-w-xl">
              <div
                className="relative overflow-hidden rounded-md border border-[#2F3E46]/10 px-5 py-5 shadow-[0_4px_14px_rgba(47,62,70,0.06)]"
                style={{
                  backgroundColor: "#F7EBCB",
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(47,62,70,0.10) 32px), radial-gradient(circle at 18% 18%, rgba(255,255,255,0.35), transparent 35%)",
                  backgroundPosition: "0 12px, 0 0",
                }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[#97B4C1] [clip-path:polygon(0_45%,8%_15%,16%_40%,24%_18%,32%_45%,40%_20%,48%_44%,56%_18%,64%_45%,72%_20%,80%_44%,88%_16%,100%_35%,100%_100%,0_100%)]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-[#97B4C1] [clip-path:polygon(0_65%,8%_40%,16%_70%,24%_45%,32%_68%,40%_42%,48%_70%,56%_46%,64%_72%,72%_45%,80%_70%,88%_42%,100%_62%,100%_0,0_0)]" />
                <p className="relative mb-3 flex items-center gap-2 font-hand text-lg text-[#2F3E46]">
                  <FileText className="size-4" />
                  Yang Bisa Dibawa
                </p>
                <ul className="relative flex flex-col gap-2 font-body text-sm text-[#2F3E46]/80">
                  {yangDibawa.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-[#2F3E46]/70" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="relative mt-4 border-t border-[#2F3E46]/10 pt-4">
                  <p className="font-hand text-xl text-[#2F3E46]">Tidak membawa karya?</p>
                  <p className="mt-1 font-body text-sm leading-relaxed text-[#2F3E46]/75">
                    Kami menyediakan media untuk menulis, menggambar, atau meninggalkan pesan di lokasi acara.
                  </p>
                </div>
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
