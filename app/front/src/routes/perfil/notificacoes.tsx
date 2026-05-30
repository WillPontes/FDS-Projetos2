import { createFileRoute } from "@tanstack/react-router";
import { NotificationSettingsPage } from "@/features/settings";

export const Route = createFileRoute("/perfil/notificacoes")({
  component: NotificationSettingsPage,
});
