import { createFileRoute } from "@tanstack/react-router";
import { VehicleInfoPage } from "@/features/settings";

export const Route = createFileRoute("/perfil/veiculo")({
  component: VehicleInfoPage,
});
