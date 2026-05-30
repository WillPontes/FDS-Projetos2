import { createFileRoute, redirect } from "@tanstack/react-router";
import { UsersListPage } from "@/features/users";

export const Route = createFileRoute("/users")({
  beforeLoad: () => {
    throw redirect({ to: "/usuarios" });
  },
  component: UsersListPage,
});
