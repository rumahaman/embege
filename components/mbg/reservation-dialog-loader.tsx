"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { OPEN_RESERVATION_EVENT } from "./reservation-events"

const ReservationDialogProvider = dynamic(
  () =>
    import("./reservation-dialog-provider").then(
      (module) => module.ReservationDialogProvider,
    ),
  { ssr: false },
)

export function ReservationDialogLoader() {
  const [requestedCity, setRequestedCity] = useState<string>()
  const [dialogLoaded, setDialogLoaded] = useState(false)

  useEffect(() => {
    function handleOpen(event: Event) {
      const detail = (event as CustomEvent<{ city?: string }>).detail
      setRequestedCity(detail?.city)
      setDialogLoaded(true)
    }

    window.addEventListener(OPEN_RESERVATION_EVENT, handleOpen)
    return () => window.removeEventListener(OPEN_RESERVATION_EVENT, handleOpen)
  }, [])

  if (!dialogLoaded) return null

  return <ReservationDialogProvider initialCity={requestedCity} />
}
