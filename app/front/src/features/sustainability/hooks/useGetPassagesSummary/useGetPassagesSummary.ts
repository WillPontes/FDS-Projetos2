import { useQuery } from "@tanstack/react-query"
import { useCurrentUser } from "@/features/auth"
import { sustainabilityKeys } from "../../api/query-keys"
import { getPassagesSummary } from "../../api/requests"
import type { GetPassagesParams } from "../../schemas/sustainability-schema"

export const useGetPassagesSummary = (
  params?: Pick<GetPassagesParams, "fromDate" | "toDate">,
) => {
  const { user } = useCurrentUser()

  return useQuery({
    queryKey: sustainabilityKeys.passagesSummary(user?.id, params),
    queryFn: () => getPassagesSummary(user!.id, params),
    enabled: user != null,
  })
}
