import Image from "next/image"
import { DoodleSquiggle, DoodleStar } from "./doodles"

export function TentangAcaraSection() {
  return (
    <section id="tentang-acara" className="relative overflow-hidden bg-[#97B4C1] py-16 sm:py-24">
      <DoodleStar className="absolute right-[6%] top-10 size-5 opacity-80" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="order-2 flex flex-col gap-3 lg:order-1">
          <div className="relative w-full max-w-md -rotate-1 self-center overflow-hidden rounded-md border-4 border-white/70 shadow-xl lg:self-start">
            <Image
              src="/images/amis-stage-blue.jpg"
              alt="Aldy Amis bernyanyi sambil bermain gitar di atas panggung dengan pencahayaan biru"
              width={800}
              height={1000}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>

        <div className="order-1 flex flex-col gap-4 lg:order-2">
          <p className="font-body text-sm uppercase tracking-wide text-[#2F3E46]/60">
            Tentang Acara
          </p>
          <h2 className="font-heading text-5xl text-[#2F3E46] sm:text-6xl">
            Apa itu Manggung Bergizi Gratis?
          </h2>
          <DoodleSquiggle />

          <div className="flex flex-col gap-4 font-body text-base leading-relaxed text-[#2F3E46]/85">
            <p>
              Manggung Bergizi Gratis adalah rangkaian pertunjukan intim Aldy Amis yang
              diselenggarakan di beberapa kota, dipersembahkan oleh Badan Gigs Nasional.
            </p>
            <p>
              Acara ini tidak dirancang sebagai konser besar, melainkan ruang pertemuan yang
              memungkinkan penonton dan musisi berada dalam jarak yang lebih dekat — berbagi
              cerita, pengalaman, dan suasana secara lebih personal.
            </p>
            <p>
              Setiap penyelenggaraan Manggung Bergizi Gratis berlangsung di ruang-ruang alternatif
              yang memiliki kedekatan dengan komunitas, budaya, dan kehidupan sehari-hari
              masyarakat setempat.
            </p>
          </div>

          <blockquote className="mt-2 border-l-4 border-[#F6EB35] pl-4 font-heading text-3xl text-[#2F3E46]">
            &ldquo;Masuk dengan sajak, pulang dengan cerita.&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  )
}
