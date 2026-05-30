import { createFileRoute } from "@tanstack/react-router";

import { ReportsPage } from "@/features/reports";

export const Route = createFileRoute("/relatorios")({
  component: ReportsPage,
});
