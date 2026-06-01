import { createFileRoute } from "@tanstack/react-router";
import { EditVehiclePage } from "@/features/fleet/pages/EditVehiclePage";
import { requireRoles } from "@/lib/route-guard";

export const Route = createFileRoute("/frota/editar/$id")({
  beforeLoad: requireRoles(["admin", "gestor_frota"]),
  component: EditVehiclePage,
});
