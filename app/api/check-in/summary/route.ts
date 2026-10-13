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

    return NextResponse.json(payload, {
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
