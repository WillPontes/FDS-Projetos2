import { createFileRoute } from "@tanstack/react-router";
import { EditDriverPage } from "@/features/drivers";

export const Route = createFileRoute("/motoristas/editar/$id")({
  component: EditDriverPage,
});
