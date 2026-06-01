import type { DateRange } from "react-day-picker";
import { DashboardDateRangePicker } from "@/features/dashboard/pages/DashboardPage/components/DashboardDateRangePicker";
import { ContextSelect } from "@/components/ui/ContextSelect";
import { UfSelect } from "@/components/ui/UfSelect";
import { Input } from "@/components/ui/input";

export type TransactionFilterState = {
  plate?: string;
  context?: string;
  uf?: string;
  dateRange?: DateRange;
};

type TransactionFiltersProps = {
  filters: TransactionFilterState;
  onChange: (filters: TransactionFilterState) => void;
  showPlate?: boolean;
};

export const TransactionFilters = ({
  filters,
  onChange,
  showPlate = false,
}: TransactionFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {showPlate && (
        <Input
          placeholder="Buscar por placa"
          value={filters.plate ?? ""}
          onChange={(e) => onChange({ ...filters, plate: e.target.value || undefined })}
          className="w-44"
        />
      )}
      <ContextSelect
        value={filters.context}
        onValueChange={(context) => onChange({ ...filters, context })}
      />
      <UfSelect
        value={filters.uf}
        onValueChange={(uf) => onChange({ ...filters, uf })}
      />
      <DashboardDateRangePicker
        date={filters.dateRange}
        onDateChange={(dateRange) => onChange({ ...filters, dateRange })}
      />
    </div>
  );
};
