import { createFileRoute } from "@tanstack/react-router";
import { AdminSettingsPage } from "@/features/settings";

export const Route = createFileRoute("/configuracoes/")({
  component: AdminSettingsPage,
});
