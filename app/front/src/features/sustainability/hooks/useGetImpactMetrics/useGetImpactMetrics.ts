import { useQuery } from "@tanstack/react-query"
import { sustainabilityKeys } from "../../api/query-keys"
import { getImpactMetrics } from "../../api/requests"

export const useGetImpactMetrics = () => {
  return useQuery({
    queryKey: sustainabilityKeys.metrics(),
    queryFn: getImpactMetrics,
  })
}
