import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type MetricCardProps = {
  children: ReactNode
  className?: string
}

export const MetricCard = ({ children, className }: MetricCardProps) => {
  return (
    <div className={cn("card-surface-lg w-full", className)}>{children}</div>
  )
}
