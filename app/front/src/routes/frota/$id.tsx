import { createFileRoute } from "@tanstack/react-router";
import { VehicleDetailPage } from "@/features/fleet/pages/VehicleDetailPage";
import { requireRoles } from "@/lib/route-guard";

export const Route = createFileRoute("/frota/$id")({
  beforeLoad: requireRoles(["admin", "gestor_frota"]),
  component: function VehicleDetailRoute() {
    const { id } = Route.useParams();
    return <VehicleDetailPage vehicleId={Number(id)} />;
  },
});
