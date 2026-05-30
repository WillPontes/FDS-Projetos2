import { createFileRoute } from "@tanstack/react-router";
import { CreateVehiclePage } from "@/features/fleet/pages/CreateVehiclePage";

export const Route = createFileRoute("/frota/novo")({
  component: CreateVehiclePage,
});
