import { createFileRoute } from "@tanstack/react-router";
import { VehicleInfoPage } from "@/features/settings";
import { requireMotoristaOnly } from "@/lib/route-guard";

export const Route = createFileRoute("/perfil/veiculo")({
  beforeLoad: requireMotoristaOnly(),
  component: VehicleInfoPage,
});
