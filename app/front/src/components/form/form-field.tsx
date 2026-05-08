import type { ReactNode } from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/** Stable id for `aria-describedby` on the control — pair with {@link FormField}. */
export function formFieldErrorId(fieldId: string) {
  return `${fieldId}-form-error`
}

type FormFieldProps = {
  id: string
  label: string
  error?: string
  className?: string
  children: ReactNode
}

/**
 * Layout + label + error message for a single form control.
 * Pass `aria-invalid` and `aria-describedby={formFieldErrorId(id)}` on the control when `error` is set.
 */
export function FormField({ id, label, error, className, children }: FormFieldProps) {
  const errId = error ? formFieldErrorId(id) : undefined
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <span id={errId} role="alert" className="text-xs text-destructive">
          {error}
        </span>
      ) : null}
    </div>
  )
}
