import { Droplet, Leaf, Scroll } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCard } from "@/features/sustainability/components/MetricCard";
import { useGetImpactMetrics } from "../../hooks/useGetImpactMetrics";
import { useGetWeeklyGoal } from "../../hooks/useGetWeeklyGoal";

export const ImpactDashboardPage = () => {
  const { data: metrics, isLoading: metricsLoading } = useGetImpactMetrics();
  const { data: weeklyGoal, isLoading: weeklyGoalLoading } = useGetWeeklyGoal();

  const weeklyTarget = weeklyGoal?.weeklyGoal ?? 0;
  const weeklyPercentage = weeklyGoal?.weeklyPercentage ?? 0;
  const weeklyAccumulated = Math.round((weeklyPercentage * weeklyTarget) / 100);

  const ludicMetrics = [
    {
      key: "carbono",
      title: `${metrics?.treeSaved ?? 0} Árvores`,
      subtitle: "Árvores Plantadas e Crescendo por 1 Ano",
      techValue: `${metrics?.totalCarbon ?? 0}kg de CO2`,
      icon: <Leaf className="h-10 w-10 text-primary" />,
    },
    {
      key: "agua",
      title: `${(metrics?.totalWaterSaved ?? 0).toLocaleString("pt-BR")} Litros`,
      subtitle: "Litros de Água Poupados",
      techValue: `${metrics?.totalWaterSaved ?? 0}L de Água`,
      icon: <Droplet className="h-10 w-10 text-primary" />,
    },
    {
      key: "papel",
      title: `${metrics?.paperSaved ?? 0} Metros`,
      subtitle: "Metros de Papel Evitados",
      techValue: `${metrics?.paperSaved ?? 0}m de Papel`,
      icon: <Scroll className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <PageLayout
      title="Meu Impacto"
      description="Acompanhe suas métricas de sustentabilidade, impacto lúdico e progresso da meta semanal."
    >
      <section>
        {metricsLoading ? (
          <Skeleton className="h-32 w-full rounded" />
        ) : (
          <MetricCard className="p-6">
            <span className="mb-1 block text-5xl font-black tracking-tight text-foreground">
              {metrics?.daysSavedWithoutQueues ?? 0}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              Dias Economizados sem Filas de Pedágio
            </span>
          </MetricCard>
        )}
      </section>

      <section>
        {metricsLoading ? (
          <Skeleton className="h-64 w-full rounded" />
        ) : (
          <MetricCard className="p-6">
            <div className="mb-6 flex flex-col gap-2">
              <span className="metric-label">Impacto Lúdico</span>
              <p className="mb-6 text-xs font-medium text-muted-foreground">
                Você Economizou o Equivalente a:
              </p>
            </div>
            <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
              {ludicMetrics.map((metric) => (
                <div
                  key={metric.key}
                  className="flex flex-col items-center px-6 py-6 text-center md:py-0"
                >
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-border bg-muted shadow-inner">
                    {metric.icon}
                  </div>
                  <span className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
                    {metric.title}
                  </span>
                  <span className="mt-1 text-xs font-semibold text-muted-foreground">
                    {metric.subtitle}
                  </span>
                  <span className="mt-4 text-sm font-bold text-taggy-brand">
                    Valor Técnico: {metric.techValue}
                  </span>
                </div>
              ))}
            </div>
          </MetricCard>
        )}
      </section>

      <section>
        {weeklyGoalLoading ? (
          <Skeleton className="h-24 w-full rounded" />
        ) : (
          <MetricCard className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">
                Meta Semanal
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {weeklyAccumulated} / {weeklyGoal?.weeklyGoal ?? 0}
              </span>
            </div>
            <div className="h-5 w-full overflow-hidden rounded-full border border-border bg-muted p-0.5">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${weeklyGoal?.weeklyPercentage ?? 0}%` }}
              />
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <span>{weeklyGoal?.weeklyPercentage ?? 0}% completo</span>
            </div>
          </MetricCard>
        )}
      </section>
    </PageLayout>
  );
};
