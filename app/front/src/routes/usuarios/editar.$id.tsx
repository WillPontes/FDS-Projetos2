import { createFileRoute } from "@tanstack/react-router";
import { EditUserPage } from "@/features/users";
import { requireRoles } from "@/lib/route-guard";

export const Route = createFileRoute("/usuarios/editar/$id")({
  beforeLoad: requireRoles(["admin"]),
  component: EditUserPage,
});
