import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface SelectOption {
  label: string
  value: string
}

interface ControlledSelectProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}

export function ControlledSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Selecione...",
  disabled,
}: ControlledSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={String(name)}>{label}</Label>
          <Select value={field.value ?? ""} onValueChange={field.onChange} disabled={disabled}>
            <SelectTrigger
              id={String(name)}
              className={cn(fieldState.error && "border-destructive focus:ring-destructive")}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.error && (
            <span className="text-xs text-destructive">{fieldState.error.message}</span>
          )}
        </div>
      )}
    />
  )
}
