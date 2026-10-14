import { NextResponse } from "next/server"
import { callCheckInAppsScript, statusForCheckInPayload } from "@/lib/check-in-backend"
import { getCheckInSession } from "@/lib/check-in-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getCheckInSession()
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Sesi petugas berakhir. Silakan masuk kembali." },
      { status: 401 },
    )
  }

  try {
    const payload = await callCheckInAppsScript({
      action: "checkin_summary",
      staffId: session.staffId,
    })

    // Keep the API response scoped to the venue bound to this signed session.
    const allCities = Array.isArray(payload.cities)
      ? (payload.cities as Array<{ city?: unknown; registered?: unknown; checkedIn?: unknown }>)
      : []
    const citySummary = allCities.filter((item) => item.city === session.city)
    const totalRegistered = citySummary.reduce(
      (sum, item) => sum + (typeof item.registered === "number" ? item.registered : 0),
      0,
    )
    const totalCheckedIn = citySummary.reduce(
      (sum, item) => sum + (typeof item.checkedIn === "number" ? item.checkedIn : 0),
      0,
    )
    const scopedPayload = {
      ...payload,
      totalRegistered,
      totalCheckedIn,
      cities: citySummary,
    }

    return NextResponse.json(scopedPayload, {
      status: statusForCheckInPayload(payload),
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    console.error(
      "Check-in summary error:",
      error instanceof Error ? error.message : "Unknown error",
    )
    return NextResponse.json(
      {
        success: false,
        code: "SERVICE_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Ringkasan kehadiran tidak dapat dimuat.",
      },
      { status: 502 },
    )
  }
}
