import { useMemo, useState } from "react";
import { format } from "date-fns";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import type { DateRange } from "react-day-picker";

import { DataTable } from "@/components/DataTable";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE } from "@/constants";
import { DashboardDateRangePicker } from "@/features/dashboard/pages/DashboardPage/components/DashboardDateRangePicker";
import { DashboardFuelSelect } from "@/features/dashboard/pages/DashboardPage/components/DashboardFuelSelect";
import { useGetVehicles } from "@/features/fleet/hooks/useGetVehicles";
import type { Vehicle } from "@/features/fleet/schemas/vehicle-schema";
import { DEFAULT_REGION } from "@/features/reports/constants";
import { ReportsRegionSelect } from "./components/ReportsRegionSelect";

type ReportVehicle = Vehicle & {
  fuel_type?: string;
  installation_date?: string;
};

type ReportFilters = {
  dateRange: DateRange | undefined;
  fuelType: string | undefined;
  region: string;
};

const defaultFilters: ReportFilters = {
  dateRange: undefined,
  fuelType: undefined,
  region: DEFAULT_REGION,
};

const columns: ColumnDef<ReportVehicle>[] = [
  {
    accessorKey: "id",
    header: "SÉRIE DA TAG",
    enableSorting: true,
  },
  {
    accessorKey: "plate",
    header: "PLACA VINCULADA",
    enableSorting: true,
  },
  {
    accessorKey: "model",
    header: "MODELO DO VEÍCULO",
    enableSorting: true,
  },
  {
    accessorKey: "fuel_type",
    header: "TIPO DE COMBUSTÍVEL",
    enableSorting: true,
  },
  {
    accessorKey: "installation_date",
    header: "DATA DA INSTALAÇÃO",
    enableSorting: true,
  },
];

const reportsSearchParams = {
  page: parseAsInteger.withDefault(1),
  sort: parseAsString,
  order: parseAsStringEnum(["asc", "desc"] as const).withDefault("asc"),
};

function filterVehicles(
  items: ReportVehicle[],
  filters: ReportFilters,
): ReportVehicle[] {
  return items.filter((item) => {
    if (
      filters.fuelType &&
      item.fuel_type?.toLowerCase() !== filters.fuelType.toLowerCase()
    ) {
      return false;
    }

    return true;
  });
}

export const ReportsPage = () => {
  const [draftFilters, setDraftFilters] =
    useState<ReportFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<ReportFilters>(defaultFilters);

  const [{ page, sort, order }, setParams] = useQueryStates(
    reportsSearchParams,
    {
      history: "replace",
    },
  );

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: PAGE_SIZE,
  };
  const sorting: SortingState = sort
    ? [{ id: sort, desc: order === "desc" }]
    : [];

  const { data, isLoading } = useGetVehicles({
    page,
    pageSize: PAGE_SIZE,
    sortBy: sort ?? undefined,
    sortOrder: order,
    dateFrom: appliedFilters.dateRange?.from
      ? format(appliedFilters.dateRange.from, "yyyy-MM-dd")
      : undefined,
    dateTo: appliedFilters.dateRange?.to
      ? format(appliedFilters.dateRange.to, "yyyy-MM-dd")
      : undefined,
    fuelType: appliedFilters.fuelType,
    region: appliedFilters.region,
  });

  const filteredItems = useMemo(
    () => filterVehicles((data?.items ?? []) as ReportVehicle[], appliedFilters),
    [data?.items, appliedFilters],
  );

  const pageCount = data ? Math.ceil(data.total / PAGE_SIZE) : undefined;

  const handleGenerate = () => {
    setAppliedFilters(draftFilters);
    setParams({ page: 1 });
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    setParams({ page: next.pageIndex + 1 });
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    setParams({
      sort: next[0]?.id ?? null,
      order: next[0]?.desc ? "desc" : "asc",
      page: 1,
    });
  };

  return (
    <PageLayout
      title="Relatórios"
      description="Gere relatórios de veículos com filtros por período, combustível e região."
    >
      <section className="space-y-4 rounded border border-neutral-300 bg-white p-4">
        <h2 className="font-semibold">Gerar relatórios</h2>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <DashboardDateRangePicker
              date={draftFilters.dateRange}
              onDateChange={(dateRange) =>
                setDraftFilters((prev) => ({ ...prev, dateRange }))
              }
            />
            <DashboardFuelSelect
              value={draftFilters.fuelType}
              onValueChange={(fuelType) =>
                setDraftFilters((prev) => ({ ...prev, fuelType }))
              }
            />
            <ReportsRegionSelect
              value={draftFilters.region}
              onValueChange={(region) =>
                setDraftFilters((prev) => ({ ...prev, region }))
              }
            />
          </div>

          <Button type="button" onClick={handleGenerate}>
            Gerar
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={filteredItems}
          isLoading={isLoading}
          pageCount={pageCount}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          sorting={sorting}
          onSortingChange={handleSortingChange}
        />
      </section>
    </PageLayout>
  );
};
