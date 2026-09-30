import type { ReactNode } from "react"
import { buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ReservationClientTriggerButton } from "./reservation-client-trigger-button"

type ReservationTriggerButtonProps = {
  city?: string
  className?: string
  children?: ReactNode
  variant?: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
  disabled?: boolean
}

/**
 * Generic reservation CTAs are normal anchors, so they do not require client JS.
 * Venue-specific CTAs remain a tiny client island because they open the modal.
 */
export function ReservationTriggerButton({
  city,
  className,
  children,
  variant = "default",
  size = "default",
  disabled = false,
}: ReservationTriggerButtonProps) {
  if (!city) {
    return (
      <a
        href="#lokasi-acara"
        className={cn(
          buttonVariants({ variant, size, className }),
          "bg-[#F6EB35] text-[#2F3E46] hover:bg-[#F6EB35]/90 font-hand text-base",
        )}
      >
        {children ?? "Reservasi Kehadiran"}
      </a>
    )
  }

  return (
    <ReservationClientTriggerButton
      city={city}
      className={className}
      variant={variant}
      size={size}
      disabled={disabled}
    >
      {children}
    </ReservationClientTriggerButton>
  )
}
