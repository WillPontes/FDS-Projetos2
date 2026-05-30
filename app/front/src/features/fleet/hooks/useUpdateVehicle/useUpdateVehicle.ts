import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateVehicle } from "../../api/requests"
import { vehicleKeys } from "../../api/query-keys"
import type { UpdateVehicleVariables } from "../../api/types"

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateVehicleVariables) => updateVehicle(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(id) })
    },
  })
}
