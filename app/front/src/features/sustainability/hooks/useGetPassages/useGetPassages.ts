import { useQuery } from "@tanstack/react-query"
import { sustainabilityKeys } from "../../api/query-keys"
import { getPassages } from "../../api/requests"
import type { GetPassagesParams } from "../../schemas/sustainability-schema"

export const useGetPassages = (params: GetPassagesParams = {}) => {
  return useQuery({
    queryKey: sustainabilityKeys.passages(params),
    queryFn: () => getPassages(params),
  })
}
