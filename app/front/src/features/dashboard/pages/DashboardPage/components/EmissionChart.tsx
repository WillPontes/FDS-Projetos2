import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts"

import { Globe } from "lucide-react"

const data = [
  {
    tipo: "Sem Taggy",
    emissao: 90,
  },
  {
    tipo: "Com Taggy",
    emissao: 45,
  },
]

export const EmissionChart = () => {
  return (
    <div className="card-surface-lg h-[320px] w-full p-6 transition-all duration-300 hover:shadow-md">
      <div className="mb-5 flex items-center gap-2">
        <Globe className="h-5 w-5 text-muted-foreground" />

        <h2 className="text-xl font-semibold text-foreground">
          Emissão de CO₂
        </h2>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
            opacity={0.5}
          />

          <XAxis
            dataKey="tipo"
            tick={{ fill: "#64748b", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: "rgba(148,163,184,0.08)" }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: "14px",
            }}
            formatter={(value) => [`${value}kg CO₂`, "Emissão"]}
          />

          <Bar
            dataKey="emissao"
            radius={[10, 10, 0, 0]}
            animationDuration={1200}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.tipo === "Sem Taggy"
                    ? "rgba(100,116,139,0.85)"
                    : "rgba(22,163,74,0.85)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}