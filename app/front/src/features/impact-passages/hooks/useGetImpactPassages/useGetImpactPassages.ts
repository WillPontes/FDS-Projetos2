import { useQuery } from "@tanstack/react-query"
import { impactKeys } from "../../api/query-keys"
import { getImpactPassages } from "../../api/requests"

export const useGetImpactPassages = () => {
  return useQuery({
    queryKey: impactKeys.passages(),
    queryFn: getImpactPassages,
  })
}