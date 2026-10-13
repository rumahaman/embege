import { NextRequest, NextResponse } from "next/server"
import {
  CHECKIN_COOKIE_NAME,
  CHECKIN_SESSION_MAX_AGE,
  createCheckInSessionToken,
  isCheckInServerConfigured,
  timingSafeStringEqual,
} from "@/lib/check-in-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    if (!isCheckInServerConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Panel check-in belum dikonfigurasi. Hubungi administrator.",
        },
        { status: 503 },
      )
    }

    const body = (await request.json()) as {
      pin?: unknown
      staffId?: unknown
    }

    const pin = typeof body.pin === "string" ? body.pin : ""
    const staffId =
      typeof body.staffId === "string"
        ? body.staffId.trim()
        : ""

    if (!/^[A-Za-z0-9._-]{2,24}$/.test(staffId) || !pin) {
      return NextResponse.json(
        {
          success: false,
          message: "Masukkan PIN dan inisial petugas yang valid.",
        },
        { status: 400 },
      )
    }

    const expectedPin = process.env.CHECKIN_STAFF_PIN || ""
    if (!timingSafeStringEqual(pin, expectedPin)) {
      return NextResponse.json(
        { success: false, message: "PIN petugas tidak sesuai." },
        { status: 401 },
      )
    }

    const response = NextResponse.json({
      success: true,
      staffId,
    })

    response.cookies.set({
      name: CHECKIN_COOKIE_NAME,
      value: createCheckInSessionToken(staffId),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: CHECKIN_SESSION_MAX_AGE,
    })

    return response
  } catch (error) {
    console.error(
      "Check-in login error:",
      error instanceof Error ? error.message : "Unknown error",
    )
    return NextResponse.json(
      { success: false, message: "Login gagal. Silakan coba kembali." },
      { status: 500 },
    )
  }
}
