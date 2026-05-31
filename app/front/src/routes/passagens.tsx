import { createFileRoute } from "@tanstack/react-router"
import { PassagesHistoryPage } from "@/features/sustainability"
import { requireMotoristaOnly } from "@/lib/route-guard"

export const Route = createFileRoute("/passagens")({
  beforeLoad: requireMotoristaOnly(),
  component: PassagesHistoryPage,
})
