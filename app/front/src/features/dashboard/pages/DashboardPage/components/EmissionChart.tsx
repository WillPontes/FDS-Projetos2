import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

import { Globe } from "lucide-react";
import { MetricCard, sectionCardLabelClass } from "@/features/sustainability/components/MetricCard";

const data = [
  {
    tipo: "Sem Taggy",
    emissao: 90,
  },
  {
    tipo: "Com Taggy",
    emissao: 45,
  },
];

export const EmissionChart = () => {
  return (
    <MetricCard className="flex h-[320px] w-full flex-col p-4">
      <div className="mb-5 flex items-center gap-2">
        <Globe className="h-5 w-5 text-muted-foreground" />
        <p className={sectionCardLabelClass}>Emissão de CO₂</p>
      </div>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="tipo" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="emissao" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.tipo}
                  fill={
                    entry.tipo === "Com Taggy"
                      ? "rgba(22, 163, 74, 0.85)"
                      : "rgba(100, 116, 139, 0.85)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </MetricCard>
  );
};
