import { api } from "@/lib/http-client"
import { mockStore, resolveWithMock } from "@/mocks"
import type {
  CreateVehiclePayload,
  GetVehiclesParams,
  GetVehiclesResponse,
  UpdateVehiclePayload,
  Vehicle,
} from "./types"
import type { VehicleFormData } from "../schemas/vehicle-schema"

type ApiVehicle = {
  id: number
  plate?: string
  model?: string
  year?: number
  status?: VehicleFormData["status"]
  fuel_type?: string
  fuelType?: string
}

function mapVehicle(raw: ApiVehicle): Vehicle {
  return {
    id: raw.id,
    plate: raw.plate ?? "",
    model: raw.model ?? "",
    year: raw.year ?? new Date().getFullYear(),
    status: raw.status ?? "active",
    fuelType: raw.fuelType ?? raw.fuel_type ?? "",
  }
}

export async function getVehicles(params?: GetVehiclesParams): Promise<GetVehiclesResponse> {
  return resolveWithMock(
    () =>
      api
        .get("/api/fleet/vehicles", {
          searchParams: params as Record<string, string | number | undefined>,
        })
        .json<GetVehiclesResponse>(),
    () => mockStore.getFleetVehicles(params),
  )
}

export async function createVehicle(data: CreateVehiclePayload): Promise<Vehicle> {
  return resolveWithMock(
    async () => {
      const { fuelType, ...rest } = data
      const raw = await api
        .post("/api/fleet/vehicles", { json: { ...rest, fuel_type: fuelType } })
        .json<ApiVehicle>()
      return mapVehicle(raw)
    },
    () => mockStore.createFleetVehicle(data),
  )
}

export async function getVehicle(id: number): Promise<Vehicle> {
  return resolveWithMock(
    async () => {
      const raw = await api.get(`/api/fleet/vehicles/${id}`).json<ApiVehicle>()
      return mapVehicle(raw)
    },
    () => mockStore.getFleetVehicle(id),
  )
}

export async function updateVehicle(
  id: number,
  data: UpdateVehiclePayload,
): Promise<Vehicle> {
  return resolveWithMock(
    async () => {
      const { fuelType, ...rest } = data
      const raw = await api
        .patch(`/api/fleet/vehicles/${id}`, { json: { ...rest, fuel_type: fuelType } })
        .json<ApiVehicle>()
      return mapVehicle(raw)
    },
    () => mockStore.updateFleetVehicle(id, data),
  )
}
