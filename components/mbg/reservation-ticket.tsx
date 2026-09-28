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

async function blobToDataUrl(blob: Blob) {
  return await new Promise<string | null>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null)
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(blob)
  })
}

async function inlineImages(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll("img"))

  await Promise.all(
    images.map(async (img) => {
      const src = img.getAttribute("src")
      if (!src || src.startsWith("data:")) return

      try {
        const absoluteUrl = new URL(src, window.location.href).href
        const response = await fetch(absoluteUrl, { credentials: "same-origin" })
        if (!response.ok) return

        const dataUrl = await blobToDataUrl(await response.blob())
        if (dataUrl) img.setAttribute("src", dataUrl)
      } catch {
        // Keep the original source as a fallback.
      }
    }),
  )
}

function collectDocumentStyles() {
  let css = ""

  for (const sheet of Array.from(document.styleSheets)) {
    try {
      css += Array.from(sheet.cssRules)
        .map((rule) => rule.cssText)
        .join("\n")
    } catch {
      // Ignore stylesheets that the browser does not expose to CSSOM.
    }
  }

  return css
}

async function waitForFonts() {
  if ("fonts" in document) {
    try {
      await document.fonts.ready
    } catch {
      // Continue with the browser font fallback.
    }
  }
}

async function elementToPng(root: HTMLElement) {
  await waitForFonts()

  const clone = root.cloneNode(true) as HTMLElement
  clone.style.transform = "none"
  clone.style.transformOrigin = "top left"
  clone.style.position = "relative"
  clone.style.left = "0"
  clone.style.top = "0"
  clone.style.width = `${TICKET_WIDTH}px`
  clone.style.height = `${TICKET_HEIGHT}px`
  clone.style.margin = "0"

  await inlineImages(clone)

  const styleText = collectDocumentStyles()
  const serialized = new XMLSerializer().serializeToString(clone)

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="${TICKET_WIDTH}" height="${TICKET_HEIGHT}" viewBox="0 0 ${TICKET_WIDTH} ${TICKET_HEIGHT}">
  <defs>
    <style><![CDATA[
${styleText}
    ]]></style>
  </defs>
  <foreignObject x="0" y="0" width="${TICKET_WIDTH}" height="${TICKET_HEIGHT}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width:${TICKET_WIDTH}px;height:${TICKET_HEIGHT}px;overflow:hidden;">
      ${serialized}
    </div>
  </foreignObject>
</svg>`

  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  try {
    const image = new Image()
    image.decoding = "async"
    image.src = url

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error("Tiket gagal dirender."))
    })

    const canvas = document.createElement("canvas")
    canvas.width = TICKET_WIDTH
    canvas.height = TICKET_HEIGHT

    const context = canvas.getContext("2d")
    if (!context) throw new Error("Canvas tidak tersedia.")

    context.clearRect(0, 0, TICKET_WIDTH, TICKET_HEIGHT)
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

function TicketInfo({
  label,
  value,
}: {
  label: string
  value: string
}) {
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
            className="absolute bottom-[-6px] left-[5%] w-[72%] object-contain drop-shadow-[0_20px_13px_rgba(34,59,77,0.23)]"
          />

          <div className="absolute right-[4%] top-[33%] w-[27%]">
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

export function ReservationTicket({
  reservationNumber,
  name,
  city,
  venue,
  date,
}: ReservationTicketProps) {
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
    if (isDownloading || !ticketRef.current) return
    setIsDownloading(true)

    try {
      const png = await elementToPng(ticketRef.current)
      const safeName = name.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")
      await downloadBlob(
        png,
        `${reservationNumber}-${safeName || "tiket"}.png`,
      )
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
        <TicketVisual
          reservationNumber={reservationNumber}
          name={name}
          city={city}
          venue={venue}
          date={date}
          innerRef={ticketRef}
        />
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
