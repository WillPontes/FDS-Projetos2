import type { GetVehiclesParams } from "./types"

export const vehicleKeys = {
  all: () => ["vehicles"] as const,
  lists: () => [...vehicleKeys.all(), "list"] as const,
  list: (params: GetVehiclesParams) => [...vehicleKeys.lists(), params] as const,
  details: () => [...vehicleKeys.all(), "detail"] as const,
  detail: (id: number) => [...vehicleKeys.details(), id] as const,
}
