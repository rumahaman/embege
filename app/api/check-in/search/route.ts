import { NextRequest, NextResponse } from "next/server"
import { callCheckInAppsScript, statusForCheckInPayload } from "@/lib/check-in-backend"
import { getCheckInSession } from "@/lib/check-in-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ALLOWED_CITIES = new Set([
  "Kabupaten Tangerang",
  "Cirebon",
  "Yogyakarta",
  "Malang",
])

export async function POST(request: NextRequest) {
  const session = await getCheckInSession()
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Sesi petugas berakhir. Silakan masuk kembali." },
      { status: 401 },
    )
  }

  try {
    const body = (await request.json()) as {
      city?: unknown
      reservationNumber?: unknown
    }

    const requestedCity = typeof body.city === "string" ? body.city.trim() : ""
    const city = session.city
    const reservationNumber =
      typeof body.reservationNumber === "string"
        ? body.reservationNumber.trim().toUpperCase()
        : ""

    if (requestedCity !== city) {
      return NextResponse.json(
        {
          success: false,
          code: "WRONG_CITY",
          message: "Sesi petugas terkunci ke venue yang dipilih saat login. Keluar dan login kembali untuk berpindah kota.",
        },
        { status: 409 },
      )
    }

    if (
      !ALLOWED_CITIES.has(city) ||
      !/^MBG-(TGR|CBR|YGY|MLG)-\d{3,}$/.test(reservationNumber)
    ) {
      return NextResponse.json(
        {
          success: false,
          code: "INVALID_REQUEST",
          message: "Pilih kota dan masukkan nomor reservasi dengan format yang benar.",
        },
        { status: 400 },
      )
    }

    const payload = await callCheckInAppsScript({
      action: "checkin_search",
      city,
      reservationNumber,
      staffId: session.staffId,
    })

    return NextResponse.json(payload, {
      status: statusForCheckInPayload(payload),
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    console.error(
      "Check-in search error:",
      error instanceof Error ? error.message : "Unknown error",
    )
    return NextResponse.json(
      {
        success: false,
        code: "SERVICE_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Gagal mencari reservasi. Periksa koneksi dan coba lagi.",
      },
      { status: 502 },
    )
  }
}
