import { createFileRoute } from "@tanstack/react-router";
import { FleetsPage } from "@/features/fleet/pages/FleetsPage/FleetsPage";
import { requireRoles } from "@/lib/route-guard";

export const Route = createFileRoute("/frotas/")({
  beforeLoad: requireRoles(["admin", "gestor_frota"]),
  component: FleetsPage,
});
