import { api } from "@/lib/http-client";

export type RawVehicle = {
  id: number;
  id_tag: string;
  user_id: number;
  organization_id: number | null;
  assigned_driver_id: number | null;
  license_plate: string;
  model: string;
  fuel_type: string;
};

export async function getRawVehicles(): Promise<RawVehicle[]> {
  const response = await api
    .get("/api/vehicles/", { searchParams: { page: 1, page_size: 100 } })
    .json<{ items: RawVehicle[]; total: number }>();
  return response.items;
}
