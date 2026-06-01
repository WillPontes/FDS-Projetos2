import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FUEL_TYPE_OPTIONS } from "@/features/dashboard/constants";

type DashboardFuelSelectProps = {
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
};

export const DashboardFuelSelect = ({
  value,
  onValueChange,
}: DashboardFuelSelectProps) => {
  return (
    <Select
      value={value ?? ""}
      onValueChange={(next) => onValueChange(next || undefined)}
    >
      <SelectTrigger
        className="w-[220px]"
        clearable
        hasValue={Boolean(value)}
        onClear={() => onValueChange(undefined)}
      >
        <SelectValue placeholder="Selecionar combustível" />
      </SelectTrigger>
      <SelectContent>
        {FUEL_TYPE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
