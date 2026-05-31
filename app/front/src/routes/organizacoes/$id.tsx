import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { OrganizationDetailPage } from "@/features/fleet/pages/OrganizationDetailPage";
import { getOrganization } from "@/features/fleet/api/requests";
import { requireRoles } from "@/lib/route-guard";

const OrganizationDetailRoute = () => {
  const { id } = Route.useParams();
  const numericId = Number(id);

  const { data: org } = useQuery({
    queryKey: ["organizations", numericId],
    queryFn: () => getOrganization(numericId),
  });

  return (
    <OrganizationDetailPage
      orgId={numericId}
      orgName={org?.name ?? `Organização ${id}`}
      orgCnpj={org?.cnpj}
    />
  );
};

export const Route = createFileRoute("/organizacoes/$id")({
  beforeLoad: requireRoles(["admin"]),
  component: OrganizationDetailRoute,
});
