"use client"

import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const OPEN_RESERVATION_EVENT = "mbg:open-reservation"

export function openReservationDialog(city?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_RESERVATION_EVENT, { detail: { city } }))
}

export function scrollToReservationLocations() {
  document.getElementById("lokasi-acara")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}

type ReservationTriggerButtonProps = ComponentProps<typeof Button> & {
  city?: string
}

export function ReservationTriggerButton({
  city,
  className,
  children,
  ...props
}: ReservationTriggerButtonProps) {
  return (
    <Button
      type="button"
      onClick={() => {
        if (city) {
          openReservationDialog(city)
        } else {
          scrollToReservationLocations()
        }
      }
      className={cn(
        "bg-[#F6EB35] text-[#2F3E46] hover:bg-[#F6EB35]/90 font-hand text-base",
        className,
      )}
      {...props}
    >
      {children ?? "Reservasi Kehadiran"}
    </Button>
  )
}
