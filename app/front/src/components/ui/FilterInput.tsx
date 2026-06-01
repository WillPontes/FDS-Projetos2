import { Input } from "@/components/ui/input";
import type { ComponentProps } from "react";

export const FilterInput = (props: ComponentProps<typeof Input>) => (
  <Input {...props} />
);
