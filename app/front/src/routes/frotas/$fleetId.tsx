import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FleetDetailPage } from "@/features/fleet/pages/FleetDetailPage/FleetDetailPage";
import { getFleet } from "@/features/fleet/api/requests";
import { requireRoles } from "@/lib/route-guard";

const FleetDetailRoute = () => {
  const { fleetId } = Route.useParams();
  const numericFleetId = Number(fleetId);

  const { data: fleet } = useQuery({
    queryKey: ["fleets", numericFleetId],
    queryFn: () => getFleet(numericFleetId),
  });

  return (
    <FleetDetailPage
      fleetId={numericFleetId}
      fleetName={fleet?.name ?? `Frota ${fleetId}`}
    />
  );
};

export const Route = createFileRoute("/frotas/$fleetId")({
  beforeLoad: requireRoles(["admin", "gestor_frota"]),
  component: FleetDetailRoute,
});
