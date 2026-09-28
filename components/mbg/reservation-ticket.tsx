`use client`

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type ReservationTicketProps = {
  reservationNumber: string
  name: string
  city: string
  venue: string
  date: string
}

const TICKET_WIDTH = 1080
const TICKET_HEIGHT = 1536
const NAVY = "#223B4D"
const CREAM = "#F5F0E6"
const YELLOW = "#F6EB35"
const BLUE = "#AFC7D2"
const TEXT = "#203444"

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

async function blobToDataUrl(blob: Blob) {
  return await new Promise<string | null>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null)
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(blob)
  })
}

async function assetToDataUrl(path: string) {
  try {
    const response = await fetch(path, { credentials: "same-origin" })
    if (!response.ok) return null
    return await blobToDataUrl(await response.blob())
  } catch {
    return null
  }
}

function createTicketSvg(
  data: ReservationTicketProps,
  logoDataUrl: string | null,
  vanDataUrl: string | null,
) {
  const name = escapeXml(data.name)
  const city = escapeXml(data.city)
  const venue = escapeXml(data.venue)
  const date = escapeXml(data.date)
  const reservationNumber = escapeXml(data.reservationNumber)

  const perforations = Array.from({ length: 15 }, (_, index) => {
    const y = 85 + index * 97
    return `
      <circle cx="57" cy="${y}" r="14" fill="${NAVY}"/>
      <circle cx="1023" cy="${y}" r="14" fill="${NAVY}"/>
    `
  }).join("")

  const logo = logoDataUrl
    ? `<image href="${logoDataUrl}" x="506" y="1372" width="68" height="68" preserveAspectRatio="xMidYMid meet"/>`
    : ""

  const van = vanDataUrl
    ? `<image href="${vanDataUrl}" x="54" y="1121" width="420" height="260" preserveAspectRatio="xMidYMid meet"/>`
    : ""

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${TICKET_WIDTH}" height="${TICKET_HEIGHT}" viewBox="0 0 ${TICKET_WIDTH} ${TICKET_HEIGHT}">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${CREAM}"/>
      <stop offset="100%" stop-color="#ECE5D7"/>
    </linearGradient>
    <pattern id="grain" width="18" height="18" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="${NAVY}" opacity=".07"/>
    </pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#102330" flood-opacity=".22"/>
    </filter>
    <style>
      .display { font-family: "Caveat", cursive; font-weight: 700; fill: ${NAVY}; }
      .body { font-family: "Inter", Arial, sans-serif; fill: ${TEXT}; }
      .body-bold { font-family: "Inter", Arial, sans-serif; font-weight: 700; fill: ${TEXT}; }
      .hand { font-family: "Patrick Hand", cursive; fill: ${NAVY}; }
      .small { font-family: "Inter", Arial, sans-serif; font-weight: 700; letter-spacing: 5px; fill: ${NAVY}; }
    </style>
  </defs>

  <rect width="${TICKET_WIDTH}" height="${TICKET_HEIGHT}" fill="${NAVY}"/>
  <rect x="48" y="34" width="984" height="1468" rx="30" fill="url(#paper)" filter="url(#shadow)"/>
  <rect x="48" y="34" width="984" height="1468" rx="30" fill="url(#grain)"/>

  ${perforations}

  <text x="88" y="136" class="display" font-size="66">Manggung</text>
  <text x="88" y="204" class="display" font-size="66">Bergizi Gratis</text>
  <text x="88" y="258" class="hand" font-size="34" font-style="italic">intimate shownya Aldy Amis</text>

  <rect x="833" y="87" width="153" height="50" rx="11" fill="${YELLOW}"/>
  <text x="909" y="120" text-anchor="middle" class="hand" font-size="28" font-style="italic">$etor $ajak</text>

  <line x1="88" y1="288" x2="992" y2="288" stroke="${NAVY}" stroke-opacity=".2" stroke-width="2" stroke-dasharray="8 12"/>

  <rect x="88" y="322" width="904" height="96" rx="18" fill="${YELLOW}"/>
  <text x="540" y="386" text-anchor="middle" class="display" font-size="58">TIKET MASUK</text>

  <line x1="88" y1="447" x2="355" y2="447" stroke="${NAVY}" stroke-width="3"/>
  <line x1="725" y1="447" x2="992" y2="447" stroke="${NAVY}" stroke-width="3"/>
  <text x="540" y="459" text-anchor="middle" class="small" font-size="16">SATU SAJAK SEBAGAI TIKET MASUK ACARA</text>

  <rect x="88" y="487" width="904" height="164" rx="22" fill="${BLUE}"/>
  <text x="540" y="530" text-anchor="middle" class="small" font-size="16" opacity=".72">NO. RESERVASI</text>
  <text x="540" y="603" text-anchor="middle" class="display" font-size="62">${reservationNumber}</text>
  <rect x="323" y="614" width="434" height="34" rx="17" fill="${NAVY}"/>
  <circle cx="349" cy="631" r="8" fill="#8AC89B"/>
  <text x="365" y="637" class="body-bold" font-size="16" fill="${CREAM}">Reservasi Berhasil Dicatat</text>

  <text x="88" y="710" class="small" font-size="16" opacity=".68">NAMA</text>
  <text x="88" y="750" class="body-bold" font-size="28">${name}</text>
  <line x1="88" y1="768" x2="500" y2="768" stroke="${NAVY}" stroke-opacity=".2" stroke-dasharray="4 10"/>

  <text x="580" y="710" class="small" font-size="16" opacity=".68">KOTA ACARA</text>
  <text x="580" y="750" class="body-bold" font-size="28">${city}</text>
  <line x1="580" y1="768" x2="992" y2="768" stroke="${NAVY}" stroke-opacity=".2" stroke-dasharray="4 10"/>

  <text x="88" y="822" class="small" font-size="16" opacity=".68">VENUE</text>
  <text x="88" y="862" class="body-bold" font-size="26">${venue}</text>
  <line x1="88" y1="882" x2="500" y2="882" stroke="${NAVY}" stroke-opacity=".2" stroke-dasharray="4 10"/>

  <text x="580" y="822" class="small" font-size="16" opacity=".68">TANGGAL</text>
  <text x="580" y="862" class="body-bold" font-size="26">${date}</text>
  <line x1="580" y1="882" x2="992" y2="882" stroke="${NAVY}" stroke-opacity=".2" stroke-dasharray="4 10"/>

  <line x1="88" y1="918" x2="992" y2="918" stroke="${NAVY}" stroke-opacity=".2" stroke-width="2" stroke-dasharray="8 12"/>

  <text x="88" y="968" class="small" font-size="16" opacity=".68">HTM</text>
  <text x="88" y="1016" class="display" font-size="42">1 Sajak</text>
  <path d="M88 1029 q46 16 98 0" fill="none" stroke="${YELLOW}" stroke-width="10" stroke-linecap="round"/>

  <rect x="560" y="944" width="432" height="112" rx="18" fill="#FFFFFF" fill-opacity=".5" stroke="${YELLOW}" stroke-width="0"/>
  <rect x="560" y="944" width="7" height="112" rx="3.5" fill="${YELLOW}"/>
  <text x="588" y="981" class="hand" font-size="26" font-style="italic">Bawa satu sajak sebagai tiket masuk.</text>
  <text x="588" y="1015" class="body" font-size="16">Simpan tiket ini dan tunjukkan identitas saat registrasi.</text>

  <rect x="68" y="1075" width="944" height="275" rx="22" fill="${BLUE}" fill-opacity=".55"/>
  <ellipse cx="274" cy="1312" rx="184" ry="21" fill="${NAVY}" fill-opacity=".16" filter="url(#shadow)"/>
  ${van}

  <text x="760" y="1198" class="hand" font-size="31" font-style="italic" text-anchor="middle">Satu sajak</text>
  <text x="760" y="1238" class="hand" font-size="31" font-style="italic" text-anchor="middle">untuk satu pintu masuk.</text>

  <line x1="88" y1="1370" x2="992" y2="1370" stroke="${NAVY}" stroke-opacity=".18" stroke-width="2"/>

  <rect x="48" y="1388" width="984" height="114" fill="${NAVY}"/>
  ${logo}
  <text x="540" y="1471" text-anchor="middle" class="body-bold" font-size="24" letter-spacing="5" fill="${CREAM}">BADAN GIGS NASIONAL</text>
  <text x="540" y="1493" text-anchor="middle" class="body" font-size="12" letter-spacing="2" fill="${CREAM}" opacity=".76">MANGGUNG BERGIZI GRATIS</text>
</svg>`
}

async function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

async function svgToPng(svg: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  try {
    const image = new Image()
    image.decoding = "async"

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error("Tiket gagal dirender."))
      image.src = url
    })

    const canvas = document.createElement("canvas")
    canvas.width = TICKET_WIDTH
    canvas.height = TICKET_HEIGHT

    const context = canvas.getContext("2d")
    if (!context) throw new Error("Canvas tidak tersedia.")

    context.drawImage(image, 0, 0, TICKET_WIDTH, TICKET_HEIGHT)

    const png = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png", 1)
    })

    if (!png) throw new Error("Tiket gagal dibuat.")
    return png
  } finally {
    URL.revokeObjectURL(url)
  }
}

function TicketInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-b border-dashed border-[#223B4D]/20 pb-3">
      <p className="font-body text-[14px] font-bold uppercase tracking-[0.22em] text-[#223B4D]/65">
        {label}
      </p>
      <p className="mt-1 break-words font-body text-[24px] font-semibold leading-snug text-[#223B4D]">
        {value}
      </p>
    </div>
  )
}

function TicketVisual({
  reservationNumber,
  name,
  city,
  venue,
  date,
  innerRef,
}: ReservationTicketProps & {
  innerRef?: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      ref={innerRef}
      className="relative overflow-hidden rounded-[30px] border-[10px] border-[#223B4D] bg-[#F5F0E6]"
      style={{ width: TICKET_WIDTH, height: TICKET_HEIGHT }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-55"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(34,59,77,.10) 1px, transparent 1.3px)",
          backgroundSize: "18px 18px",
        }}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 z-30 flex flex-col justify-around">
        {Array.from({ length: 13 }).map((_, index) => (
          <span key={index} className="size-7 -translate-x-3.5 rounded-full bg-[#223B4D]" />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-30 flex flex-col justify-around">
        {Array.from({ length: 13 }).map((_, index) => (
          <span key={index} className="size-7 translate-x-3.5 rounded-full bg-[#223B4D]" />
        ))}
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <div className="px-[38px] pb-5 pt-[48px]">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-heading text-[70px] leading-[0.87] tracking-wide text-[#223B4D]">
                Manggung
                <br />
                Bergizi Gratis
              </p>
              <p className="mt-5 font-hand text-[36px] italic text-[#223B4D]">
                intimate shownya Aldy Amis
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-[#F6EB35] px-5 py-3 font-hand text-[30px] italic leading-none text-[#223B4D]">
              $etor $ajak
            </div>
          </div>

          <div className="my-7 flex items-center gap-4 text-[#223B4D]">
            <span className="h-[2px] flex-1 border-t-2 border-dashed border-[#223B4D]/25" />
            <span className="font-body text-[14px] font-bold uppercase tracking-[0.24em]">
              Tiket Masuk
            </span>
            <span className="h-[2px] flex-1 border-t-2 border-dashed border-[#223B4D]/25" />
          </div>

          <div className="rounded-[22px] bg-[#AFC7D2] px-6 py-7 text-center">
            <p className="font-body text-[14px] font-bold uppercase tracking-[0.3em] text-[#223B4D]/70">
              No. Reservasi
            </p>
            <p className="mt-3 break-all font-heading text-[64px] font-semibold leading-none tracking-[0.03em] text-[#223B4D]">
              {reservationNumber}
            </p>
            <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full bg-[#223B4D] px-5 py-2.5 text-[16px] font-semibold text-[#F5F0E6]">
              <CheckCircle2 className="size-5 text-[#8AC89B]" />
              Reservasi Berhasil Dicatat
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-x-10 gap-y-6">
            <TicketInfo label="Nama" value={name} />
            <TicketInfo label="Kota Acara" value={city} />
            <TicketInfo label="Venue" value={venue} />
            <TicketInfo label="Tanggal" value={date} />
          </div>

          <div className="mt-6 grid grid-cols-[0.75fr_1.25fr] gap-7 border-t-2 border-dashed border-[#223B4D]/18 pt-6">
            <div>
              <p className="font-body text-[14px] font-bold uppercase tracking-[0.27em] text-[#223B4D]/70">
                HTM
              </p>
              <p className="mt-1 font-heading text-[40px] text-[#223B4D]">1 Sajak</p>
              <div className="mt-1 h-3 w-28 -rotate-2 rounded-full bg-[#F6EB35]" />
            </div>

            <div className="rounded-2xl border-l-[6px] border-[#F6EB35] bg-white/55 px-5 py-4">
              <p className="font-hand text-[27px] italic leading-tight text-[#223B4D]">
                Bawa satu sajak sebagai tiket masuk.
              </p>
              <p className="mt-2 font-body text-[16px] leading-relaxed text-[#223B4D]/75">
                Simpan tiket ini dan tunjukkan identitas saat registrasi di venue.
              </p>
            </div>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden bg-[#AFC7D2]/55">
          <div
            className="absolute bottom-8 left-1/2 h-9 w-[64%] -translate-x-1/2 rounded-[50%] bg-[#223B4D]/18 blur-xl"
            aria-hidden="true"
          />
          <img
            src="/mbg-van-transparent.png"
            alt=""
            aria-hidden="true"
            className="absolute bottom-0 left-[2%] h-[92%] w-auto max-w-[58%] object-contain drop-shadow-[0_20px_13px_rgba(34,59,77,0.23)]"
          />

          <div className="absolute right-[5%] top-1/2 w-[30%] -translate-y-1/2">
            <p className="font-hand text-[30px] italic leading-tight text-[#223B4D]">
              Satu sajak
              <br />
              untuk satu pintu masuk.
            </p>
          </div>
        </div>

        <div className="bg-[#223B4D] px-8 pb-7 pt-5 text-center text-[#F5F0E6]">
          <img
            src="/images/icon.png"
            alt=""
            aria-hidden="true"
            className="mx-auto size-[68px] object-contain"
          />
          <p className="mt-2 font-body text-[24px] font-extrabold uppercase tracking-[0.25em]">
            Badan Gigs Nasional
          </p>
          <p className="mt-2 font-body text-[13px] uppercase tracking-[0.2em] opacity-75">
            Manggung Bergizi Gratis
          </p>
        </div>
      </div>
    </div>
  )
}

export function ReservationTicket(props: ReservationTicketProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const ticketRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    const element = frameRef.current
    if (!element) return

    const updateScale = () => {
      const width = element.clientWidth
      setScale(Math.min(1, width / TICKET_WIDTH))
    }

    updateScale()

    const observer = new ResizeObserver(updateScale)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  async function handleDownload() {
    if (isDownloading) return
    setIsDownloading(true)

    try {
      await document.fonts.ready
      const [logoDataUrl, vanDataUrl] = await Promise.all([
        assetToDataUrl("/images/icon.png"),
        assetToDataUrl("/mbg-van-transparent.png"),
      ])

      const svg = createTicketSvg(props, logoDataUrl, vanDataUrl)
      const png = await svgToPng(svg)
      const safeName = props.name.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")
      await downloadBlob(png, `${props.reservationNumber}-${safeName || "tiket"}.png`)
    } catch (error) {
      console.error("Ticket download error:", error)
      alert("Tiket belum berhasil dibuat. Coba lagi sebentar.")
    } finally {
      setIsDownloading(false)
    }
  }

  const frameHeight = Math.max(1, Math.round(TICKET_HEIGHT * scale))

  return (
    <div className="space-y-4">
      <div
        ref={frameRef}
        className="relative w-full overflow-hidden rounded-[30px] bg-[#223B4D]"
        style={{ height: frameHeight }}
      >
        <div
          style={{
            width: TICKET_WIDTH,
            height: TICKET_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <TicketVisual
            reservationNumber={props.reservationNumber}
            name={props.name}
            city={props.city}
            venue={props.venue}
            date={props.date}
            innerRef={ticketRef}
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full bg-[#F6EB35] font-hand text-lg text-[#223B4D] hover:bg-[#F6EB35]/90"
      >
        {isDownloading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Menyiapkan tiket...
          </>
        ) : (
          <>
            <Download className="size-4" />
            Download Tiket
          </>
        )}
      </Button>
    </div>
  )
}
