"use client"

import { useEffect, useState, type FormEvent } from "react"
import { PartyPopper, Loader2 } from "lucide-react"
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
  const [form, setForm] = useState<FormState>(initialForm)

  useEffect(() => {
    function handleOpen(event: Event) {
      const detail = (event as CustomEvent<{ city?: string }>).detail
      setSubmitted(false)
      setForm((prev) => ({ ...initialForm, kotaAcara: detail?.city ?? prev.kotaAcara }))
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)

    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL

    try {
      if (scriptUrl) {
        const payload = new FormData()
        payload.append("timestamp", new Date().toISOString())
        payload.append("namaLengkap", form.namaLengkap)
        payload.append("instagram", form.instagram)
        payload.append("nomorWhatsApp", form.whatsapp)
        payload.append("email", form.email)
        payload.append("kotaAcara", form.kotaAcara)

        await fetch(scriptUrl, {
          method: "POST",
          mode: "no-cors",
          body: payload,
        })
      }
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setSubmitted(false)
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto border-2 border-[#2F3E46]/15 bg-[#EDF2F5] sm:max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#F6EB35]">
              <PartyPopper className="size-8 text-[#2F3E46]" />
            </span>
            <DialogHeader className="items-center gap-2">
              <DialogTitle className="font-heading text-4xl text-[#2F3E46]">Reservasi Berhasil</DialogTitle>
              <DialogDescription className="font-body text-base text-[#2F3E46]/80">
                Terima kasih telah melakukan reservasi.
                <br />
                Jangan lupa membawa satu sajak sebagai tiket masuk acara.
              </DialogDescription>
            </DialogHeader>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 bg-[#F6EB35] font-hand text-[#2F3E46] hover:bg-[#F6EB35]/90"
            >
              Tutup
            </Button>
          </div>
        ) : (
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
                  <FieldLabel htmlFor="kotaAcara">Kota Acara</FieldLabel>
                  <Select
                    value={form.kotaAcara}
                    onValueChange={(value) => setForm((f) => ({ ...f, kotaAcara: value ?? "" }))}
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
