import { useQuery } from "@tanstack/react-query"
import { sustainabilityKeys } from "../../api/query-keys"
import { getPassagesSummary } from "../../api/requests"

export const useGetPassagesSummary = () => {
  return useQuery({
    queryKey: sustainabilityKeys.passagesSummary(),
    queryFn: getPassagesSummary,
  })
}
