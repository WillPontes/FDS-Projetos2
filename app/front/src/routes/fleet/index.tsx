import { createFileRoute } from "@tanstack/react-router"
import { FleetListPage } from "@/features/fleet/pages/FleetListPage"

export const Route = createFileRoute("/fleet/")({
  component: FleetListPage,
})
