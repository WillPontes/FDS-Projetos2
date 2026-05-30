import { createFileRoute } from "@tanstack/react-router";
import { RouteCalculationPage } from "@/features/routing";

export const Route = createFileRoute("/rota")({
  component: RouteCalculationPage,
});
