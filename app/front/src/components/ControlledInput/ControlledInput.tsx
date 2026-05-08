import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type ControlledInputProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  type?: "text" | "password" | "number"
  placeholder?: string
  disabled?: boolean
}

export const ControlledInput = <T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  disabled,
}: ControlledInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={String(name)}>{label}</Label>
          <Input
            {...field}
            id={String(name)}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
            value={field.value ?? ""}
          />
          {fieldState.error && (
            <span className="text-xs text-destructive">{fieldState.error.message}</span>
          )}
        </div>
      )}
    />
  )
}
