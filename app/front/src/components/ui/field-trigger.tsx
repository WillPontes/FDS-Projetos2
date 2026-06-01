import { ChevronDown } from "lucide-react";
import * as React from "react";

import { FieldClearButton, fieldControlClassName } from "@/lib/field-control";
import { cn } from "@/lib/utils";

type FieldTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  showClear?: boolean;
  onClear?: () => void;
};

export const FieldTrigger = React.forwardRef<HTMLButtonElement, FieldTriggerProps>(
  ({ className, children, showClear, onClear, disabled, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={cn(
        fieldControlClassName,
        "relative flex items-center justify-between gap-2 text-left font-normal",
        showClear && "pr-14",
        !showClear && "pr-8",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate text-sm">{children}</span>
      <div className="absolute right-2 flex shrink-0 items-center gap-0.5">
        {showClear && onClear && !disabled ? (
          <FieldClearButton
            onClick={() => onClear()}
            className="static translate-y-0"
          />
        ) : null}
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      </div>
    </button>
  ),
);
FieldTrigger.displayName = "FieldTrigger";
