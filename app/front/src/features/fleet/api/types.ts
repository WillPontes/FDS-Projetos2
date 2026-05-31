import type { Vehicle, VehicleFormData, VehicleUpdateData } from "../schemas/vehicle-schema";

export type { Vehicle, VehicleFormData, VehicleUpdateData };

export type GetVehiclesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type GetVehiclesResponse = {
  items: Vehicle[];
  total: number;
};

export type CreateVehiclePayload = VehicleFormData;

export type UpdateVehiclePayload = VehicleUpdateData;

export type UpdateVehicleVariables = {
  id: number;
  data: UpdateVehiclePayload;
};
