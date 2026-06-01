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
import { fieldControlErrorClassName } from "@/lib/field-control";
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
  clearValue?: string;
};

export const ControlledSelect = <T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Selecione...",
  disabled,
  clearValue = "",
}: ControlledSelectProps<T>) => {
  const id = String(name);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const errorMsg = fieldState.error?.message;
        const currentValue = field.value ?? clearValue;
        const hasValue =
          currentValue !== clearValue &&
          currentValue !== "" &&
          currentValue != null;

        return (
          <FormField id={id} label={label} error={errorMsg}>
            <Select
              value={String(currentValue)}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={id}
                aria-invalid={!!errorMsg}
                aria-describedby={errorMsg ? formFieldErrorId(id) : undefined}
                className={cn(errorMsg && fieldControlErrorClassName)}
                clearable
                hasValue={hasValue}
                onClear={() => field.onChange(clearValue)}
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
