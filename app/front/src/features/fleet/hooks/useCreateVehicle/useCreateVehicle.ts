import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createVehicle } from "../../api/requests"
import { vehicleKeys } from "../../api/query-keys"

export const useCreateVehicle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
    },
  })
}
