import { NextResponse } from "next/server"
import { getCheckInSession, isCheckInServerConfigured } from "@/lib/check-in-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!isCheckInServerConfigured()) {
    return NextResponse.json(
      { success: false, configured: false },
      { status: 503 },
    )
  }

  const session = await getCheckInSession()
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  return NextResponse.json({
    success: true,
    staffId: session.staffId,
    expiresAt: session.exp,
  })
}
