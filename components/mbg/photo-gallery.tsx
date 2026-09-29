import Image from "next/image"
import { DoodleStar } from "./doodles"

const galleryPhotos = [
  { src: "/images/amis-crowd.jpg", alt: "Aldy Amis tampil dekat dengan penonton", left: "0px", top: "16px", rotate: "-4deg", delay: "-0s" },
  { src: "/images/amis-stage-blue.jpg", alt: "Aldy Amis bermain gitar dengan pencahayaan biru", left: "82px", top: "2px", rotate: "2.8deg", delay: "-1.5s" },
  { src: "/images/amis-stage-red.jpg", alt: "Aldy Amis bernyanyi dengan pencahayaan merah", left: "168px", top: "18px", rotate: "-2.8deg", delay: "-3s" },
  { src: "/images/amis-hero.jpg", alt: "Aldy Amis dalam perjalanan Manggung Bergizi Gratis", left: "250px", top: "0px", rotate: "3.8deg", delay: "-4.5s" },
  { src: "/images/venue-ruang-rumi.jpg", alt: "Ruang Rumi sebagai salah satu ruang temu MBG", left: "20px", top: "108px", rotate: "1.5deg", delay: "-6s" },
  { src: "/images/venue-rengganis.jpg", alt: "Rumah Rengganis sebagai salah satu ruang temu MBG", left: "102px", top: "116px", rotate: "-2.2deg", delay: "-7.5s" },
  { src: "/images/venue-buku-akik.jpg", alt: "Buku Akik sebagai salah satu ruang temu MBG", left: "186px", top: "104px", rotate: "2.9deg", delay: "-9s" },
  { src: "/images/venue-rumah-budaya-ratna.jpg", alt: "Rumah Budaya Ratna sebagai salah satu ruang temu MBG", left: "274px", top: "112px", rotate: "-2.6deg", delay: "-10.5s" },
] as const

export function MbgPhotoGallery() {
  return (
    <div
      className="relative hidden h-[250px] w-full max-w-[430px] overflow-visible lg:block"
      aria-label="Galeri dokumentasi perjalanan Manggung Bergizi Gratis"
    >
      {galleryPhotos.map((photo, index) => (
        <div
          key={photo.src}
          className="mbg-gallery-card group absolute h-[104px] w-[144px] overflow-hidden rounded-md border-4 border-white bg-white shadow-[0_10px_20px_rgba(47,62,70,0.14)] sm:h-[112px] sm:w-[156px]"
          style={{
            "--mbg-gallery-left": photo.left,
            "--mbg-gallery-top": photo.top,
            "--mbg-gallery-rotate": photo.rotate,
            "--mbg-gallery-delay": photo.delay,
            "--mbg-gallery-index": index,
          }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            width={360}
            height={280}
            sizes="(min-width: 1024px) 156px, 0px"
            loading="lazy"
            className="block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      ))}

      <DoodleStar className="absolute -right-2 -top-3 z-[20] size-6" />
    </div>
  )
}
