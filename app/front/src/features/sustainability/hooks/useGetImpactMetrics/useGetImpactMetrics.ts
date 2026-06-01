import { useQuery } from "@tanstack/react-query"
import { useCurrentUser } from "@/features/auth"
import { sustainabilityKeys } from "../../api/query-keys"
import { getImpactMetrics } from "../../api/requests"

export const useGetImpactMetrics = () => {
  const { user } = useCurrentUser()

  return useQuery({
    queryKey: sustainabilityKeys.metrics(user?.id),
    queryFn: () => getImpactMetrics(user!.id),
    enabled: user != null,
  })
}
