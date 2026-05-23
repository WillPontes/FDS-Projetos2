import { createFileRoute } from "@tanstack/react-router"
import { PassagesHistoryPage } from "@/features/sustainability"

export const Route = createFileRoute("/passagens")({
  component: PassagesHistoryPage,
})
