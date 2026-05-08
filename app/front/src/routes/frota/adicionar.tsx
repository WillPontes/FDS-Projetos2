import { createFileRoute } from "@tanstack/react-router";
import { FleetFormPage } from "@/features/fleet/pages/fleet-form-page";

export const Route = createFileRoute("/frota/adicionar")({
  component: FleetFormPage,
});
