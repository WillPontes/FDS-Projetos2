import { cn } from "@/lib/utils";
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
    <div className="flex items-center gap-1">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn("w-[220px] bg-neutral-100")}>
          <SelectValue
            placeholder="Selecionar combustível"
            className="text-muted-foreground"
          />
        </SelectTrigger>
        <SelectContent>
          {FUEL_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
