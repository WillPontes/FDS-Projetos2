import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { FormField, formFieldErrorId } from "@/components/form/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SelectOption = {
  label: string;
  value: string;
};

type ControlledSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
};

export const ControlledSelect = <T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Selecione...",
  disabled,
}: ControlledSelectProps<T>) => {
  const id = String(name);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const errorMsg = fieldState.error?.message;
        return (
          <FormField id={id} label={label} error={errorMsg}>
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={id}
                aria-invalid={!!errorMsg}
                aria-describedby={errorMsg ? formFieldErrorId(id) : undefined}
                className={cn(
                  errorMsg && "border-destructive focus:ring-destructive",
                )}
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
          </FormField>
        );
      }}
    />
  );
};
