"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  LogOut,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  TicketCheck,
  Users,
  XCircle,
} from "lucide-react"

const CITIES = [
  "Kabupaten Tangerang",
  "Cirebon",
  "Yogyakarta",
  "Malang",
] as const

type City = (typeof CITIES)[number]

type Participant = {
  reservationNumber: string
  name: string
  city: string
  registrationStatus?: string
  checkInStatus?: string
  checkedInAt?: string
  staffId?: string
}

type SearchResult = {
  success: boolean
  code?: string
  message?: string
  participant?: Participant
  participants?: Participant[]
  alreadyCheckedIn?: boolean
  matchCount?: number
  truncated?: boolean
}

type CitySummary = {
  city: string
  registered: number
  checkedIn: number
}

type Summary = {
  success: boolean
  totalRegistered: number
  totalCheckedIn: number
  cities: CitySummary[]
}

async function readJson(response: Response) {
  return (await response.json()) as Record<string, unknown>
}

export default function CheckInPage() {
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [session, setSession] = useState<{ staffId: string; city: City } | null>(null)
  const [pin, setPin] = useState("")
  const [staffId, setStaffId] = useState("")
  const [city, setCity] = useState<City>("Kabupaten Tangerang")
  const [searchQuery, setSearchQuery] = useState("")
  const [result, setResult] = useState<SearchResult | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [summaryError, setSummaryError] = useState("")
  const [loginError, setLoginError] = useState("")
  const [actionError, setActionError] = useState("")
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const loadSummary = useCallback(async () => {
    setRefreshing(true)
    setSummaryError("")
    try {
      const response = await fetch("/api/check-in/summary", {
        cache: "no-store",
      })
      const data = (await response.json().catch(() => null)) as
        | (Summary & { message?: string })
        | null

      if (!response.ok || !data?.success) {
        setSummary(null)
        setSummaryError(
          data?.message ||
            "Gagal memuat ringkasan dari backend. Periksa koneksi lalu tekan Perbarui angka.",
        )
        return
      }

      setSummary(data)
      setSummaryError("")
    } catch {
      setSummary(null)
      setSummaryError(
        "Koneksi ke backend terputus. Angka kehadiran tidak tersedia; coba Perbarui angka.",
      )
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    async function loadSession() {
      try {
        const response = await fetch("/api/check-in/session", {
          cache: "no-store",
        })
        if (!active) return
        if (response.status === 503) {
          setConfigured(false)
          return
        }
        setConfigured(true)
        if (response.ok) {
          const data = (await response.json()) as { staffId: string; city: City }
          if (!CITIES.includes(data.city)) return
          setCity(data.city)
          setSession({ staffId: data.staffId, city: data.city })
          await loadSummary()
        }
      } catch {
        if (active) setConfigured(true)
      }
    }

    void loadSession()
    return () => {
      active = false
    }
  }, [loadSummary])

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setLoginError("")
    try {
      const response = await fetch("/api/check-in/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, staffId, city }),
      })
      const data = (await readJson(response)) as {
        success?: boolean
        staffId?: string
        city?: string
        message?: string
      }

      if (!response.ok || !data.success || !data.staffId || !data.city || !CITIES.includes(data.city as City)) {
        setLoginError(data.message || "Tidak dapat masuk ke panel check-in.")
        return
      }

      setCity(data.city as City)
      setSession({ staffId: data.staffId, city: data.city as City })
      setPin("")
      await loadSummary()
    } catch {
      setLoginError("Koneksi bermasalah. Silakan coba kembali.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSearching(true)
    setActionError("")
    setResult(null)

    const normalized = searchQuery.trim()
    setSearchQuery(normalized)

    try {
      const response = await fetch("/api/check-in/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: session?.city ?? city,
          query: normalized,
        }),
      })
      const data = (await readJson(response)) as SearchResult
      setResult(data)

      if (response.status === 401) {
        setSession(null)
        setActionError("Sesi petugas berakhir. Silakan masuk kembali.")
      } else if (!response.ok && !data.participant) {
        setActionError(data.message || "Reservasi tidak dapat ditemukan.")
      }
    } catch {
      setActionError("Koneksi bermasalah. Jangan menandai peserta secara manual sebagai berhasil.")
    } finally {
      setSearching(false)
    }
  }

  async function handleConfirm() {
    if (!result?.participant) return

    setConfirming(true)
    setActionError("")
    try {
      const response = await fetch("/api/check-in/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: session?.city ?? city,
          reservationNumber: result.participant.reservationNumber,
        }),
      })
      const data = (await readJson(response)) as SearchResult
      setResult(data)

      if (response.status === 401) {
        setSession(null)
        setActionError("Sesi petugas berakhir. Silakan masuk kembali.")
      } else if (!response.ok) {
        setActionError(data.message || "Check-in belum berhasil dicatat.")
      } else if (data.success) {
        setSearchQuery(result.participant.reservationNumber)
        await loadSummary()
      }
    } catch {
      setActionError("Koneksi terputus. Periksa status di daftar utama sebelum mencoba lagi.")
    } finally {
      setConfirming(false)
    }
  }

  async function handleLogout() {
    await fetch("/api/check-in/logout", { method: "POST" })
    setSession(null)
    setResult(null)
    setSummary(null)
    setSearchQuery("")
  }

  const participant = result?.participant
  const alreadyCheckedIn =
    result?.alreadyCheckedIn || participant?.checkInStatus === "SUDAH HADIR"
  const canConfirm =
    result?.success &&
    participant &&
    participant.checkInStatus !== "SUDAH HADIR" &&
    result.code !== "WRONG_CITY" &&
    result.code !== "CANCELLED"

  return (
    <main className="min-h-screen bg-[#EDF2F5] px-3 py-5 text-[#26363E] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-5 flex items-center gap-3 rounded-2xl bg-[#10181D] p-4 text-white shadow-sm sm:p-5">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/70 bg-white p-0.5 shadow-sm">
            <Image
              src="/images/logo-bgn.jpg"
              alt="Logo Badan Gigs Nasional"
              fill
              priority
              sizes="56px"
              className="rounded-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A9C1CC]">
              Badan Gigs Nasional
            </p>
            <h1 className="text-xl font-extrabold sm:text-2xl">MBG Check-in</h1>
            <p className="text-sm text-white/70">Panel khusus petugas venue</p>
          </div>
          {session && (
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold hover:bg-white/10"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          )}
        </header>

        {configured === false && (
          <section className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
            <h2 className="font-bold">Panel belum dikonfigurasi</h2>
            <p className="mt-2 text-sm leading-6">
              Administrator perlu menambahkan environment variable khusus check-in
              di Vercel dan memasang fungsi check-in tambahan pada Apps Script.
              Fitur ini belum terhubung ke data peserta.
            </p>
          </section>
        )}

        {configured !== false && !session && (
          <section className="rounded-2xl border border-[#D7E0E5] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start gap-3">
              <div className="rounded-xl bg-[#E5EEF2] p-3 text-[#35505C]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Masuk sebagai petugas</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Gunakan PIN yang dibagikan koordinator. Masukkan inisial petugas
                  untuk pencatatan audit check-in.
                </p>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Kota venue</span>
                <select
                  value={city}
                  onChange={(event) => setCity(event.target.value as City)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-[#35505C] focus:ring-2 focus:ring-[#A9C1CC]"
                >
                  {CITIES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Inisial petugas</span>
                <input
                  value={staffId}
                  onChange={(event) => setStaffId(event.target.value)}
                  autoComplete="username"
                  minLength={2}
                  maxLength={24}
                  pattern="[A-Za-z0-9._-]{2,24}"
                  placeholder="Contoh: TGR01"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-[#35505C] focus:ring-2 focus:ring-[#A9C1CC]"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">PIN petugas</span>
                <input
                  value={pin}
                  onChange={(event) => setPin(event.target.value)}
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-[#35505C] focus:ring-2 focus:ring-[#A9C1CC]"
                />
              </label>
              {loginError && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                  {loginError}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || configured === null}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173B70] px-4 py-3.5 font-bold text-white hover:bg-[#102E58] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Memeriksa..." : "Masuk ke Check-in"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </section>
        )}

        {configured !== false && session && (
          <>
            <section className="mb-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Petugas aktif
                  </p>
                  <p className="mt-1 font-bold">{session.staffId}</p>
                  <p className="mt-1 text-sm text-slate-600">Venue: <span className="font-semibold text-[#173B70]">{session.city}</span></p>
                </div>
                <button
                  type="button"
                  onClick={() => void loadSummary()}
                  disabled={refreshing}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
                >
                  <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
                  Perbarui angka
                </button>
              </div>
              {summaryError && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800"
                >
                  GAGAL MEMUAT RINGKASAN: {summaryError}
                </p>
              )}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#EDF2F5] p-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users size={16} /> Terdaftar
                  </div>
                  <p className="mt-1 text-2xl font-extrabold">
                    {summary?.totalRegistered ?? "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-[#E6F5E9] p-3">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <ClipboardCheck size={16} /> Sudah hadir
                  </div>
                  <p className="mt-1 text-2xl font-extrabold text-green-900">
                    {summary?.totalCheckedIn ?? "—"}
                  </p>
                </div>
              </div>
              {summary?.cities?.length ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {summary.cities.filter((item) => item.city === session.city).map((item) => (
                    <div
                      key={item.city}
                      className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                      <span className="truncate">{item.city}</span>
                      <span className="shrink-0 font-bold">
                        {item.checkedIn}/{item.registered}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>

            <section className="rounded-2xl border border-[#D7E0E5] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-4">
                <h2 className="text-lg font-extrabold">Verifikasi reservasi</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Cari menggunakan nomor reservasi, nama lengkap, email, atau nomor WhatsApp.
                  Pastikan data peserta cocok sebelum menekan tombol konfirmasi.
                </p>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div className="block">
                  <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                    <MapPin size={16} /> Venue petugas
                  </span>
                  <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold">
                    {session.city}
                  </div>
                  <span className="mt-1.5 block text-xs text-slate-500">
                    Venue terkunci sesuai pilihan saat login. Untuk berpindah kota, keluar lalu login kembali.
                  </span>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">
                    Cari peserta
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value)
                      setResult(null)
                      setActionError("")
                    }}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Nama, nomor reservasi, email, atau WhatsApp"
                    required
                    minLength={2}
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold outline-none focus:border-[#35505C] focus:ring-2 focus:ring-[#A9C1CC]"
                  />
                  <span className="mt-1.5 block text-xs text-slate-500">
                    Nama bisa dicari dengan sebagian kata. Email dan nomor WhatsApp juga bisa digunakan.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={searching || searchQuery.trim().length < 2}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173B70] px-4 py-3.5 font-bold text-white hover:bg-[#102E58] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Search size={18} />
                  {searching ? "Mencari..." : "Cari reservasi"}
                </button>
              </form>

              {actionError && (
                <p role="alert" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  {actionError}
                </p>
              )}

              {result && (
                <div className="mt-5 rounded-xl border border-slate-200 p-4">
                  {result.participants?.length && !participant ? (
                    <div className="space-y-3">
                      <div className="mb-3">
                        <p className="font-bold">Pilih peserta yang sesuai</p>
                        <p className="mt-1 text-sm text-slate-600">
                          Ditemukan {result.matchCount ?? result.participants.length} hasil di venue ini.
                        </p>
                      </div>
                      {result.participants.map((item) => {
                        const cancelled = String(item.registrationStatus || "").toLowerCase() === "dibatalkan"
                        const checkedIn = item.checkInStatus === "SUDAH HADIR"
                        return (
                          <div key={item.reservationNumber} className="rounded-lg border border-slate-200 p-3">
                            <p className="font-bold">{item.name}</p>
                            <p className="mt-0.5 font-mono text-sm text-slate-600">{item.reservationNumber}</p>
                            <p className="mt-1 text-sm text-slate-600">Status: {cancelled ? "Dibatalkan" : checkedIn ? "Sudah check-in" : "Belum hadir"}</p>
                            <button
                              type="button"
                              onClick={() => setResult({
                                success: !cancelled,
                                code: cancelled ? "CANCELLED" : undefined,
                                participant: item,
                                alreadyCheckedIn: checkedIn,
                              })}
                              className="mt-3 w-full rounded-lg border border-[#173B70] px-3 py-2 text-sm font-bold text-[#173B70] hover:bg-[#EDF2F5]"
                            >
                              {cancelled ? "Lihat reservasi dibatalkan" : "Pilih peserta"}
                            </button>
                          </div>
                        )
                      })}
                      {result.truncated && (
                        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                          Hasil dibatasi hingga 10 peserta. Perjelas kata kunci agar peserta yang tepat ditemukan.
                        </p>
                      )}
                    </div>
                  ) : participant ? (
                    <>
                      <div className="mb-3 flex items-start gap-3">
                        <div className="rounded-full bg-[#E5EEF2] p-2 text-[#35505C]">
                          <TicketCheck size={22} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Data reservasi
                          </p>
                          <h3 className="mt-1 break-words text-lg font-extrabold">
                            {participant.name}
                          </h3>
                          <p className="font-mono text-sm text-slate-600">
                            {participant.reservationNumber}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            Kota: <span className="font-semibold text-slate-800">{participant.city}</span>
                          </p>
                        </div>
                      </div>

                      {result.code === "WRONG_CITY" ? (
                        <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                          <MapPin size={18} className="mt-0.5 shrink-0" />
                          Reservasi terdaftar di kota lain. Minta koordinator memeriksa sebelum melanjutkan.
                        </div>
                      ) : result.code === "CANCELLED" ? (
                        <div className="flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-900">
                          <XCircle size={18} className="mt-0.5 shrink-0" />
                          Reservasi ini dibatalkan dan tidak dapat di-check-in.
                        </div>
                      ) : alreadyCheckedIn ? (
                        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-900">
                          <p className="flex items-center gap-2 font-bold">
                            <CheckCircle2 size={18} /> SUDAH CHECK-IN
                          </p>
                          {participant.checkedInAt && (
                            <p className="mt-1 flex items-center gap-2">
                              <Clock3 size={15} /> {participant.checkedInAt}
                            </p>
                          )}
                          {participant.staffId && (
                            <p className="mt-1 text-xs">Petugas: {participant.staffId}</p>
                          )}
                        </div>
                      ) : result.success ? (
                        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                          <p className="flex items-center gap-2 font-bold">
                            <CheckCircle2 size={18} /> Reservasi ditemukan
                          </p>
                          <p className="mt-1">Status pendaftaran: {participant.registrationStatus || "Terdaftar"}</p>
                          <p className="mt-1">Status kehadiran: Belum hadir</p>
                        </div>
                      ) : null}

                      {canConfirm && (
                        <button
                          type="button"
                          onClick={() => void handleConfirm()}
                          disabled={confirming}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3.5 font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <CheckCircle2 size={18} />
                          {confirming ? "Mencatat kehadiran..." : "Konfirmasi check-in"}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex gap-2 text-sm text-slate-700">
                      <XCircle size={19} className="mt-0.5 shrink-0 text-red-700" />
                      {result.message || "Reservasi tidak ditemukan."}
                    </div>
                  )}
                </div>
              )}
            </section>

            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              Jika koneksi bermasalah, jangan menganggap check-in berhasil sebelum
              status terverifikasi. Gunakan daftar cadangan yang disediakan koordinator.
            </p>
          </>
        )}

        <footer className="mt-6 text-center text-xs text-slate-500">
          Manggung Bergizi Gratis · Sistem operasional petugas
        </footer>
      </div>
    </main>
  )
}
