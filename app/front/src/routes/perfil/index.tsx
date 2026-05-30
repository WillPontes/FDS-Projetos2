import { createFileRoute } from "@tanstack/react-router";
import { UserProfilePage } from "@/features/settings";

export const Route = createFileRoute("/perfil/")({
  component: UserProfilePage,
});
