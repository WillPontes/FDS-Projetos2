import { createFileRoute } from "@tanstack/react-router";
import { DriversListPage } from "@/features/drivers";
import { requireRoles } from "@/lib/route-guard";

export const Route = createFileRoute("/motoristas/")({
  beforeLoad: requireRoles(["admin", "gestor_frota"]),
  component: DriversListPage,
});
