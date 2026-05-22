import { useQuery } from "@tanstack/react-query"
import { impactKeys } from "../../api/query-keys"
import { getImpactSummary } from "../../api/requests"

export const useGetImpactSummary = () => {
  return useQuery({
    queryKey: impactKeys.summary(),
    queryFn: getImpactSummary,
  })
}