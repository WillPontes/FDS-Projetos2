import { createFileRoute } from "@tanstack/react-router";
import { DriverDetailPage } from "@/features/drivers/pages/DriverDetailPage";
import { requireRoles } from "@/lib/route-guard";

export const Route = createFileRoute("/motoristas/$id")({
  beforeLoad: requireRoles(["admin", "gestor_frota"]),
  component: function DriverDetailRoute() {
    const { id } = Route.useParams();
    return <DriverDetailPage driverId={Number(id)} />;
  },
});
