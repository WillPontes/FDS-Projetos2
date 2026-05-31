import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export const FilterInput = ({ className, ...props }: ComponentProps<typeof Input>) => (
  <Input
    className={cn("h-9 bg-neutral-100 border-neutral-200", className)}
    {...props}
  />
);
