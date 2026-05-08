import { createFileRoute } from "@tanstack/react-router";
import { FleetListPage } from "@/features/fleet/pages/fleet-list-page";

export const Route = createFileRoute("/frota/")({
  component: FleetListPage,
});
