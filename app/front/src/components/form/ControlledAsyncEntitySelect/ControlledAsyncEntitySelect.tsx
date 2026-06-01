import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  AsyncEntitySelect,
  type AsyncEntitySelectProps,
} from "@/components/form/AsyncEntitySelect";
import {
  FormField,
} from "@/components/form/FormField";
import { fieldControlErrorClassName } from "@/lib/field-control";
import { cn } from "@/lib/utils";

type ControlledAsyncEntitySelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TEntity,
> = Omit<
  AsyncEntitySelectProps<TEntity>,
  "value" | "onChange"
> & {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
};

export function ControlledAsyncEntitySelect<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TEntity,
>({
  control,
  name,
  label,
  className,
  ...selectProps
}: ControlledAsyncEntitySelectProps<TFieldValues, TName, TEntity>) {
  const id = String(name);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const errorMsg = fieldState.error?.message;
        return (
          <FormField id={id} label={label} error={errorMsg}>
            <AsyncEntitySelect
              {...selectProps}
              value={field.value}
              onChange={field.onChange}
              disabled={selectProps.disabled}
              className={cn(errorMsg && fieldControlErrorClassName, className)}
            />
          </FormField>
        );
      }}
    />
  );
}
