import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type GestorPageShellProps = {
  title: string
  description?: string
  actions?: ReactNode
  hero?: boolean
  children: ReactNode
  className?: string
}

export const GestorPageShell = ({
  title,
  description,
  actions,
  hero = false,
  children,
  className,
}: GestorPageShellProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={hero ? "page-title-hero" : "page-title"}>{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  )
}
