import { NextResponse } from "next/server"

function normalizeIndonesianWhatsApp(value: string) {
  const cleaned = value.trim().replace(/[\s().-]/g, "")

  if (/^08\d{8,11}$/.test(cleaned)) return cleaned
  if (/^628\d{8,11}$/.test(cleaned)) return `+${cleaned}`
  if (/^\+628\d{8,11}$/.test(cleaned)) return cleaned

  return null
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

    if (!namaLengkap || !instagram || !nomorWhatsApp || !kotaAcara) {
      return NextResponse.json(
        {
          success: false,
          message: "Data wajib belum lengkap.",
        },
        { status: 400 }
      )
    }

    const normalizedWhatsApp = normalizeIndonesianWhatsApp(String(nomorWhatsApp))

    if (!normalizedWhatsApp) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nomor WhatsApp tidak valid. Gunakan format 08…, 628…, atau +628….",
        },
        { status: 400 }
      )
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL

    if (!scriptUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Konfigurasi Google Apps Script belum tersedia.",
        },
        { status: 500 }
      )
    }

    const params = new URLSearchParams()

    params.append("timestamp", new Date().toISOString())
    params.append("namaLengkap", namaLengkap)
    params.append("instagram", instagram)
    params.append("nomorWhatsApp", normalizedWhatsApp)
    params.append("email", email || "")
    params.append("kotaAcara", kotaAcara)

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: params.toString(),
      cache: "no-store",
    })

    const text = await response.text()

let result

try {
  result = JSON.parse(text)
} catch {
  console.error("Unexpected Apps Script response:", text)

  return NextResponse.json(
    {
      success: false,
      message:
        "Google Apps Script tidak mengembalikan respons yang valid. Periksa kembali deployment Web App dan aksesnya.",
    },
    { status: 502 }
  )
}

    const responseCode = String(result.code ?? result.status ?? "").toUpperCase()
    const soldOut =
      result.soldOut === true ||
      responseCode === "SOLD_OUT" ||
      responseCode === "QUOTA_FULL"

    if (!response.ok || result.success === false) {
      return NextResponse.json(
        {
          success: false,
          soldOut,
          code: soldOut ? "SOLD_OUT" : "RESERVATION_ERROR",
          message:
            result.message ||
            (soldOut
              ? "Kuota kota ini sudah penuh."
              : "Google Apps Script gagal menerima data."),
        },
        { status: soldOut ? 409 : 502 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Reservasi berhasil disimpan.",
      reservationNumber: result.reservationNumber ?? "",
    })
  } catch (error) {
    console.error("Reservation API error:", error)

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    )
  }
}