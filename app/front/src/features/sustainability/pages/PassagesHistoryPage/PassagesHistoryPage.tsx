import { MetricCard } from "@/features/sustainability/components/MetricCard"
import { PassageListItem } from "@/features/sustainability/components/PassageListItem"
import { StatCard } from "@/features/sustainability/components/StatCard"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetPassages } from "../../hooks/useGetPassages"
import { useGetPassagesSummary } from "../../hooks/useGetPassagesSummary"

export const PassagesHistoryPage = () => {
  const { data: summary, isLoading: summaryLoading } = useGetPassagesSummary()
  const { data: passagesData, isLoading: passagesLoading } = useGetPassages()

  const passages = passagesData?.lastPassages ?? []

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        Minhas Passagens
      </h1>

      {summaryLoading ? (
        <Skeleton className="h-32 w-full rounded-2xl" />
      ) : (
        <StatCard
          label="Resumo Total"
          passages={summary?.totalPassages ?? 0}
          co2={summary?.totalCarbon ?? 0}
          hours={summary?.hoursSaved ?? 0}
        />
      )}

      <MetricCard className="mb-10 p-6">
        <span className="metric-label mb-4 block">Últimas Passagens</span>
        {passagesLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : passages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma passagem registrada.
          </p>
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
    </>
  )
}
