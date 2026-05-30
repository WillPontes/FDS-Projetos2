import { createFileRoute } from "@tanstack/react-router";
import { HelpSupportPage } from "@/features/settings";

export const Route = createFileRoute("/ajuda")({
  component: HelpSupportPage,
});
