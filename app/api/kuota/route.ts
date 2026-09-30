import { NextResponse } from "next/server"

export async function GET() {
  try {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL

    if (!scriptUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "GOOGLE_APPS_SCRIPT_URL belum dikonfigurasi",
        },
        { status: 500 }
      )
    }

    const url = new URL(scriptUrl)
    url.searchParams.set("action", "quota")

    const response = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
    })

    const text = await response.text()

    let data: unknown

    try {
      data = JSON.parse(text)
    } catch {
      console.error(
        "Google Apps Script tidak mengembalikan JSON:",
        text.slice(0, 1000)
      )

      return NextResponse.json(
        {
          success: false,
          message:
            "Google Apps Script tidak mengembalikan JSON yang valid.",
        },
        { status: 502 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Google Apps Script mengembalikan HTTP error.",
        },
        { status: 502 }
      )
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error("Quota API error:", error)

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data kuota",
      },
      { status: 500 }
    )
  }
}