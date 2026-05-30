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
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[220px] bg-neutral-100">
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
