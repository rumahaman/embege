import { ImageResponse } from "next/og"

export const alt = "Manggung Bergizi Gratis — Badan Gigs Nasional"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#97B4C1",
          color: "#2F3E46",
          padding: "58px 72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              background: "#F6EB35",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            BGN
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 20, lineHeight: 1.1 }}>
            <span>Badan Gigs Nasional</span>
            <span style={{ fontSize: 14, opacity: 0.65, marginTop: 4 }}>Dipersembahkan untuk perjalanan Manggung Bergizi Gratis</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 820 }}>
          <span
            style={{
              fontSize: 82,
              lineHeight: 0.9,
              fontWeight: 800,
              color: "#F6EB35",
              letterSpacing: -2,
            }}
          >
            Manggung Bergizi Gratis
          </span>
          <span style={{ fontSize: 30, marginTop: 12 }}>
            Intimate Show-nya Aldy Amis
          </span>
          <span style={{ fontSize: 20, opacity: 0.75, marginTop: 4 }}>
            15 Okt Tangerang · 16 Okt Cirebon · 17 Okt Yogyakarta · 18 Okt Malang
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              padding: "12px 18px",
              background: "#F6EB35",
              border: "2px dashed #2F3E46",
              transform: "rotate(-4deg)",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            $etor $ajak
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", fontSize: 18 }}>
            <span style={{ fontWeight: 700 }}>Empat kota, satu perjalanan.</span>
            <span style={{ opacity: 0.7, marginTop: 4 }}>Musik · sajak · ruang temu</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}