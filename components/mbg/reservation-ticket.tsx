"use client"

import { useState } from "react"
import { CheckCircle2, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type ReservationTicketProps = {
  reservationNumber: string
  name: string
  city: string
  venue: string
  date: string
}

const COLORS = {
  navy: "#223B4D",
  cream: "#F5F0E6",
  yellow: "#F6EB35",
  blue: "#AFC7D2",
  text: "#203444",
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function addLines(text: string, x: number, y: number, lineHeight: number, className: string) {
  return text
    .split("\n")
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" class="${className}">${escapeXml(line)}</text>`,
    )
    .join("")
}

async function assetToDataUrl(path: string) {
  try {
    const response = await fetch(path)
    if (!response.ok) return null
    const blob = await response.blob()

    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function createTicketSvg(
  data: {
    reservationNumber: string
    name: string
    city: string
    venue: string
    date: string
  },
  logoDataUrl: string | null,
  vanDataUrl: string | null,
) {
  const name = escapeXml(data.name)
  const city = escapeXml(data.city)
  const venue = escapeXml(data.venue)
  const date = escapeXml(data.date)
  const reservationNumber = escapeXml(data.reservationNumber)

  const perforations = Array.from({ length: 13 }, (_, index) => {
    const y = 115 + index * 102
    return `
      <circle cx="47" cy="${y}" r="14" fill="${COLORS.navy}" />
      <circle cx="1033" cy="${y}" r="14" fill="${COLORS.navy}" />
    `
  }).join("")

  const logo = logoDataUrl
    ? `<image href="${logoDataUrl}" x="510" y="1362" width="60" height="60" preserveAspectRatio="xMidYMid meet" />`
    : ""

  const van = vanDataUrl
    ? `<image href="${vanDataUrl}" x="88" y="1042" width="700" height="430" preserveAspectRatio="xMidYMid meet" />`
    : ""

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1536" viewBox="0 0 1080 1536">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLORS.cream}"/>
      <stop offset="100%" stop-color="#ECE5D7"/>
    </linearGradient>
    <pattern id="grain" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="5" r="1" fill="${COLORS.text}" opacity=".045"/>
      <circle cx="16" cy="9" r=".8" fill="${COLORS.text}" opacity=".035"/>
      <circle cx="10" cy="19" r=".7" fill="${COLORS.text}" opacity=".04"/>
      <circle cx="22" cy="21" r=".9" fill="${COLORS.text}" opacity=".035"/>
    </pattern>
    <filter id="paperShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#102330" flood-opacity=".22"/>
    </filter>
    <style>
      .display { font-family: Arial Black, Impact, sans-serif; font-weight: 900; letter-spacing: 3px; fill: ${COLORS.navy}; }
      .body { font-family: Arial, Helvetica, sans-serif; fill: ${COLORS.text}; }
      .body-bold { font-family: Arial, Helvetica, sans-serif; font-weight: 700; fill: ${COLORS.text}; }
      .hand { font-family: "Comic Sans MS", cursive; font-style: italic; fill: ${COLORS.navy}; }
      .smallcaps { font-family: Arial, Helvetica, sans-serif; font-weight: 700; letter-spacing: 5px; fill: ${COLORS.navy}; }
    </style>
  </defs>

  <rect width="1080" height="1536" fill="${COLORS.navy}"/>
  <rect x="64" y="48" width="952" height="1440" rx="30" fill="url(#paper)" filter="url(#paperShadow)"/>
  <rect x="64" y="48" width="952" height="1440" rx="30" fill="url(#grain)"/>

  ${perforations}

  <text x="104" y="165" class="display" font-size="70">MANGGUNG</text>
  <text x="104" y="240" class="display" font-size="70">BERGIZI GRATIS</text>
  <text x="105" y="302" class="hand" font-size="34">intimate shownya Aldy Amis</text>

  <rect x="795" y="116" width="165" height="52" rx="10" fill="${COLORS.yellow}"/>
  <text x="877" y="151" text-anchor="middle" class="hand" font-size="27">${$etor $ajak}</text>

  <path d="M107 333 h866" stroke="${COLORS.navy}" stroke-opacity=".18" stroke-width="2" stroke-dasharray="8 12"/>

  <rect x="104" y="368" width="872" height="104" rx="18" fill="${COLORS.yellow}"/>
  <text x="540" y="439" text-anchor="middle" class="display" font-size="66">TIKET MASUK</text>

  <line x1="104" y1="502" x2="370" y2="502" stroke="${COLORS.navy}" stroke-width="3"/>
  <line x1="710" y1="502" x2="976" y2="502" stroke="${COLORS.navy}" stroke-width="3"/>
  <text x="540" y="514" text-anchor="middle" class="smallcaps" font-size="18">SATU SAJAK SEBAGAI TIKET MASUK ACARA</text>

  <rect x="104" y="550" width="872" height="178" rx="24" fill="${COLORS.blue}"/>
  <text x="540" y="593" text-anchor="middle" class="smallcaps" font-size="18">NO. RESERVASI</text>
  <text x="540" y="675" text-anchor="middle" class="display" font-size="64">${reservationNumber}</text>
  <rect x="318" y="689" width="444" height="38" rx="19" fill="${COLORS.navy}"/>
  <circle cx="348" cy="708" r="9" fill="#8AC89B"/>
  <text x="365" y="715" class="body-bold" font-size="17" fill="${COLORS.cream}">Reservasi Berhasil Dicatat</text>

  <text x="106" y="786" class="smallcaps" font-size="18">NAMA</text>
  <text x="106" y="829" class="body-bold" font-size="31">${name}</text>
  <line x1="104" y1="852" x2="514" y2="852" stroke="${COLORS.navy}" stroke-opacity=".22" stroke-dasharray="4 10"/>

  <text x="566" y="786" class="smallcaps" font-size="18">KOTA ACARA</text>
  <text x="566" y="829" class="body-bold" font-size="31">${city}</text>
  <line x1="564" y1="852" x2="976" y2="852" stroke="${COLORS.navy}" stroke-opacity=".22" stroke-dasharray="4 10"/>

  <text x="106" y="892" class="smallcaps" font-size="18">VENUE</text>
  <text x="106" y="935" class="body-bold" font-size="28">${venue}</text>
  <line x1="104" y1="958" x2="514" y2="958" stroke="${COLORS.navy}" stroke-opacity=".22" stroke-dasharray="4 10"/>

  <text x="566" y="892" class="smallcaps" font-size="18">TANGGAL</text>
  <text x="566" y="935" class="body-bold" font-size="28">${date}</text>
  <line x1="564" y1="958" x2="976" y2="958" stroke="${COLORS.navy}" stroke-opacity=".22" stroke-dasharray="4 10"/>

  <text x="106" y="1002" class="smallcaps" font-size="18">HTM</text>
  <text x="106" y="1043" class="body-bold" font-size="33">1 Sajak</text>
  <path d="M106 1057 q40 15 92 0" fill="none" stroke="${COLORS.yellow}" stroke-width="10" stroke-linecap="round"/>

  ${addLines("Bawa satu sajak.\nSimpan tiket ini dan\ntunjukkan identitas saat datang.", 566, 1010, 34, "hand")}

  ${van}

  <text x="814" y="1153" text-anchor="middle" class="hand" font-size="27">satu sajak</text>
  <text x="814" y="1187" text-anchor="middle" class="hand" font-size="27">untuk satu pintu masuk.</text>

  <path d="M104 1318 h872" stroke="${COLORS.navy}" stroke-opacity=".18" stroke-width="2"/>

  <rect x="64" y="1338" width="952" height="150" fill="${COLORS.navy}"/>
  ${logo}
  <text x="540" y="1451" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="800" letter-spacing="5" fill="${COLORS.cream}">BADAN GIGS NASIONAL</text>
  <text x="540" y="1476" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" letter-spacing="2" fill="${COLORS.cream}" opacity=".78">MANGGUNG BERGIZI GRATIS</text>
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

export function ReservationTicket(props: ReservationTicketProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  async function handleDownload() {
    if (isDownloading) return
    setIsDownloading(true)

    try {
      const [logoDataUrl, vanDataUrl] = await Promise.all([
        assetToDataUrl("/images/icon.png"),
        assetToDataUrl("/mbg-van-transparent.png"),
      ])

      const svg = createTicketSvg(props, logoDataUrl, vanDataUrl)
      const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)

      const image = new Image()
      image.decoding = "async"

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error("Tiket gagal dirender."))
        image.src = svgUrl
      })

      const canvas = document.createElement("canvas")
      canvas.width = 1080
      canvas.height = 1536

      const context = canvas.getContext("2d")
      if (!context) throw new Error("Canvas tidak tersedia.")

      context.drawImage(image, 0, 0)
      URL.revokeObjectURL(svgUrl)

      const png = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png", 0.95),
      )

      if (!png) throw new Error("Tiket gagal dibuat.")
      const safeName = props.name.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")
      await downloadBlob(png, `${props.reservationNumber}-${safeName || "tiket"}.png`)
    } catch (error) {
      console.error("Ticket download error:", error)
      alert("Tiket belum berhasil dibuat. Coba lagi sebentar.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[28px] border-[10px] border-[#223B4D] bg-[#F5F0E6] shadow-[0_18px_50px_rgba(32,52,68,0.18)]">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 flex flex-col justify-around">
          {Array.from({ length: 11 }).map((_, index) => (
            <span key={index} className="size-4 -translate-x-2 rounded-full bg-[#223B4D]" />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 flex flex-col justify-around">
          {Array.from({ length: 11 }).map((_, index) => (
            <span key={index} className="size-4 translate-x-2 rounded-full bg-[#223B4D]" />
          ))}
        </div>

        <div className="relative bg-[radial-gradient(circle_at_15%_20%,rgba(34,59,77,0.06)_0,transparent_20%),radial-gradient(circle_at_80%_45%,rgba(34,59,77,0.05)_0,transparent_24%)] px-6 pb-5 pt-8 sm:px-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="font-heading text-[2.05rem] leading-[0.92] tracking-wide text-[#223B4D] sm:text-[2.8rem]">
                Manggung
                <br />
                Bergizi Gratis
              </p>
              <p className="mt-3 font-hand text-xl italic text-[#223B4D]">intimate shownya Aldy Amis</p>
            </div>
            <div className="shrink-0 rounded-md bg-[#F6EB35] px-3 py-2 font-hand text-lg italic text-[#223B4D]">
              $etor $ajak
            </div>
          </div>

          <div className="my-6 flex items-center gap-3 text-[#223B4D]">
            <span className="h-px flex-1 border-t border-dashed border-[#223B4D]/30" />
            <span className="font-body text-[10px] font-bold uppercase tracking-[0.24em]">
              Tiket Masuk
            </span>
            <span className="h-px flex-1 border-t border-dashed border-[#223B4D]/30" />
          </div>

          <div className="rounded-2xl bg-[#AFC7D2] px-5 py-5 text-center">
            <p className="font-body text-xs font-bold uppercase tracking-[0.28em] text-[#223B4D]/75">
              No. Reservasi
            </p>
            <p className="mt-2 break-all font-heading text-[2.4rem] leading-none tracking-wide text-[#223B4D] sm:text-[3.2rem]">
              {props.reservationNumber}
            </p>
            <div className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full bg-[#223B4D] px-4 py-2 text-xs font-semibold text-[#F5F0E6]">
              <CheckCircle2 className="size-4 text-[#8AC89B]" />
              Reservasi Berhasil Dicatat
            </div>
          </div>

          <div className="mt-6 grid gap-x-7 gap-y-5 sm:grid-cols-2">
            <TicketInfo label="Nama" value={props.name} />
            <TicketInfo label="Kota Acara" value={props.city} />
            <TicketInfo label="Venue" value={props.venue} />
            <TicketInfo label="Tanggal" value={props.date} />
          </div>

          <div className="mt-5 grid gap-5 border-t border-dashed border-[#223B4D]/20 pt-5 sm:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-[#223B4D]/70">
                HTM
              </p>
              <p className="mt-1 font-heading text-3xl text-[#223B4D]">1 Sajak</p>
              <div className="mt-1 h-2 w-24 -rotate-2 rounded-full bg-[#F6EB35]" />
            </div>
            <div className="rounded-xl border-l-4 border-[#F6EB35] bg-white/55 p-4">
              <p className="font-hand text-xl italic leading-snug text-[#223B4D]">
                Bawa satu sajak sebagai tiket masuk.
              </p>
              <p className="mt-2 font-body text-sm leading-relaxed text-[#223B4D]/75">
                Simpan tiket ini dan tunjukkan identitas saat registrasi di venue.
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl bg-[#AFC7D2]/60">
            <img
              src="/mbg-van-transparent.png"
              alt=""
              aria-hidden="true"
              className="mx-auto block w-[82%] object-contain drop-shadow-[0_14px_10px_rgba(34,59,77,0.2)]"
            />
          </div>

          <div className="mt-2 text-center">
            <p className="font-hand text-lg italic text-[#223B4D]">Satu sajak untuk satu pintu masuk.</p>
          </div>
        </div>

        <div className="bg-[#223B4D] px-5 pb-5 pt-4 text-center text-[#F5F0E6]">
          <img src="/images/icon.png" alt="" aria-hidden="true" className="mx-auto size-11 object-contain" />
          <p className="mt-1 font-body text-sm font-extrabold uppercase tracking-[0.24em]">
            Badan Gigs Nasional
          </p>
          <p className="mt-1 font-body text-[10px] uppercase tracking-[0.2em] opacity-75">
            Manggung Bergizi Gratis
          </p>
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

function TicketInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-b border-dashed border-[#223B4D]/20 pb-3">
      <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-[#223B4D]/65">
        {label}
      </p>
      <p className="mt-1 break-words font-body text-base font-semibold leading-snug text-[#223B4D]">
        {value}
      </p>
    </div>
  )
}
