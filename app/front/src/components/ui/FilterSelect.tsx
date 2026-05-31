import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FilterSelectOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: FilterSelectOption[];
  placeholder?: string;
  className?: string;
};

export const FilterSelect = ({
  value,
  onValueChange,
  options,
  placeholder = "Selecione",
  className,
}: FilterSelectProps) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className={cn("h-9 w-[180px] bg-neutral-100 border-neutral-200", className)}>
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
);
