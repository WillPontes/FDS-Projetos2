import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REGION_OPTIONS } from "@/features/reports/constants";

type ReportsRegionSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export const ReportsRegionSelect = ({
  value,
  onValueChange,
}: ReportsRegionSelectProps) => {
  const hasValue = value !== "" && value !== "all";

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className="w-[220px]"
        clearable
        hasValue={hasValue}
        onClear={() => onValueChange("all")}
      >
        <SelectValue placeholder="Região" />
      </SelectTrigger>
      <SelectContent>
        {REGION_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
