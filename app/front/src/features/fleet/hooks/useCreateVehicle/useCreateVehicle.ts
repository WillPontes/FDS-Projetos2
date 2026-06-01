import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api-error"
import { createVehicle } from "../../api/requests"
import { vehicleKeys } from "../../api/query-keys"

export const useCreateVehicle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Erro ao cadastrar veículo.")
    },
  })
}
