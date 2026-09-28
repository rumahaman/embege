import { Check, X, FileText } from "lucide-react"
import { MbgPhotoGallery } from "./photo-gallery"
import { ReservationTriggerButton } from "./reservation-trigger-button"

const yangDibawa = ["Tulisan tangan", "Cetakan kertas", "Catatan di buku", "Hasil print"]

const tidakWajib = ["Membacakan sajak di depan umum", "Menjelaskan isi sajak", "Membawa karya sendiri"]

export function SetorSajakSection() {
  return (
    <section id="setor-sajak" className="relative overflow-hidden bg-[#EDF2F5] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="relative order-2 justify-self-center lg:order-1">
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

            <div className="mt-2 grid gap-4 sm:grid-cols-2">
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
              </div>

              <div
                className="relative overflow-hidden rounded-md border border-[#2F3E46]/10 px-5 py-5 shadow-[0_4px_14px_rgba(47,62,70,0.05)]"
                style={{
                  backgroundColor: "#A9C1CC",
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(47,62,70,0.10) 32px), radial-gradient(circle at 82% 18%, rgba(255,255,255,0.16), transparent 36%)",
                  backgroundPosition: "0 12px, 0 0",
                }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[#97B4C1] [clip-path:polygon(0_42%,10%_18%,20%_45%,30%_22%,40%_46%,50%_20%,60%_44%,70%_18%,80%_46%,90%_22%,100%_40%,100%_100%,0_100%)]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-[#97B4C1] [clip-path:polygon(0_62%,10%_40%,20%_66%,30%_45%,40%_70%,50%_43%,60%_68%,70%_40%,80%_72%,90%_44%,100%_64%,100%_0,0_0)]" />
                <p className="relative mb-3 font-hand text-lg text-[#2F3E46]">Tidak Wajib</p>
                <ul className="relative flex flex-col gap-2 font-body text-sm text-[#2F3E46]/80">
                  {tidakWajib.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <X className="mt-0.5 size-4 shrink-0 text-[#2F3E46]/70" />
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
