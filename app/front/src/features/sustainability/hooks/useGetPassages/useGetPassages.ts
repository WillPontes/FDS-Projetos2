import { useQuery } from "@tanstack/react-query"
import { useCurrentUser } from "@/features/auth"
import { sustainabilityKeys } from "../../api/query-keys"
import { getPassages } from "../../api/requests"
import type { GetPassagesParams } from "../../schemas/sustainability-schema"

export const useGetPassages = (params: GetPassagesParams = {}) => {
  const { user } = useCurrentUser()

  return useQuery({
    queryKey: sustainabilityKeys.passages(user?.id, params),
    queryFn: () => getPassages(user!.id, params),
    enabled: user != null,
  })
}
