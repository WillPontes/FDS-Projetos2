import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { tipo: "Sem Taggy", emissao: 90 },
  { tipo: "Com Taggy", emissao: 45 },
];

const chartConfig = {
  emissao: {
    label: "Emissão (kg CO₂)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const BAR_COLORS: Record<string, string> = {
  "Sem Taggy": "rgba(100, 116, 139, 0.85)",
  "Com Taggy": "rgba(22, 163, 74, 0.85)",
};

export const ComparativeBarChart = () => {
  return (
    <div className="flex min-h-[320px] flex-col gap-4 rounded border border-neutral-300 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        Análise Comparativa
      </p>

      <ChartContainer config={chartConfig} className="min-h-[240px] w-full flex-1">
        <BarChart data={chartData} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="tipo"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="emissao" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell
                key={entry.tipo}
                fill={BAR_COLORS[entry.tipo] ?? "var(--color-emissao)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};
