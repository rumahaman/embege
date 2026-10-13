import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

export const CHECKIN_COOKIE_NAME = "mbg_checkin_session"
export const CHECKIN_SESSION_MAX_AGE = 60 * 60 * 12

export type CheckInSession = {
  staffId: string
  exp: number
}

function sessionSecret() {
  const secret = process.env.CHECKIN_SESSION_SECRET
  if (!secret) throw new Error("CHECKIN_SESSION_SECRET belum dikonfigurasi.")
  return secret
}

export function timingSafeStringEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest()
  const rightHash = createHash("sha256").update(right).digest()
  return timingSafeEqual(leftHash, rightHash)
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url")
}

export function createCheckInSessionToken(staffId: string) {
  const payload = Buffer.from(
    JSON.stringify({
      staffId,
      exp: Math.floor(Date.now() / 1000) + CHECKIN_SESSION_MAX_AGE,
    }),
  ).toString("base64url")

  return `${payload}.${sign(payload)}`
}

export function verifyCheckInSessionToken(token?: string): CheckInSession | null {
  if (!token) return null

  try {
    const separator = token.lastIndexOf(".")
    if (separator <= 0) return null

    const payload = token.slice(0, separator)
    const signature = token.slice(separator + 1)
    if (!timingSafeStringEqual(signature, sign(payload))) return null

    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Partial<CheckInSession>

    if (
      typeof decoded.staffId !== "string" ||
      !/^[A-Za-z0-9._-]{2,24}$/.test(decoded.staffId) ||
      typeof decoded.exp !== "number" ||
      decoded.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null
    }

    return { staffId: decoded.staffId, exp: decoded.exp }
  } catch {
    return null
  }
}

export async function getCheckInSession() {
  const store = await cookies()
  return verifyCheckInSessionToken(
    store.get(CHECKIN_COOKIE_NAME)?.value,
  )
}

export function isCheckInServerConfigured() {
  return Boolean(
    process.env.CHECKIN_STAFF_PIN &&
    process.env.CHECKIN_SESSION_SECRET &&
    process.env.CHECKIN_API_SECRET &&
    process.env.GOOGLE_APPS_SCRIPT_URL,
  )
}
