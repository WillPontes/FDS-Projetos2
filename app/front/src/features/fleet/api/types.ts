import type { Vehicle, VehicleFormData } from "../schemas/vehicle-schema";

export type { Vehicle, VehicleFormData };

export type GetVehiclesParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  fuelType?: string;
  region?: string;
};

export type GetVehiclesResponse = {
  items: Vehicle[];
  total: number;
};

export type CreateVehiclePayload = VehicleFormData;

export type UpdateVehiclePayload = VehicleFormData;

export type UpdateVehicleVariables = {
  id: number;
  data: UpdateVehiclePayload;
};
