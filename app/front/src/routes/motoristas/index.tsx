import { createFileRoute } from "@tanstack/react-router";
import { DriversListPage } from "@/features/drivers";

export const Route = createFileRoute("/motoristas/")({
  component: DriversListPage,
});
