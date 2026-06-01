import { createFileRoute } from "@tanstack/react-router";
import { ImpactDashboardPage } from "@/features/sustainability";
import { requireMotoristaOnly } from "@/lib/route-guard";

export const Route = createFileRoute("/impacto")({
  beforeLoad: requireMotoristaOnly(),
  component: ImpactDashboardPage,
});
