import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getToastErrorMessage } from "@/lib/api-error"
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
    onError: (error) => {
      toast.error(
        getToastErrorMessage(error, { fallback: "Erro ao atualizar veículo." }),
      )
    },
  })
}
