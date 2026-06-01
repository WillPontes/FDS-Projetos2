import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DailyStatItem } from "@/features/dashboard/hooks/useDailyStats";

const chartConfig = {
  co2_total_kg: {
    label: "CO₂ Evitado (kg)",
    color: "rgba(34, 197, 94, 0.85)",
  },
} satisfies ChartConfig;

type DailyCo2ChartProps = {
  data: DailyStatItem[];
};

export const DailyCo2Chart = ({ data }: DailyCo2ChartProps) => {
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.day), "dd/MM", { locale: ptBR }),
  }));

  return (
    <div className="flex min-h-[280px] flex-col gap-3 rounded border border-neutral-300 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        CO₂ Evitado por Dia (kg)
      </p>
      <ChartContainer config={chartConfig} className="min-h-[220px] w-full flex-1">
        <AreaChart data={formatted} accessibilityLayer>
          <defs>
            <linearGradient id="co2-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(34, 197, 94, 0.3)" stopOpacity={1} />
              <stop offset="95%" stopColor="rgba(34, 197, 94, 0)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
            tick={{ fontSize: 11 }}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="co2_total_kg"
            stroke="rgba(34, 197, 94, 1)"
            strokeWidth={2}
            fill="url(#co2-gradient)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};
