import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type DriverScreenProps = {
  children: ReactNode
  className?: string
}

export const DriverScreen = ({ children, className }: DriverScreenProps) => {
  return (
    <div
      className={cn(
        "driver-screen absolute inset-0 flex flex-col items-center overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  )
}
