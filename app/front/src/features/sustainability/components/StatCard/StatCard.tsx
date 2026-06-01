import { Clock, Leaf, Ticket } from "lucide-react";
import {
  formatKpiCo2,
  formatKpiCount,
  formatKpiHours,
  KPI_ICON_SIZE,
  KPI_TITLES,
} from "../../lib/kpi";
import { KpiCard } from "../MetricCard";

type StatCardProps = {
  label: string;
  passages: number | string;
  co2: number | string;
  hours: number | string;
};

export const StatCard = ({ label, passages, co2, hours }: StatCardProps) => {
  const metrics = [
    {
      title: KPI_TITLES.passages,
      value: formatKpiCount(typeof passages === "number" ? passages : Number(passages)),
      icon: <Ticket className="text-[#72C215]" size={KPI_ICON_SIZE} />,
    },
    {
      title: KPI_TITLES.co2Avoided,
      value: formatKpiCo2(typeof co2 === "number" ? co2 : Number(co2)),
      icon: <Leaf className="text-[#72C215]" size={KPI_ICON_SIZE} />,
    },
    {
      title: KPI_TITLES.hoursSaved,
      value: formatKpiHours(typeof hours === "number" ? hours : Number(hours)),
      icon: <Clock className="text-[#72C215]" size={KPI_ICON_SIZE} />,
    },
  ];

  return (
    <section className="space-y-4">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {metrics.map((metric) => (
          <KpiCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
          />
        ))}
      </div>
    </section>
  );
};
