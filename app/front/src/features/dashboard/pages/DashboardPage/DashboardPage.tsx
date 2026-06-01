import { Leaf, Fuel, Download, Coins, Tag, Scroll } from "lucide-react";
import { useState } from "react";

import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/features/sustainability/components/MetricCard";
import {
  formatKpiCo2,
  formatKpiCount,
  formatKpiCurrency,
  formatKpiFuel,
  formatKpiPaper,
  KPI_ICON_SIZE,
  KPI_TITLES,
} from "@/features/sustainability/lib/kpi";
import { useCurrentUser } from "@/features/auth";
import { OrganizationsCombobox } from "@/features/fleet/components/OrganizationsCombobox/OrganizationsCombobox";
import { useDashboardFilters } from "@/features/dashboard/hooks/useDashboardFilters";
import { useDailyStats } from "@/features/dashboard/hooks/useDailyStats";
import { useDashboardSummary } from "@/features/dashboard/hooks/useDashboardSummary";
import { ComparativeBarChart } from "./components/ComparativeBarChart";
import { DashboardDateRangePicker } from "./components/DashboardDateRangePicker";
import { DashboardFuelSelect } from "./components/DashboardFuelSelect";
import { DailyPassagensChart } from "./components/DailyPassagensChart";
import { DailyCo2Chart } from "./components/DailyCo2Chart";
import { RegionalEmissionsMap } from "./components/RegionalEmissionsMap";

export const DashboardPage = () => {
  const { user } = useCurrentUser();
  const isAdmin = user?.role === "admin";
  const [organizationId, setOrganizationId] = useState<number | undefined>(
    user?.role === "gestor_frota" ? user.organization_id ?? undefined : undefined,
  );

  const {
    fuelType,
    dateRange,
    hasActiveFilters,
    setFuelType,
    setDateRange,
    clearAllFilters,
  } = useDashboardFilters();

  const scopedOrgId =
    user?.role === "gestor_frota"
      ? user.organization_id ?? undefined
      : isAdmin
        ? organizationId
        : undefined;

  const { data: dailyStats = [] } = useDailyStats({
    days: 30,
    organizationId: scopedOrgId,
  });

  const { data: summary } = useDashboardSummary({
    organizationId: scopedOrgId,
  });

  const METRICS = [
    {
      title: KPI_TITLES.co2Avoided,
      value: formatKpiCo2(summary?.total_co2_avoided_kg),
      icon: <Leaf className="text-[#72C215]" size={KPI_ICON_SIZE} />,
    },
    {
      title: KPI_TITLES.fuelSaved,
      value: formatKpiFuel(summary?.total_fuel_saved_liters),
      icon: <Fuel className="text-[#72C215]" size={KPI_ICON_SIZE} />,
    },
    {
      title: KPI_TITLES.paperSaved,
      value: formatKpiPaper(summary?.paper_saved_meters),
      icon: <Scroll className="text-[#72C215]" size={KPI_ICON_SIZE} />,
    },
    {
      title: KPI_TITLES.financialSavings,
      value: formatKpiCurrency(summary?.accumulated_economy),
      icon: <Coins className="text-[#72C215]" size={KPI_ICON_SIZE} />,
    },
    {
      title: KPI_TITLES.tagsActive,
      value: formatKpiCount(summary?.active_tags),
      icon: <Tag className="text-[#72C215]" size={KPI_ICON_SIZE} />,
    },
  ];

  return (
    <PageLayout
      title="Dashboard"
      description="Visualize indicadores de emissões, economia e tags ativos com filtros por período e tipo de combustível."
    >
      <section className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <OrganizationsCombobox
              value={organizationId}
              onValueChange={setOrganizationId}
              placeholder="Todas as organizações"
            />
          )}
          <DashboardFuelSelect value={fuelType} onValueChange={setFuelType} />
          <DashboardDateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
          />
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={clearAllFilters}
            >
              Limpar filtros
            </Button>
          ) : null}
        </div>

        <Button type="button" variant="outline">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </section>

      <section className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {METRICS.map((metric) => (
          <KpiCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
          />
        ))}
      </section>

      <section className="grid grid-cols-2 gap-6">
        <DailyPassagensChart data={dailyStats} />
        <DailyCo2Chart data={dailyStats} />
      </section>

      <section className="grid grid-cols-2 gap-6">
        {isAdmin && <RegionalEmissionsMap />}
        {/* TODO: Integração pendente — dados comparativos mockados */}
        <ComparativeBarChart />
      </section>
    </PageLayout>
  );
};
