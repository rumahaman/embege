"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { OPEN_RESERVATION_EVENT } from "./reservation-events"

type ReservationClientTriggerButtonProps = {
  city: string
  className?: string
  children?: React.ReactNode
}

export function ReservationClientTriggerButton({
  city,
  className,
  children,
}: ReservationClientTriggerButtonProps) {
  return (
    <Button
      type="button"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent(OPEN_RESERVATION_EVENT, { detail: { city } }),
        )
      }}
      className={cn(
        "bg-[#F6EB35] text-[#2F3E46] hover:bg-[#F6EB35]/90 font-hand text-base",
        className,
      )}
    >
      {children ?? "Reservasi"}
    </Button>
  )
}
