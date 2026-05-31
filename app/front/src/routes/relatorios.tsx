import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "@/features/reports";
import { requireRoles } from "@/lib/route-guard";

export const Route = createFileRoute("/relatorios")({
  beforeLoad: requireRoles(["admin", "gestor_frota"]),
  component: ReportsPage,
});
