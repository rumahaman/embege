import Image from "next/image"
import { DoodleStar } from "./doodles"

const galleryPhotos = [
  { src: "/images/amis-crowd.jpg", alt: "Aldy Amis tampil dekat dengan penonton", left: "4px", top: "14px", rotate: "-3deg", delay: "-0s" },
  { src: "/images/amis-stage-blue.jpg", alt: "Aldy Amis bermain gitar dengan pencahayaan biru", left: "92px", top: "4px", rotate: "2.2deg", delay: "-1.5s" },
  { src: "/images/amis-stage-red.jpg", alt: "Aldy Amis bernyanyi dengan pencahayaan merah", left: "178px", top: "12px", rotate: "-2.4deg", delay: "-3s" },
  { src: "/images/amis-hero.jpg", alt: "Aldy Amis dalam perjalanan Manggung Bergizi Gratis", left: "264px", top: "2px", rotate: "3deg", delay: "-4.5s" },
  { src: "/images/venue-ruang-rumi.jpg", alt: "Ruang Rumi sebagai salah satu ruang temu MBG", left: "28px", top: "112px", rotate: "1.8deg", delay: "-6s" },
  { src: "/images/venue-rengganis.jpg", alt: "Rumah Rengganis sebagai salah satu ruang temu MBG", left: "112px", top: "106px", rotate: "-1.6deg", delay: "-7.5s" },
  { src: "/images/venue-buku-akik.jpg", alt: "Buku Akik sebagai salah satu ruang temu MBG", left: "198px", top: "114px", rotate: "2.6deg", delay: "-9s" },
  { src: "/images/venue-rumah-budaya-ratna.jpg", alt: "Rumah Budaya Ratna sebagai salah satu ruang temu MBG", left: "284px", top: "104px", rotate: "-2deg", delay: "-10.5s" },
] as const

export function MbgPhotoGallery() {
  return (
    <div
      className="relative block h-[205px] w-full max-w-[360px] overflow-visible sm:h-[225px] sm:max-w-[430px] lg:h-[250px]"
      aria-label="Galeri dokumentasi perjalanan Manggung Bergizi Gratis"
    >
      {galleryPhotos.map((photo, index) => (
        <div
          key={photo.src}
          className="mbg-gallery-card group absolute h-[88px] w-[112px] overflow-hidden rounded-md border-4 border-white bg-white shadow-[0_10px_20px_rgba(47,62,70,0.14)] sm:h-[96px] sm:w-[132px] lg:h-[112px] lg:w-[156px]"
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
            sizes="(min-width: 1024px) 156px, (min-width: 640px) 132px, 112px"
            loading="lazy"
            className="block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      ))}

      <DoodleStar className="absolute -right-2 -top-3 z-[20] size-6" />
    </div>
  )
}
