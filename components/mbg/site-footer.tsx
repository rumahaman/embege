"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const closingWords = [
  "Perjumpaan",
  "Teman Perjalanan",
  "Cerita",
  "Percakapan",
  "Pertemuan",
  "Kawan",
  "Ruang Temu",
  "Perjalanan",
  "Ingatan",
  "Kenangan",
  "Suara",
  "Kata",
  "Rasa",
  "Cerita Manusia",
  "Ruang Bersama",
  "Langkah",
  "Jejak",
  "Singgah",
  "Berbagi",
  "Kebersamaan",
  "Perjalanan Kecil",
  "Ruang Perjumpaan",
  "Pulang",
  "Cerita Perjalanan",
  "Temu Manusia",
]

function ScoreboardWord() {
  const [index, setIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const wordRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = wordRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "120px 0px" },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const interval = window.setInterval(() => {
      setIndex((current) =>
        current === closingWords.length - 1 ? 0 : current + 1,
      )
    }, 1300)

    return () => window.clearInterval(interval)
  }, [isVisible])

  const currentWord = closingWords[index]

  return (
    <span
      ref={wordRef}
      className="relative inline-flex min-h-[1.35em] min-w-[9.8ch] items-center justify-center overflow-hidden rounded-[5px] border border-white/10 bg-[#223B4D] px-3 py-1 align-baseline font-body text-[0.72em] font-extrabold uppercase tracking-[0.09em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_0_rgba(0,0,0,0.12)] sm:min-w-[13ch]"
      aria-label={currentWord}
    >
      <span
        key={currentWord}
        className="mbg-score-flip whitespace-nowrap"
      >
        {currentWord}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/10"
      />
    </span>
  )
}

export function SiteFooter() {
  return (
    <footer id="kontak" className="relative overflow-hidden bg-[#2F3E46] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Identity */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo-bgn.jpg"
                alt="Logo Badan Gigs Nasional"
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />

              <div>
                <p className="font-hand text-xl leading-none text-white">
                  Manggung Bergizi Gratis
                </p>

                <p className="mt-1 font-body text-sm text-white/60">
                  Dipersembahkan oleh
                </p>

                <p className="font-body text-sm font-semibold text-white/80">
                  Badan Gigs Nasional
                </p>
              </div>
            </div>
          </div>

          {/* Closing statement */}
          <div className="max-w-sm md:text-right">
            <p className="font-hand text-2xl leading-tight text-white/80 sm:text-3xl">
              Musik, sajak, dan
              <br />
              <ScoreboardWord />
              <span className="ml-1">.</span>
            </p>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-center font-body text-xs text-white/45">
            &copy; {new Date().getFullYear()} Badan Gigs Nasional
          </p>
          <p className="mt-1 text-center font-body text-[10px] tracking-[0.08em] text-white/30">
            Republik Indienesia
          </p>
        </div>
      </div>

    </footer>
  )
}
