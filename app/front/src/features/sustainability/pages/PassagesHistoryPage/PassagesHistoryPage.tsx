import { EmptyState } from "@/components/EmptyState";
import { PageLayout } from "@/components/layout/PageLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCard } from "@/features/sustainability/components/MetricCard";
import { PassageListItem } from "@/features/sustainability/components/PassageListItem";
import { StatCard } from "@/features/sustainability/components/StatCard";
import { useGetPassages } from "../../hooks/useGetPassages";
import { useGetPassagesSummary } from "../../hooks/useGetPassagesSummary";

export const PassagesHistoryPage = () => {
  const { data: summary, isLoading: summaryLoading } = useGetPassagesSummary();
  const { data: passagesData, isLoading: passagesLoading } = useGetPassages();

  const passages = passagesData?.lastPassages ?? [];

  return (
    <PageLayout
      title="Minhas Passagens"
      description="Consulte o resumo das suas passagens e o histórico recente com impacto ambiental."
    >
      <section>
        {summaryLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded" />
            ))}
          </div>
        ) : (
          <StatCard
            label="Resumo total"
            passages={summary?.totalPassages ?? 0}
            co2={summary?.totalCarbon ?? 0}
            hours={summary?.hoursSaved ?? 0}
          />
        )}
      </section>

      <section>
        {passagesLoading ? (
          <Skeleton className="h-64 w-full rounded" />
        ) : (
          <MetricCard className="p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Últimas Passagens
            </p>
            {passages.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="flex flex-col">
                {passages.map((passage, index) => (
                  <PassageListItem
                    key={passage.id}
                    passage={passage}
                    showBorder={index !== passages.length - 1}
                  />
                ))}
              </div>
            )}
          </MetricCard>
        )}
      </section>
    </PageLayout>
  );
};
