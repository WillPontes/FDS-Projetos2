import { createFileRoute } from '@tanstack/react-router'

import { DashboardPage } from "@/features/dashboard"
import { requireManagerOrAdmin } from "@/lib/route-guard"

export const Route = createFileRoute("/")({
  beforeLoad: requireManagerOrAdmin(),
  component: DashboardPage,
})