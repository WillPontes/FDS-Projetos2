import { createFileRoute } from "@tanstack/react-router"
import { FleetFormPage } from "@/features/fleet/pages/FleetFormPage"

export const Route = createFileRoute("/fleet/new")({
  component: FleetFormPage,
})
