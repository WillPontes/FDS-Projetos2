import { api } from "@/lib/http-client"
import type {
  CreateVehiclePayload,
  GetVehiclesParams,
  GetVehiclesResponse,
  UpdateVehiclePayload,
  Vehicle,
} from "./types"

export async function getVehicles(params?: GetVehiclesParams): Promise<GetVehiclesResponse> {
  return api
    .get("/api/vehicles/", {
      searchParams: {
        ...(params?.page != null && { page: params.page }),
        ...(params?.pageSize != null && { page_size: params.pageSize }),
        ...(params?.search && { search: params.search }),
      },
    })
    .json<GetVehiclesResponse>()
}

export async function createVehicle(data: CreateVehiclePayload): Promise<Vehicle> {
  return api
    .post("/api/vehicles/", {
      json: {
        id_tag: data.id_tag,
        license_plate: data.license_plate,
        model: data.model,
        fuel_type: data.fuel_type,
        user_id: 1,
      },
    })
    .json<Vehicle>()
}

export async function getVehicle(id: number): Promise<Vehicle> {
  return api.get(`/api/vehicles/${id}`).json<Vehicle>()
}

export async function updateVehicle(id: number, data: UpdateVehiclePayload): Promise<Vehicle> {
  return api
    .patch(`/api/vehicles/${id}`, {
      json: {
        ...(data.id_tag && { id_tag: data.id_tag }),
        ...(data.license_plate && { license_plate: data.license_plate }),
        ...(data.model && { model: data.model }),
        ...(data.fuel_type && { fuel_type: data.fuel_type }),
      },
    })
    .json<Vehicle>()
}

export async function deleteVehicle(id: number): Promise<void> {
  await api.delete(`/api/vehicles/${id}`)
}
