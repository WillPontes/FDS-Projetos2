import { api } from "@/lib/http-client";
import { mockStore, resolveWithMock } from "@/mocks";

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
  return resolveWithMock(
    () => api.get("/api/vehicles/").json<RawVehicle[]>(),
    () => mockStore.getRawVehicles(),
  );
}
