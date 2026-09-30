import { NextResponse } from "next/server"

type AppsScriptResult = {
  success?: boolean
  message?: string
  code?: string
  reservationNumber?: string
  emailSent?: boolean
  kotaAcara?: string
  remainingQuota?: number | null
  quotaStatus?: string | null
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

function getErrorStatus(code?: string) {
  switch (code) {
    case "INVALID_CITY":
      return 400

    case "RESERVATION_CLOSED":
      return 403

    case "SOLD_OUT":
      return 409

    case "QUOTA_CONFIG_ERROR":
      return 500

    default:
      return 500
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      namaLengkap,
      instagram,
      nomorWhatsApp,
      email,
      kotaAcara,
    } = body

    // =========================================
    // VALIDASI DATA WAJIB
    // =========================================

    if (
      !namaLengkap ||
      !instagram ||
      !nomorWhatsApp ||
      !kotaAcara
    ) {
      return NextResponse.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          message: "Data wajib belum lengkap.",
        },
        { status: 400 }
      )
    }

    // =========================================
    // VALIDASI WHATSAPP
    // =========================================

    const normalizedWhatsApp =
      normalizeIndonesianWhatsApp(
        String(nomorWhatsApp)
      )

    if (!normalizedWhatsApp) {
      return NextResponse.json(
        {
          success: false,
          code: "INVALID_WHATSAPP",
          message:
            "Nomor WhatsApp tidak valid. Gunakan format 08…, 628…, atau +628….",
        },
        { status: 400 }
      )
    }

    // =========================================
    // APPS SCRIPT URL
    // =========================================

    const scriptUrl =
      process.env.GOOGLE_APPS_SCRIPT_URL

    if (!scriptUrl) {
      return NextResponse.json(
        {
          success: false,
          code: "CONFIG_ERROR",
          message:
            "Konfigurasi Google Apps Script belum tersedia.",
        },
        { status: 500 }
      )
    }

    // =========================================
    // SIAPKAN DATA UNTUK APPS SCRIPT
    // =========================================

    const params = new URLSearchParams()

    params.append(
      "timestamp",
      new Date().toISOString()
    )

    params.append(
      "namaLengkap",
      String(namaLengkap)
    )

    params.append(
      "instagram",
      String(instagram)
    )

    params.append(
      "nomorWhatsApp",
      normalizedWhatsApp
    )

    params.append(
      "email",
      email ? String(email) : ""
    )

    params.append(
      "kotaAcara",
      String(kotaAcara)
    )

    // =========================================
    // KIRIM KE APPS SCRIPT
    // =========================================

    const response = await fetch(
      scriptUrl,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: params.toString(),
        cache: "no-store",
        redirect: "follow",
      }
    )

    const text = await response.text()

    // =========================================
    // PARSE RESPONSE APPS SCRIPT
    // =========================================

    let result: AppsScriptResult

    try {
      result = JSON.parse(text)
    } catch {
      console.error(
        "Unexpected Apps Script response:",
        text
      )

      return NextResponse.json(
        {
          success: false,
          code: "INVALID_APPS_SCRIPT_RESPONSE",
          message:
            "Google Apps Script tidak mengembalikan respons yang valid. Periksa kembali deployment Web App dan aksesnya.",
        },
        { status: 502 }
      )
    }

    // =========================================
    // HANDLE ERROR DARI APPS SCRIPT
    // =========================================

    if (
      !response.ok ||
      result.success === false
    ) {
      const code =
        result.code ||
        "RESERVATION_ERROR"

      const status =
        getErrorStatus(code)

      let message =
        result.message ||
        "Reservasi gagal dikirim."

      // Pesan khusus untuk SOLD OUT
      if (code === "SOLD_OUT") {
        message =
          `Kuota ${kotaAcara} sudah penuh. Silakan pilih kota lain.`
      }

      // Pesan khusus reservasi ditutup
      if (
        code ===
        "RESERVATION_CLOSED"
      ) {
        message =
          "Reservasi sedang ditutup. Silakan coba lagi nanti."
      }

      return NextResponse.json(
        {
          success: false,
          code,
          message,
        },
        { status }
      )
    }

    // =========================================
    // RESERVASI BERHASIL
    // =========================================

    return NextResponse.json({
      success: true,

      message:
        "Reservasi berhasil disimpan.",

      reservationNumber:
        result.reservationNumber ?? "",

      emailSent:
        result.emailSent ?? false,

      kotaAcara:
        result.kotaAcara ??
        kotaAcara,

      remainingQuota:
        result.remainingQuota ??
        null,

      quotaStatus:
        result.quotaStatus ??
        null,
    })
  } catch (error) {
    console.error(
      "Reservation API error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        code: "SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    )
  }
}