import { createFileRoute } from "@tanstack/react-router"
import { ImpactDashboardPage } from "@/features/sustainability"

export const Route = createFileRoute("/impact")({
  component: ImpactDashboardPage,
})
