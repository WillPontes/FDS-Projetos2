import { X } from "lucide-react";
import type { MouseEvent } from "react";

import { cn } from "@/lib/utils";

export const fieldControlClassName = cn(
  "h-9 w-full rounded-md border-0 bg-neutral-100 px-3 text-sm",
  "text-foreground placeholder:text-muted-foreground",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-0",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

export const fieldControlErrorClassName =
  "focus-visible:outline-destructive aria-invalid:outline-destructive";

type FieldClearButtonProps = {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  "aria-label"?: string;
};

export function FieldClearButton({
  onClick,
  className,
  "aria-label": ariaLabel = "Limpar",
}: FieldClearButtonProps) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.stopPropagation();
        onClick(event);
      }}
      className={cn(
        "absolute right-2 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-sm text-neutral-400 hover:text-neutral-700",
        className,
      )}
    >
      <X className="h-3.5 w-3.5" />
    </button>
  );
}

export function hasFieldValue(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}
