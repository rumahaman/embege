import { NextResponse } from "next/server"

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
    params.append("nomorWhatsApp", nomorWhatsApp)
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
      result = {
        success: response.ok,
        message: text,
      }
    }

    if (!response.ok || result.success === false) {
      throw new Error(
        result.message || "Google Apps Script gagal menerima data."
      )
    }

    return NextResponse.json({
      success: true,
      message: "Reservasi berhasil disimpan.",
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