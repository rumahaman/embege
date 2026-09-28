"use client"

import type { ReactNode } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { OPEN_RESERVATION_EVENT } from "./reservation-events"

type ReservationClientTriggerButtonProps = {
  city: string
  className?: string
  children?: ReactNode
  variant?: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
}

export function ReservationClientTriggerButton({
  city,
  className,
  children,
  variant = "default",
  size = "default",
}: ReservationClientTriggerButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
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
