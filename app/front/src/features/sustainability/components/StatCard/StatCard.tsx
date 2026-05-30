import { MetricCard } from "../MetricCard"

type StatCardProps = {
  label: string
  passages: number | string
  co2: number | string
  hours: number | string
}

export const StatCard = ({ label, passages, co2, hours }: StatCardProps) => {
  return (
    <MetricCard className="p-6">
      <span className="metric-label mb-4 block">{label}</span>
      <div className="grid grid-cols-3 text-center">
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold text-foreground md:text-4xl">
            {passages}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            Passagens
          </span>
        </div>
        <div className="flex flex-col gap-1 border-x border-border">
          <span className="text-3xl font-bold text-foreground md:text-4xl">
            {co2}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            kg CO₂
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold text-foreground md:text-4xl">
            {hours}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            Horas
          </span>
        </div>
      </div>
    </MetricCard>
  )
}
