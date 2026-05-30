import { useQuery } from "@tanstack/react-query"
import { getVehicle } from "../../api/requests"
import { vehicleKeys } from "../../api/query-keys"

export const useGetVehicle = (id: number) => {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => getVehicle(id),
    enabled: Number.isFinite(id),
  })
}
