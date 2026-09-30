"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { DoodleStar } from "./doodles"

const galleryPhotos = [
  {
    src: "/images/Gallery-01.jpg",
    alt: "Dokumentasi Manggung Bergizi Gratis 01",
  },
  {
    src: "/images/Gallery-02.jpg",
    alt: "Dokumentasi Manggung Bergizi Gratis 02",
  },
  {
    src: "/images/Gallery-03.jpg",
    alt: "Dokumentasi Manggung Bergizi Gratis 03",
  },
  {
    src: "/images/Gallery-04.jpg",
    alt: "Dokumentasi Manggung Bergizi Gratis 04",
  },
  {
    src: "/images/Gallery-05.jpg",
    alt: "Dokumentasi Manggung Bergizi Gratis 05",
  },
  {
    src: "/images/Gallery-06.jpg",
    alt: "Dokumentasi Manggung Bergizi Gratis 06",
  },
  {
    src: "/images/Gallery-07.jpg",
    alt: "Dokumentasi Manggung Bergizi Gratis 07",
  },
  {
    src: "/images/Gallery-08.jpg",
    alt: "Dokumentasi Manggung Bergizi Gratis 08",
  },
  {
    src: "/images/Gallery-09.jpg",
    alt: "Dokumentasi Manggung Bergizi Gratis 09",
  },
  {
    src: "/images/Gallery-010.jpg",
    alt: "Dokumentasi Manggung Bergizi Gratis 10",
  },
  {
    src: "/images/Gallery-011.jpg",
    alt: "Dokumentasi Manggung Bergizi Gratis 11",
  },
] as const

const rotations = [
  "-5deg",
  "4deg",
  "-3deg",
  "3deg",
  "-2deg",
  "2deg",
]

const offsets = [
  { x: -18, y: -14 },
  { x: 15, y: -11 },
  { x: -11, y: 10 },
  { x: 15, y: 7 },
  { x: -8, y: 15 },
  { x: 7, y: 9 },
]

const DISPLAY_DURATION = 3000
const FADE_DURATION = 600

export function MbgPhotoGallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (reduceMotion) {
      return
    }

    let fadeTimer: number | undefined

    const displayTimer = window.setTimeout(() => {
      const next =
        activeIndex === galleryPhotos.length - 1
          ? 0
          : activeIndex + 1

      setNextIndex(next)
      setIsTransitioning(true)

      fadeTimer = window.setTimeout(() => {
        setActiveIndex(next)
        setNextIndex(null)
        setIsTransitioning(false)
      }, FADE_DURATION)
    }, DISPLAY_DURATION)

    return () => {
      window.clearTimeout(displayTimer)

      if (fadeTimer !== undefined) {
        window.clearTimeout(fadeTimer)
      }
    }
  }, [activeIndex])

  const orderedPhotos = galleryPhotos.map(
    (_, index) =>
      galleryPhotos[
        (activeIndex + index) %
          galleryPhotos.length
      ],
  )

  return (
    <div
      className="relative h-[320px] w-[280px] sm:h-[420px] sm:w-[370px] lg:h-[500px] lg:w-[430px]"
      aria-label="Galeri dokumentasi perjalanan Manggung Bergizi Gratis"
    >
      <div className="absolute inset-0">
        {orderedPhotos.map((photo, index) => {
          const depth = Math.min(
            index,
            rotations.length - 1,
          )

          const offset = offsets[depth]
          const rotation = rotations[depth]
          const scale = 1 - depth * 0.018
          const isTopCard = index === 0

          return (
            <figure
  key={photo.src}
  className={`group absolute left-1/2 top-1/2 h-[250px] w-[290px] overflow-hidden rounded-lg border-4 border-white bg-white shadow-[0_18px_34px_rgba(47,62,70,0.18)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[300px] sm:w-[350px] lg:h-[360px] lg:w-[420px] ${
    isTopCard ? "transition-opacity duration-[600ms]" : ""
  }`}
  style={{
    zIndex: galleryPhotos.length - index,
    opacity:
      isTopCard && isTransitioning
        ? 0.92
        : 1,
    transform: `
      translate(-50%, -50%)
      translate(${offset.x}px, ${offset.y}px)
      rotate(${rotation})
      scale(${scale})
    `,
  }}
>
              {isTopCard ? (
                <div className="absolute inset-0">
                  {/* Foto aktif */}
                  <div
                    className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
                    style={{
                      opacity:
                        isTransitioning ? 0 : 1,
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={1000}
                      height={750}
                      sizes="(min-width: 1024px) 420px, (min-width: 640px) 350px, 290px"
                      priority
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.07]"
                    />
                  </div>

                  {/* Foto berikutnya */}
                  {nextIndex !== null && (
                    <div
                      className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
                      style={{
                        opacity:
                          isTransitioning ? 1 : 0,
                      }}
                    >
                      <Image
                        src={
                          galleryPhotos[
                            nextIndex
                          ].src
                        }
                        alt={
                          galleryPhotos[
                            nextIndex
                          ].alt
                        }
                        width={1000}
                        height={750}
                        sizes="(min-width: 1024px) 420px, (min-width: 640px) 350px, 290px"
                        priority
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={1000}
                  height={750}
                  sizes="(min-width: 1024px) 420px, (min-width: 640px) 350px, 290px"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
            </figure>
          )
        })}
      </div>

      <DoodleStar className="pointer-events-none absolute -right-3 -top-4 z-[120] size-7" />
    </div>
  )
}