import { createFileRoute } from "@tanstack/react-router";
import { UsersListPage } from "@/features/users";
import { requireRoles } from "@/lib/route-guard";

export const Route = createFileRoute("/usuarios/")({
  beforeLoad: requireRoles(["admin"]),
  component: UsersListPage,
});
