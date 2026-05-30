import { createFileRoute } from "@tanstack/react-router";
import { EditVehiclePage } from "@/features/fleet/pages/EditVehiclePage";

export const Route = createFileRoute("/frota/editar/$id")({
  component: EditVehiclePage,
});
