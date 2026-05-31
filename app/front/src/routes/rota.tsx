import { createFileRoute } from "@tanstack/react-router";
import { RouteCalculationPage } from "@/features/routing";
import { requireMotoristaOnly } from "@/lib/route-guard";

export const Route = createFileRoute("/rota")({
  beforeLoad: requireMotoristaOnly(),
  component: RouteCalculationPage,
});
