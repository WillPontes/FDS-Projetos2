import * as React from "react"

import {
  FieldClearButton,
  fieldControlClassName,
  hasFieldValue,
} from "@/lib/field-control"
import { cn } from "@/lib/utils"

export type InputProps = Omit<React.ComponentProps<"input">, "value"> & {
  clearable?: boolean
  onClear?: () => void
  value?: string | number | readonly string[]
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      clearable = true,
      onClear,
      value,
      disabled,
      readOnly,
      onChange,
      ...props
    },
    ref,
  ) => {
    const showClear =
      clearable &&
      hasFieldValue(value) &&
      !disabled &&
      !readOnly &&
      type !== "password"

    const handleClear = () => {
      if (onClear) {
        onClear()
        return
      }
      onChange?.({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>)
    }

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            fieldControlClassName,
            showClear && "pr-8",
            className,
          )}
          ref={ref}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          onChange={onChange}
          {...props}
        />
        {showClear ? <FieldClearButton onClick={handleClear} /> : null}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }
