import Image from "next/image"
import { DoodleStar } from "./doodles"

const galleryPhotos = [
  { src: "/images/amis-crowd.jpg", alt: "Aldy Amis tampil dekat dengan penonton", rotate: "-1.8deg", driftX: "3px", driftY: "-2px", duration: "10s", delay: "-2s" },
  { src: "/images/amis-stage-blue.jpg", alt: "Aldy Amis bermain gitar dengan pencahayaan biru", rotate: "1.6deg", driftX: "-2px", driftY: "3px", duration: "12s", delay: "-7s" },
  { src: "/images/amis-stage-red.jpg", alt: "Aldy Amis bernyanyi dengan pencahayaan merah", rotate: "-1deg", driftX: "3px", driftY: "2px", duration: "11s", delay: "-5s" },
  { src: "/images/amis-hero.jpg", alt: "Aldy Amis dalam perjalanan Manggung Bergizi Gratis", rotate: "1.2deg", driftX: "-3px", driftY: "-2px", duration: "13s", delay: "-9s" },
  { src: "/images/venue-ruang-rumi.jpg", alt: "Ruang Rumi sebagai salah satu ruang temu MBG", rotate: "-2.2deg", driftX: "2px", driftY: "3px", duration: "9s", delay: "-4s" },
  { src: "/images/venue-rengganis.jpg", alt: "Rumah Rengganis sebagai salah satu ruang temu MBG", rotate: "1.8deg", driftX: "-2px", driftY: "-3px", duration: "12s", delay: "-1s" },
  { src: "/images/venue-buku-akik.jpg", alt: "Buku Akik sebagai salah satu ruang temu MBG", rotate: "-1.4deg", driftX: "3px", driftY: "2px", duration: "10s", delay: "-6s" },
  { src: "/images/venue-rumah-budaya-ratna.jpg", alt: "Rumah Budaya Ratna sebagai salah satu ruang temu MBG", rotate: "2deg", driftX: "-3px", driftY: "2px", duration: "13s", delay: "-10s" },
] as const

export function MbgPhotoGallery() {
  return (
    <div
      className="relative hidden w-full max-w-[430px] overflow-visible lg:block"
      aria-label="Galeri dokumentasi perjalanan Manggung Bergizi Gratis"
    >
      <div className="grid grid-cols-3 gap-4 px-1 py-2">
        {galleryPhotos.map((photo, index) => (
          <div
            key={photo.src}
            className={
              "mbg-gallery-card group relative h-[108px] w-full overflow-hidden rounded-md border-4 border-white bg-white shadow-[0_10px_20px_rgba(47,62,70,0.12)] sm:h-[116px] " +
              (index === galleryPhotos.length - 1 ? "col-start-2" : "")
            }
            style={{
              "--mbg-gallery-rotate": photo.rotate,
              "--mbg-gallery-drift-x": photo.driftX,
              "--mbg-gallery-drift-y": photo.driftY,
              "--mbg-gallery-duration": photo.duration,
              "--mbg-gallery-delay": photo.delay,
            }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={360}
              height={280}
              sizes="(min-width: 1024px) 130px, 0px"
              className="block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      <DoodleStar className="absolute -right-3 -top-2 z-20 size-6" />
    </div>
  )
}
