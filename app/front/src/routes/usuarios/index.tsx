import { createFileRoute } from "@tanstack/react-router";
import { UsersListPage } from "@/features/users";

export const Route = createFileRoute("/usuarios/")({
  component: UsersListPage,
});
