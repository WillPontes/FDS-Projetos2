import { createFileRoute } from "@tanstack/react-router";
import { FleetListPage } from "@/features/fleet/pages/FleetListPage";
import { requireRoles } from "@/lib/route-guard";

export const Route = createFileRoute("/frota/")({
  beforeLoad: requireRoles(["admin", "gestor_frota"]),
  component: FleetListPage,
});
