import { createFileRoute } from '@tanstack/react-router'

import { DashboardPage } from '@/features/dashboard/pages/DashboardPage/DashboardPage'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})