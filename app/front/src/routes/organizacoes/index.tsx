import { createFileRoute } from "@tanstack/react-router";
import { OrganizationsPage } from "@/features/fleet/pages/OrganizationsPage/OrganizationsPage";
import { requireRoles } from "@/lib/route-guard";

export const Route = createFileRoute("/organizacoes/")({
  beforeLoad: requireRoles(["admin"]),
  component: OrganizationsPage,
});
