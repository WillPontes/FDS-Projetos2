import { Trees, BatteryCharging, Coffee } from "lucide-react";
import { KpiCard } from "@/features/sustainability/components/MetricCard";

const ludicMetrics = [
  {
    icon: <Trees className="text-[#72C215]" size={30} />,
    value: "2,3",
    title: "ÁRVORES PRESERVADAS",
  },
  {
    icon: <BatteryCharging className="text-[#72C215]" size={30} />,
    value: "120",
    title: "CARGAS DE CELULAR ECONOMIZADAS",
  },
  {
    icon: <Coffee className="text-[#72C215]" size={30} />,
    value: "80",
    title: "FILTROS DE CAFÉ POUPADOS",
  },
];

export const LudicCards = () => {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">
        Tradução lúdica do impacto
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {ludicMetrics.map((metric) => (
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
