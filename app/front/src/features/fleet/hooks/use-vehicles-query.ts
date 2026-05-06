import { useQuery } from "@tanstack/react-query"
import { getVehicles } from "../api/requests"
import { vehicleKeys } from "../api/query-keys"
import type { GetVehiclesParams } from "../api/types"

export function useVehiclesQuery(params: GetVehiclesParams = {}) {
  return useQuery({
    queryKey: vehicleKeys.list(params),
    queryFn: () => getVehicles(params),
  })
}
