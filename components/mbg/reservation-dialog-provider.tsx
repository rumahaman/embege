"use client"

import { useEffect, useState, type FormEvent } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { venues } from "@/lib/venues"
import { OPEN_RESERVATION_EVENT } from "./reservation-events"

type FormState = {
  namaLengkap: string
  instagram: string
  whatsapp: string
  email: string
  kotaAcara: string
  setuju1: boolean
  setuju2: boolean
}

const initialForm: FormState = {
  namaLengkap: "",
  instagram: "",
  whatsapp: "",
  email: "",
  kotaAcara: "",
  setuju1: false,
  setuju2: false,
}

function normalizeIndonesianWhatsApp(value: string) {
  const cleaned = value.trim().replace(/[\s().-]/g, "")

  if (/^08\d{8,11}$/.test(cleaned)) {
    return cleaned
  }

  if (/^628\d{8,11}$/.test(cleaned)) {
    return `+${cleaned}`
  }

  if (/^\+628\d{8,11}$/.test(cleaned)) {
    return cleaned
  }

  return null
}

export function ReservationDialogProvider() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reservationNumber, setReservationNumber] = useState("")
  const [cityLocked, setCityLocked] = useState(false)
  const [form, setForm] = useState<FormState>(initialForm)

  useEffect(() => {
    function handleOpen(event: Event) {
      const detail = (event as CustomEvent<{ city?: string }>).detail
      setSubmitted(false)
      setReservationNumber("")
      setCityLocked(Boolean(detail?.city))
      setForm({ ...initialForm, kotaAcara: detail?.city ?? "" })
      setOpen(true)
    }
    window.addEventListener(OPEN_RESERVATION_EVENT, handleOpen)
    return () => window.removeEventListener(OPEN_RESERVATION_EVENT, handleOpen)
  }, [])

  const isValid =
    form.namaLengkap.trim().length > 1 &&
    form.instagram.trim().length > 1 &&
    normalizeIndonesianWhatsApp(form.whatsapp) !== null &&
    form.kotaAcara.length > 0 &&
    form.setuju1 &&
    form.setuju2

  const selectedVenue = venues.find((venue) => venue.city === form.kotaAcara)
  const hasEmail = form.email.trim().length > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault()
      if (!isValid || isSubmitting) return
    
      setIsSubmitting(true)
    
      try {
        const response = await fetch("/api/reservasi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            namaLengkap: form.namaLengkap,
            instagram: form.instagram,
            nomorWhatsApp: normalizeIndonesianWhatsApp(form.whatsapp),
            email: form.email,
            kotaAcara: form.kotaAcara,
          }),
        })
    
        const result = await response.json()
    
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Reservasi gagal dikirim.")
        }
    
        setReservationNumber(result.reservationNumber ?? "")
        setSubmitted(true)
      } catch (error) {
        console.error("Reservation error:", error)
        alert(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengirim reservasi."
        )
      } finally {
        setIsSubmitting(false)
      }
    }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setSubmitted(false)
          setReservationNumber("")
          setCityLocked(false)
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto border-2 border-[#2F3E46]/15 bg-[#EDF2F5] text-[#2F3E46] sm:max-w-md">
        {submitted ? (
          hasEmail ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <DialogHeader className="items-center gap-2">
                <DialogTitle className="font-heading text-4xl text-[#2F3E46]">
                  Reservasi Berhasil
                </DialogTitle>
                <DialogDescription className="font-body text-base text-[#2F3E46]/80">
                  Detail reservasi kamu sudah tercatat.
                  <br />
                  Konfirmasi reservasi juga dikirim ke email kamu.
                </DialogDescription>
              </DialogHeader>

              <div className="w-full rounded-2xl bg-[#AFC1CC] px-5 py-4 text-center">
                <p className="font-body text-xs font-bold uppercase tracking-[0.24em] text-[#2F3E46]/65">
                  No. Reservasi
                </p>
                <p className="mt-1 break-all font-heading text-3xl text-[#2F3E46]">
                  {reservationNumber}
                </p>
              </div>

              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-2 bg-[#F6EB35] font-hand text-[#2F3E46] hover:bg-[#F6EB35]/90"
              >
                Tutup
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-5 py-4 text-center">
              <DialogHeader className="items-center gap-2">
                <DialogTitle className="font-heading text-4xl leading-none text-[#2F3E46]">
                  Reservasi Berhasil
                </DialogTitle>
                <DialogDescription className="font-body text-base leading-relaxed text-[#2F3E46]/75">
                  Reservasimu sudah tercatat.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-2xl border border-[#2F3E46]/15 bg-[#AFC1CC] p-5 shadow-sm">
                <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full bg-[#2F3E46] px-4 py-2 font-body text-xs font-semibold text-[#F5F0E6]">
                  <CheckCircle2 className="size-4 text-[#8AC89B]" />
                  TERCATAT
                </div>
                <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-[#2F3E46]/60">
                  No. Reservasi
                </p>
                <p className="mt-2 break-all font-heading text-4xl font-semibold leading-none tracking-wide text-[#2F3E46] sm:text-5xl">
                  {reservationNumber}
                </p>
                <p className="mt-3 font-body text-xs font-medium text-[#2F3E46]/65">
                  Simpan nomor ini untuk registrasi
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#2F3E46]/10 bg-white p-4 text-left sm:grid-cols-2">
                <div>
                  <p className="font-body text-[11px] font-bold uppercase tracking-[0.22em] text-[#2F3E46]/50">
                    Nama
                  </p>
                  <p className="mt-1 font-body text-sm font-semibold leading-snug text-[#2F3E46]">
                    {form.namaLengkap}
                  </p>
                </div>
                <div>
                  <p className="font-body text-[11px] font-bold uppercase tracking-[0.22em] text-[#2F3E46]/50">
                    Kota Acara
                  </p>
                  <p className="mt-1 font-body text-sm font-semibold leading-snug text-[#2F3E46]">
                    {form.kotaAcara}
                  </p>
                </div>
                <div>
                  <p className="font-body text-[11px] font-bold uppercase tracking-[0.22em] text-[#2F3E46]/50">
                    Venue
                  </p>
                  <p className="mt-1 font-body text-sm font-semibold leading-snug text-[#2F3E46]">
                    {selectedVenue?.name ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="font-body text-[11px] font-bold uppercase tracking-[0.22em] text-[#2F3E46]/50">
                    Tanggal
                  </p>
                  <p className="mt-1 font-body text-sm font-semibold leading-snug text-[#2F3E46]">
                    {selectedVenue?.date ?? "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border-l-4 border-[#F6EB35] bg-[#F6EB35]/15 px-4 py-3 text-left">
                <p className="font-hand text-xl italic text-[#2F3E46]">
                  Simpan bukti reservasimu
                </p>
                <p className="mt-1 font-body text-sm leading-relaxed text-[#2F3E46]/75">
                  Screenshot halaman ini sebagai bukti reservasi.
                  <br />
                  Tunjukkan nomor reservasi saat registrasi.
                </p>
              </div>

              <div className="relative rounded-xl border border-[#2F3E46]/10 bg-white/60 px-4 py-3 pr-24 text-left sm:pr-28">
                <div>
                  <p className="font-body text-[11px] font-bold uppercase tracking-[0.24em] text-[#2F3E46]/50">
                    Jangan lupa
                  </p>
                  <p className="mt-1 font-body text-sm leading-relaxed text-[#2F3E46]/75">
                    Bawa <span className="font-hand text-base font-semibold text-[#2F3E46]">1 sajak</span>{" "}
                    sebagai tiket masuk.
                    <br />
                    Tunjukkan identitas saat registrasi.
                  </p>
                </div>
                <div
                  className="absolute right-11 top-1/2 flex size-24 -translate-y-1/2 rotate-[-8deg] items-center justify-center rounded-full border-2 border-dashed border-[#2F3E46]/55 bg-[#F6EB35]/55 text-[#2F3E46]/80 shadow-[0_2px_0_rgba(47,62,70,0.08)]"
                  aria-label="$etor $ajak"
                >
                  <div className="flex size-20 items-center justify-center rounded-full border-2 border-[#2F3E46]/45 text-center">
                    <div className="leading-none">
                      <p className="font-body text-[8px] font-bold uppercase tracking-[0.18em]">
                        1 Sajak
                      </p>
                      <p className="mt-1 font-hand text-[17px] font-semibold italic">
                        $etor $ajak
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full bg-[#F6EB35] font-hand text-lg text-[#2F3E46] hover:bg-[#F6EB35]/90"
              >
                Tutup
              </Button>
            </div>
          )) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-4xl text-[#2F3E46]">Reservasi Kehadiran</DialogTitle>
              <DialogDescription className="font-body text-[#2F3E46]/70">
                1 Reservasi = 1 Orang. Isi datamu untuk ikut perjalanan Manggung Bergizi Gratis.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="mt-2">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="namaLengkap">Nama Lengkap</FieldLabel>
                  <Input
                    id="namaLengkap"
                    required
                    value={form.namaLengkap}
                    onChange={(e) => setForm((f) => ({ ...f, namaLengkap: e.target.value }))}
                    placeholder="Nama sesuai identitas"
                    className="bg-white"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="instagram">Instagram</FieldLabel>
                  <div className="relative">
                    <span
                      className="pointer-events-none absolute inset-y-0 left-3 flex items-center font-body text-sm font-semibold text-[#2F3E46]/70"
                      aria-hidden="true"
                    >
                      @
                    </span>
                    <Input
                      id="instagram"
                      required
                      value={form.instagram.replace(/^@/, "")}
                      onChange={(e) => {
                        const username = e.target.value.replace(/^@+/, "")
                        setForm((f) => ({ ...f, instagram: username ? `@${username}` : "" }))
                      }}
                      placeholder="username"
                      className="bg-white pl-8"
                    />
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="whatsapp">Nomor WhatsApp</FieldLabel>
                  <Input
                    id="whatsapp"
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.whatsapp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9+()\-\s]/g, "")
                      setForm((f) => ({ ...f, whatsapp: value }))
                    }}
                    placeholder="08xx xxxx xxxx atau +628xx xxxx xxxx"
                    title="Masukkan nomor HP Indonesia yang valid, misalnya 081234567890, 6281234567890, atau +6281234567890."
                    className="bg-white"
                    aria-invalid={form.whatsapp.length > 0 && normalizeIndonesianWhatsApp(form.whatsapp) === null}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email (Opsional)</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="nama@email.com"
                    className="bg-white"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="kotaAcara">
                    Kota Acara
                    {cityLocked && (
                      <span className="ml-2 font-normal text-[#2F3E46]/50">(dikunci sesuai pilihan venue)</span>
                    )}
                  </FieldLabel>
                  {cityLocked ? (
                    <Input
                      id="kotaAcara"
                      value={form.kotaAcara}
                      readOnly
                      className="bg-[#F6EB35]/20 font-semibold"
                    />
                  ) : (
                    <Select
                      value={form.kotaAcara}
                      onValueChange={(value) =>
                        setForm((f) => ({ ...f, kotaAcara: value ?? "" }))
                      }
                    >
                      <SelectTrigger id="kotaAcara" className="w-full bg-white">
                        <SelectValue placeholder="Pilih kota acara" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {venues.map((venue) => (
                            <SelectItem key={venue.id} value={venue.city}>
                              {venue.city} — {venue.dateShort}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </Field>

                <Field
                  orientation="horizontal"
                  className="relative rounded-xl border-2 border-[#2F3E46]/25 bg-white px-3 py-3 pr-20 shadow-sm sm:pr-24"
                >
                  <Checkbox
                    id="setuju1"
                    checked={form.setuju1}
                    onCheckedChange={(checked) => setForm((f) => ({ ...f, setuju1: checked === true }))}
                    className="size-5 border-2 border-[#2F3E46] data-checked:border-[#2F3E46] data-checked:bg-[#2F3E46] data-checked:text-[#F6EB35]"
                  />
                  <FieldLabel
                    htmlFor="setuju1"
                    className="font-normal text-[#2F3E46] group-has-[:focus-visible]:text-[#2F3E46]"
                  >
                    Saya memahami bahwa tiket masuk acara ditukar dengan satu sajak.
                  </FieldLabel>

                  <div
                    className="absolute right-2 top-1/2 flex size-[72px] -translate-y-1/2 rotate-[-9deg] items-center justify-center rounded-full border-2 border-dashed border-[#2F3E46]/55 bg-[#F6EB35]/55 text-[#2F3E46]/80 shadow-[0_1px_2px_rgba(47,62,70,0.08)]"
                    aria-label="$etor $ajak"
                  >
                    <div className="flex size-[60px] items-center justify-center rounded-full border-2 border-[#2F3E46]/40 text-center">
                      <div className="leading-none">
                        <p className="font-body text-[7px] font-bold uppercase tracking-[0.14em]">
                          1 Sajak
                        </p>
                        <p className="mt-0.5 font-hand text-[15px] font-semibold italic">
                          $etor $ajak
                        </p>
                      </div>
                    </div>
                  </div>
                </Field>

                <Field
                  orientation="horizontal"
                  className="rounded-xl border-2 border-[#2F3E46]/25 bg-white px-3 py-3 shadow-sm"
                >
                  <Checkbox
                    id="setuju2"
                    checked={form.setuju2}
                    onCheckedChange={(checked) => setForm((f) => ({ ...f, setuju2: checked === true }))}
                    className="size-5 border-2 border-[#2F3E46] data-checked:border-[#2F3E46] data-checked:bg-[#2F3E46] data-checked:text-[#F6EB35]"
                  />
                  <FieldLabel
                    htmlFor="setuju2"
                    className="font-normal text-[#2F3E46] group-has-[:focus-visible]:text-[#2F3E46]"
                  >
                    Saya bersedia menunjukkan identitas saat registrasi acara.
                  </FieldLabel>
                </Field>

                <FieldDescription className="text-center text-[#2F3E46]/60">
                  1 Reservasi = 1 Orang
                </FieldDescription>

                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full bg-[#F6EB35] font-hand text-lg text-[#2F3E46] hover:bg-[#F6EB35]/90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Reservasi"
                  )}
                </Button>
              </FieldGroup>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
