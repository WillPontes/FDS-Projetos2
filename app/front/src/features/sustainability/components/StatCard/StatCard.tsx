import { Clock, Leaf, Ticket } from "lucide-react";
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
      title: "PASSAGENS",
      value: passages,
      icon: <Ticket className="text-[#72C215]" size={30} />,
    },
    {
      title: "KG CO₂",
      value: co2,
      icon: <Leaf className="text-[#72C215]" size={30} />,
    },
    {
      title: "HORAS",
      value: hours,
      icon: <Clock className="text-[#72C215]" size={30} />,
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
