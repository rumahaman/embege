import { NextResponse } from "next/server"
import { CHECKIN_COOKIE_NAME } from "@/lib/check-in-auth"

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set({
    name: CHECKIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  })
  return response
}
