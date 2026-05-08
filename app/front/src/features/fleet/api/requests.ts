import { api } from "@/lib/http-client"
import type { CreateVehiclePayload, GetVehiclesParams, GetVehiclesResponse, Vehicle } from "./types"

export async function getVehicles(params?: GetVehiclesParams): Promise<GetVehiclesResponse> {
  return api
    .get("/api/fleet/vehicles", {
      searchParams: params as Record<string, string | number | undefined>,
    })
    .json<GetVehiclesResponse>()
}

export async function createVehicle(data: CreateVehiclePayload): Promise<Vehicle> {
  return api.post("/api/fleet/vehicles", { json: data }).json<Vehicle>()
}
