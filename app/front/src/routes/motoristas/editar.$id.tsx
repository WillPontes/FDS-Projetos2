import { createFileRoute } from "@tanstack/react-router";
import { EditDriverPage } from "@/features/drivers";
import { requireRoles } from "@/lib/route-guard";

export const Route = createFileRoute("/motoristas/editar/$id")({
  beforeLoad: requireRoles(["admin", "gestor_frota"]),
  component: EditDriverPage,
});
