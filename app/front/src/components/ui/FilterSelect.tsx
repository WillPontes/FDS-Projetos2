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
  clearValue?: string;
};

export const FilterSelect = ({
  value,
  onValueChange,
  options,
  placeholder = "Selecione",
  className,
  clearValue = "",
}: FilterSelectProps) => {
  const hasValue = value !== clearValue && value !== "";

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn("w-[180px]", className)}
        clearable
        hasValue={hasValue}
        onClear={() => onValueChange(clearValue)}
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
  );
};
