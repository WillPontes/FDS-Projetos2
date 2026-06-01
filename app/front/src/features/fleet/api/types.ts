import type { Vehicle, VehicleFormData, VehicleUpdateData } from "../schemas/vehicle-schema";

export type { Vehicle, VehicleFormData, VehicleUpdateData };

export type GetVehiclesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  organizationId?: number;
  fleetId?: number;
  semFrota?: boolean;
  fuelType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type Organization = {
  id: number;
  name: string;
  cnpj: string | null;
  created_at: string;
};

export type Fleet = {
  id: number;
  name: string;
  organization_id: number;
  created_at: string;
};

export type OrganizationSummary = {
  vehicle_count: number;
  driver_count: number;
  transaction_count: number;
  total_savings_brl: number;
  co2_total_kg: number;
  fuel_total_liters: number;
  paper_saved_meters: number;
};

export type FleetSummary = {
  vehicle_count: number;
  driver_count: number;
  transaction_count: number;
  co2_total_kg: number;
  fuel_total_liters: number;
  total_savings_brl: number;
  paper_saved_meters: number;
};

export type VehicleSummary = {
  transaction_count: number;
  co2_total_kg: number;
  fuel_total_liters: number;
  financial_total_brl: number;
  time_total_sec: number;
  paper_saved_meters: number;
};

export type OrganizationTransaction = {
  id: number;
  plate: string | null;
  context: string;
  uf: string | null;
  financial_savings_brl: number | null;
  co2_avoided_kg: number | null;
  created_at: string;
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

export type VehicleTransaction = {
  id: number;
  plate: string | null;
  context: string;
  uf: string | null;
  financial_savings_brl: number | null;
  co2_avoided_kg: number | null;
  fuel_saved_liters: number | null;
  time_saved_sec: number | null;
  created_at: string;
};

export type GetFleetsParams = {
  organizationId?: number;
  search?: string;
  page?: number;
  pageSize?: number;
  paginate?: boolean;
};
