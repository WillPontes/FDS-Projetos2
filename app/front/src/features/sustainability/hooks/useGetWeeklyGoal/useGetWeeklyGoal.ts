import { useQuery } from "@tanstack/react-query"
import { useCurrentUser } from "@/features/auth"
import { sustainabilityKeys } from "../../api/query-keys"
import { getWeeklyGoal } from "../../api/requests"

export const useGetWeeklyGoal = () => {
  const { user } = useCurrentUser()

  return useQuery({
    queryKey: sustainabilityKeys.weeklyGoal(user?.id),
    queryFn: () => getWeeklyGoal(user!.id),
    enabled: user != null,
  })
}
