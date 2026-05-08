import type { Vehicle, VehicleFormData } from "../schemas/vehicle-schema"

export type { Vehicle, VehicleFormData }

export type GetVehiclesParams = {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export type GetVehiclesResponse = {
  items: Vehicle[]
  total: number
}

export type CreateVehiclePayload = VehicleFormData
