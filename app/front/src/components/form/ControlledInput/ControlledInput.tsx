import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { FormField, formFieldErrorId } from "@/components/form/FormField";
import { Input } from "@/components/ui/input";
import { fieldControlErrorClassName } from "@/lib/field-control";
import { cn } from "@/lib/utils";

type ControlledInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  type?: "text" | "password" | "number";
  placeholder?: string;
  disabled?: boolean;
};

export const ControlledInput = <T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  disabled,
}: ControlledInputProps<T>) => {
  const id = String(name);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const errorMsg = fieldState.error?.message;
        return (
          <FormField id={id} label={label} error={errorMsg}>
            <Input
              {...field}
              id={id}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={!!errorMsg}
              aria-describedby={errorMsg ? formFieldErrorId(id) : undefined}
              className={cn(errorMsg && fieldControlErrorClassName)}
              value={field.value ?? ""}
              onClear={() => field.onChange("")}
            />
          </FormField>
        );
      }}
    />
  );
};
