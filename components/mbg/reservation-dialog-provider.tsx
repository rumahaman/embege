"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
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
import { OPEN_RESERVATION_EVENT } from "./reservation-trigger-button"

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
    form.whatsapp.trim().length > 6 &&
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
            nomorWhatsApp: form.whatsapp,
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
            <div className="flex flex-col gap-5 py-5 text-center">
              <DialogHeader className="items-center gap-2">
                <DialogTitle className="font-heading text-4xl text-[#2F3E46]">
                  Reservasi Berhasil
                </DialogTitle>
                <DialogDescription className="font-body text-base leading-relaxed text-[#2F3E46]/80">
                  Reservasimu sudah tercatat.
                  <br />
                  <span className="font-semibold text-[#2F3E46]">
                    Disarankan screenshot halaman ini
                  </span>{" "}
                  sebagai bukti reservasi.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-2xl border-2 border-[#2F3E46]/15 bg-[#AFC1CC] px-5 py-6 text-center">
                <p className="font-body text-xs font-bold uppercase tracking-[0.28em] text-[#2F3E46]/65">
                  No. Reservasi
                </p>
                <p className="mt-2 break-all font-heading text-4xl font-semibold tracking-wide text-[#2F3E46]">
                  {reservationNumber}
                </p>
              </div>

              <p className="font-body text-sm leading-relaxed text-[#2F3E46]/70">
                Simpan nomor ini dan tunjukkan saat registrasi di venue.
                <br />
                Jangan lupa membawa satu sajak sebagai tiket masuk.
              </p>

              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full bg-[#F6EB35] font-hand text-lg text-[#2F3E46] hover:bg-[#F6EB35]/90"
              >
                Tutup
              </Button>
            </div>
          )        ) : (
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
                  <Input
                    id="instagram"
                    required
                    value={form.instagram}
                    onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
                    placeholder="@username"
                    className="bg-white"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="whatsapp">Nomor WhatsApp</FieldLabel>
                  <Input
                    id="whatsapp"
                    required
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                    placeholder="08xx xxxx xxxx"
                    className="bg-white"
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

                <Field orientation="horizontal">
                  <Checkbox
                    id="setuju1"
                    checked={form.setuju1}
                    onCheckedChange={(checked) => setForm((f) => ({ ...f, setuju1: checked === true }))}
                  />
                  <FieldLabel htmlFor="setuju1" className="font-normal">
                    Saya memahami bahwa tiket masuk acara ditukar dengan satu sajak sesuai konsep{" "}
                    <span className="font-hand">$etor $ajak</span>.
                  </FieldLabel>
                </Field>

                <Field orientation="horizontal">
                  <Checkbox
                    id="setuju2"
                    checked={form.setuju2}
                    onCheckedChange={(checked) => setForm((f) => ({ ...f, setuju2: checked === true }))}
                  />
                  <FieldLabel htmlFor="setuju2" className="font-normal">
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
