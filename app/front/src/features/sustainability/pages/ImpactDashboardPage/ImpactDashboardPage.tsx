import { useState } from "react"
import { Droplet, Leaf, Percent, Scroll } from "lucide-react"
import { cn } from "@/lib/utils"
import { MetricCard } from "@/features/sustainability/components/MetricCard"
import { useGetImpactMetrics } from "../../hooks/useGetImpactMetrics"
import { useGetWeeklyGoal } from "../../hooks/useGetWeeklyGoal"

type EcoTab = "carbono" | "agua" | "papel"

export const ImpactDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<EcoTab>("carbono")
  const { data: metrics } = useGetImpactMetrics()
  const { data: weeklyGoal } = useGetWeeklyGoal()

  const ecoScoreContent = {
    carbono: {
      title: `${metrics?.treeSaved ?? 0} árvores`,
      subtitle: "plantadas e crescendo por 1 ano",
      techValue: `Valor técnico: ${metrics?.totalCarbon ?? 0} kg de CO2`,
      icon: <Leaf className="h-12 w-12 text-primary" />,
    },
    agua: {
      title: `${(metrics?.totalWaterSaved ?? 0).toLocaleString("pt-BR")} litros`,
      subtitle: "de água poupados",
      techValue: `Valor técnico: ${metrics?.totalWaterSaved ?? 0}L de água`,
      icon: <Droplet className="h-12 w-12 text-primary" />,
    },
    papel: {
      title: `${metrics?.paperSaved ?? 0} metros`,
      subtitle: "de papel evitados",
      techValue: `Valor técnico: ${metrics?.paperSaved ?? 0}m de papel`,
      icon: <Scroll className="h-12 w-12 text-primary" />,
    },
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Meu Impacto Sustentável
      </h1>

      <MetricCard className="p-6">
        <span className="mb-1 block text-5xl font-black tracking-tight text-foreground">
          {metrics?.daysSavedWithoutQueues ?? 0}
        </span>
        <span className="text-xs font-semibold text-muted-foreground">
          Dias economizados sem filas de pedágio
        </span>
      </MetricCard>

      <MetricCard className="flex flex-col overflow-hidden">
        <div className="p-6 pb-2">
          <span className="metric-label mb-4 block">Impacto Lúdico</span>
          <div className="mb-6 grid grid-cols-3 rounded-xl bg-muted p-1 text-xs font-semibold text-muted-foreground">
            {(["carbono", "agua", "papel"] as EcoTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-lg py-2 capitalize transition-all",
                  activeTab === tab
                    ? "bg-taggy-brand font-bold text-white shadow-sm"
                    : "hover:text-foreground",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex flex-col items-center py-4 text-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-muted shadow-inner">
              {ecoScoreContent[activeTab].icon}
            </div>
            <span className="mb-1 text-xs font-medium text-muted-foreground">
              Você economizou o equivalente a:
            </span>
            <span className="mb-1 text-4xl font-black tracking-tight text-foreground">
              {ecoScoreContent[activeTab].title}
            </span>
            <span className="mb-4 text-xs font-semibold text-muted-foreground">
              {ecoScoreContent[activeTab].subtitle}
            </span>
          </div>
        </div>
        <div className="border-t border-border bg-muted/50 py-4 px-6 text-center">
          <span className="text-sm font-bold text-taggy-brand">
            {ecoScoreContent[activeTab].techValue}
          </span>
        </div>
      </MetricCard>

      <MetricCard className="mb-6 p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">Meta semanal</span>
          <span className="text-xs font-medium text-muted-foreground">
            {weeklyGoal?.weeklyPercentage ?? 0}% / meta {weeklyGoal?.weeklyGoal ?? 0}
          </span>
        </div>
        <div className="h-5 w-full overflow-hidden rounded-full border border-border bg-muted p-0.5">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${weeklyGoal?.weeklyPercentage ?? 0}%` }}
          />
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <Percent className="h-3.5 w-3.5" />
          <span>{weeklyGoal?.weeklyPercentage ?? 0}% completo</span>
        </div>
      </MetricCard>
    </>
  )
}
