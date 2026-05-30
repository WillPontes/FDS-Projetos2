import { Leaf, Fuel, Download, Coins, Tag } from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/features/sustainability/components/MetricCard";
import { useDashboardFilters } from "@/features/dashboard/hooks/useDashboardFilters";
import { ComparativeBarChart } from "./components/ComparativeBarChart";
import { DashboardDateRangePicker } from "./components/DashboardDateRangePicker";
import { DashboardFuelSelect } from "./components/DashboardFuelSelect";
import { RegionalEmissionsMap } from "./components/RegionalEmissionsMap";

export const DashboardPage = () => {
  const {
    fuelType,
    dateRange,
    hasActiveFilters,
    setFuelType,
    setDateRange,
    clearAllFilters,
  } = useDashboardFilters();

  const METRICS = [
    {
      title: "EMISSÃO DE CO₂ EVITADAS",
      value: "12.450kg",
      icon: <Leaf className="text-[#72C215]" size={30} />,
    },
    {
      title: "COMBUSTÍVEL ECONOMIZADO",
      value: "8.920L",
      icon: <Fuel className="text-[#72C215]" size={30} />,
    },
    {
      title: "ECONOMIA ACUMULADA (ROI)",
      value: "R$ 67.340",
      icon: <Coins className="text-[#72C215]" size={30} />,
    },
    {
      title: "TAGS ATIVOS",
      value: "247",
      icon: <Tag className="text-[#72C215]" size={30} />,
    },
  ];

  return (
    <PageLayout
      title="Dashboard"
      description="Visualize indicadores de emissões, economia e tags ativos com filtros por período e tipo de combustível."
    >
      <section className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
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

      <section className="grid grid-cols-4 gap-6">
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
        <RegionalEmissionsMap />
        <ComparativeBarChart />
      </section>
    </PageLayout>
  );
};
