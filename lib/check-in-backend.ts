type AppsScriptPayload = Record<string, unknown>

export async function callCheckInAppsScript(
  fields: Record<string, string>,
): Promise<AppsScriptPayload> {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL
  const apiSecret = process.env.CHECKIN_API_SECRET

  if (!scriptUrl || !apiSecret) {
    throw new Error(
      "Integrasi check-in belum dikonfigurasi. Periksa environment variable Vercel.",
    )
  }

  const params = new URLSearchParams({
    ...fields,
    apiSecret,
  })

  const response = await fetch(scriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: params.toString(),
    cache: "no-store",
    redirect: "follow",
  })

  const responseText = await response.text()
  let payload: AppsScriptPayload

  try {
    payload = JSON.parse(responseText) as AppsScriptPayload
  } catch {
    console.error(
      "Check-in Apps Script returned a non-JSON response.",
      responseText.slice(0, 300),
    )
    throw new Error(
      "Apps Script belum mendukung aksi check-in atau mengembalikan respons yang tidak valid.",
    )
  }

  if (!response.ok) {
    throw new Error("Apps Script tidak dapat memproses permintaan check-in.")
  }

  return payload
}

export function statusForCheckInPayload(payload: AppsScriptPayload) {
  if (payload.success === true) return 200

  switch (payload.code) {
    case "UNAUTHORIZED":
      return 502
    case "NOT_FOUND":
      return 404
    case "WRONG_CITY":
    case "CANCELLED":
      return 409
    case "INVALID_REQUEST":
      return 400
    case "ALREADY_CHECKED_IN":
      return 200
    default:
      return 502
  }
}
