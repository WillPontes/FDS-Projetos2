import { useQuery } from "@tanstack/react-query"
import { sustainabilityKeys } from "../../api/query-keys"
import { getWeeklyGoal } from "../../api/requests"

export const useGetWeeklyGoal = () => {
  return useQuery({
    queryKey: sustainabilityKeys.weeklyGoal(),
    queryFn: getWeeklyGoal,
  })
}
