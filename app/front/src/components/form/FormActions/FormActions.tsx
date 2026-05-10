import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export function FormActions({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex justify-end gap-2 pt-2", className)} {...props} />
}
