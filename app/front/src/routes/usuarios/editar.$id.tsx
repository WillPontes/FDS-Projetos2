import { createFileRoute } from "@tanstack/react-router";
import { EditUserPage } from "@/features/users";

export const Route = createFileRoute("/usuarios/editar/$id")({
  component: EditUserPage,
});
