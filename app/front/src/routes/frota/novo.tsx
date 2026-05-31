import { createFileRoute } from "@tanstack/react-router";
import { CreateVehiclePage } from "@/features/fleet/pages/CreateVehiclePage";
import { requireRoles } from "@/lib/route-guard";

export const Route = createFileRoute("/frota/novo")({
  beforeLoad: requireRoles(["admin", "gestor_frota"]),
  component: CreateVehiclePage,
});
