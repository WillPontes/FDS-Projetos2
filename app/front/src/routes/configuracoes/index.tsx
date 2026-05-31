import { createFileRoute } from "@tanstack/react-router";
import { AdminSettingsPage } from "@/features/settings";
import { requireRoles } from "@/lib/route-guard";

export const Route = createFileRoute("/configuracoes/")({
  beforeLoad: requireRoles(["admin"]),
  component: AdminSettingsPage,
});
