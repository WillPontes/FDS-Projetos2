import { useQueryStates } from "nuqs";
import type { DateRange } from "react-day-picker";

import { dashboardSearchParams } from "../../search-params";

export const useDashboardFilters = () => {
  const [{ fuel, from, to }, setParams] = useQueryStates(
    dashboardSearchParams,
    { history: "replace" },
  );

  const fuelType = fuel ?? undefined;

  const dateRange: DateRange | undefined = from
    ? { from, to: to ?? undefined }
    : undefined;

  const hasActiveFilters = Boolean(fuel || from);

  const setFuelType = (value: string | undefined) => {
    void setParams({ fuel: value ?? null });
  };

  const setDateRange = (range: DateRange | undefined) => {
    void setParams({
      from: range?.from ?? null,
      to: range?.to ?? null,
    });
  };

  const clearAllFilters = () => {
    void setParams({
      fuel: null,
      from: null,
      to: null,
    });
  };

  return {
    fuelType,
    dateRange,
    hasActiveFilters,
    setFuelType,
    setDateRange,
    clearAllFilters,
  };
};
