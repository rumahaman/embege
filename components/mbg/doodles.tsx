import { cn } from "@/lib/utils"

export function DoodleStar({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      className={cn("size-6 text-[#F6EB35]", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 3 L23 17 L37 20 L23 23 L20 37 L17 23 L3 20 L17 17 Z" />
    </svg>
  )
}

export function DoodleArrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 60 40"
      className={cn("h-8 w-12 text-[#2F3E46]/60", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 30 C 20 8, 40 8, 54 20" />
      <path d="M44 12 L 56 20 L 46 30" />
    </svg>
  )
}

export function DoodleSquiggle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 20"
      className={cn("h-3 w-24 text-[#F6EB35]", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    >
      <path d="M2 15 C 20 2, 35 2, 50 15 S 80 2, 100 15 S 130 2, 150 15 S 180 2, 198 15" />
    </svg>
  )
}

export function DoodleStamp({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={cn("size-16 text-[#2F3E46]/50", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="50" cy="50" r="42" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="34" />
      <text x="50" y="46" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="font-hand">
        SUDAH
      </text>
      <text x="50" y="60" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="font-hand">
        SINGGAH
      </text>
    </svg>
  )
}
