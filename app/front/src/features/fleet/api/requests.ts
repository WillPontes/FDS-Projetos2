import { useAuthStore } from "@/features/auth/auth-store"
import { api } from "@/lib/http-client"
import type { User } from "@/features/users/api/types"
import type {
  CreateVehiclePayload,
  Fleet,
  FleetSummary,
  GetFleetsParams,
  GetVehiclesParams,
  GetVehiclesResponse,
  Organization,
  OrganizationSummary,
  OrganizationTransaction,
  UpdateVehiclePayload,
  Vehicle,
  VehicleSummary,
  VehicleTransaction,
} from "./types"

function currentUserId(): number {
  return useAuthStore.getState().user?.id ?? 1
}

export async function getVehicles(params?: GetVehiclesParams): Promise<GetVehiclesResponse> {
  return api
    .get("/api/vehicles/", {
      searchParams: {
        ...(params?.page != null && { page: params.page }),
        ...(params?.pageSize != null && { page_size: params.pageSize }),
        ...(params?.search && { search: params.search }),
        ...(params?.organizationId != null && { organization_id: params.organizationId }),
        ...(params?.fleetId != null && { fleet_id: params.fleetId }),
        ...(params?.semFrota != null && { sem_frota: params.semFrota }),
        ...(params?.fuelType && { fuel_type: params.fuelType }),
      },
    })
    .json<GetVehiclesResponse>()
}

export async function getOrganizations(): Promise<Organization[]> {
  const res = await api.get("/api/organizations").json<{ data: Organization[] }>()
  return res.data
}

export async function getOrganization(id: number): Promise<Organization> {
  const res = await api.get(`/api/organizations/${id}`).json<{ data: Organization }>()
  return res.data
}

export async function createOrganization(data: { name: string; cnpj?: string }): Promise<Organization> {
  const res = await api.post("/api/organizations", { json: data }).json<{ data: Organization }>()
  return res.data
}

export async function updateOrganization(id: number, data: { name?: string; cnpj?: string }): Promise<Organization> {
  const res = await api.patch(`/api/organizations/${id}`, { json: data }).json<{ data: Organization }>()
  return res.data
}

export async function deleteOrganization(id: number): Promise<void> {
  await api.delete(`/api/organizations/${id}`)
}

export async function getOrganizationSummary(orgId: number): Promise<OrganizationSummary> {
  return api.get(`/api/organizations/${orgId}/summary`).json<OrganizationSummary>()
}

export async function getOrganizationUsers(orgId: number): Promise<User[]> {
  return api.get(`/api/organizations/${orgId}/users`).json<User[]>()
}

export async function linkOrganizationUser(orgId: number, userId: number): Promise<void> {
  await api.post(`/api/organizations/${orgId}/users/${userId}`)
}

export async function unlinkOrganizationUser(orgId: number, userId: number): Promise<void> {
  await api.delete(`/api/organizations/${orgId}/users/${userId}`)
}

export async function getOrganizationTransactions(
  orgId: number,
  page = 1,
  pageSize = 10,
): Promise<{ items: OrganizationTransaction[]; total: number }> {
  return api
    .get(`/api/organizations/${orgId}/transactions`, {
      searchParams: { page, page_size: pageSize },
    })
    .json<{ items: OrganizationTransaction[]; total: number }>()
}

export async function getFleets(params?: GetFleetsParams): Promise<Fleet[]> {
  const res = await api
    .get("/api/fleets/", {
      searchParams: {
        ...(params?.organizationId != null && { organization_id: params.organizationId }),
        ...(params?.search && { search: params.search }),
        ...(params?.paginate && { paginate: "true" }),
        ...(params?.page != null && { page: params.page }),
        ...(params?.pageSize != null && { page_size: params.pageSize }),
      },
    })
    .json<{ data: Fleet[] } | { items: Fleet[]; total: number }>()

  if ("data" in res) return res.data
  return res.items
}

export async function getFleet(fleetId: number): Promise<Fleet> {
  const res = await api.get(`/api/fleets/${fleetId}`).json<{ data: Fleet }>()
  return res.data
}

export async function createFleet(data: { name: string; organization_id: number }): Promise<Fleet> {
  const res = await api.post("/api/fleets/", { json: data }).json<{ data: Fleet }>()
  return res.data
}

export async function updateFleet(fleetId: number, data: { name?: string }): Promise<Fleet> {
  const res = await api.patch(`/api/fleets/${fleetId}`, { json: data }).json<{ data: Fleet }>()
  return res.data
}

export async function deleteFleet(fleetId: number): Promise<void> {
  await api.delete(`/api/fleets/${fleetId}`)
}

export async function getFleetSummary(fleetId: number): Promise<FleetSummary> {
  return api.get(`/api/fleets/${fleetId}/summary`).json<FleetSummary>()
}

export async function getFleetUsers(fleetId: number): Promise<User[]> {
  return api.get(`/api/fleets/${fleetId}/users`).json<User[]>()
}

export async function linkFleetUser(fleetId: number, userId: number): Promise<void> {
  await api.post(`/api/fleets/${fleetId}/users/${userId}`)
}

export async function unlinkFleetUser(fleetId: number, userId: number): Promise<void> {
  await api.delete(`/api/fleets/${fleetId}/users/${userId}`)
}

export async function getFleetVehicles(fleetId: number): Promise<Vehicle[]> {
  return api.get(`/api/fleets/${fleetId}/vehicles`).json<Vehicle[]>()
}

export async function linkFleetVehicle(fleetId: number, vehicleId: number): Promise<Vehicle> {
  const res = await api
    .post(`/api/fleets/${fleetId}/vehicles/${vehicleId}`)
    .json<{ data: Vehicle }>()
  return res.data
}

export async function unlinkFleetVehicle(fleetId: number, vehicleId: number): Promise<void> {
  await api.delete(`/api/fleets/${fleetId}/vehicles/${vehicleId}`)
}

export async function getFleetTransactions(
  fleetId: number,
  page = 1,
  pageSize = 10,
  filters?: TransactionQueryParams,
): Promise<{ items: VehicleTransaction[]; total: number }> {
  return api
    .get(`/api/fleets/${fleetId}/transactions`, {
      searchParams: {
        page,
        page_size: pageSize,
        ...(filters?.context && { context: filters.context }),
        ...(filters?.uf && { uf: filters.uf }),
        ...(filters?.fromDate && { from_date: filters.fromDate }),
        ...(filters?.toDate && { to_date: filters.toDate }),
      },
    })
    .json<{ items: VehicleTransaction[]; total: number }>()
}

export async function createVehicle(data: CreateVehiclePayload): Promise<Vehicle> {
  return api
    .post("/api/vehicles/", {
      json: {
        id_tag: data.id_tag,
        license_plate: data.license_plate,
        model: data.model,
        fuel_type: data.fuel_type,
        category: data.category,
        ...(data.average_autonomy_km != null && {
          average_autonomy_km: data.average_autonomy_km,
        }),
        user_id: currentUserId(),
        ...(data.organization_id != null && { organization_id: data.organization_id }),
        ...(data.fleet_id != null && { fleet_id: data.fleet_id }),
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
        ...(data.category && { category: data.category }),
        ...("average_autonomy_km" in data && {
          average_autonomy_km: data.average_autonomy_km,
        }),
        ...("organization_id" in data && { organization_id: data.organization_id }),
        ...("fleet_id" in data && { fleet_id: data.fleet_id }),
      },
    })
    .json<Vehicle>()
}

export async function deleteVehicle(id: number): Promise<void> {
  await api.delete(`/api/vehicles/${id}`)
}

export async function getVehicleSummary(vehicleId: number): Promise<VehicleSummary> {
  return api.get(`/api/vehicles/${vehicleId}/summary`).json<VehicleSummary>()
}

export async function getVehicleTransactions(
  vehicleId: number,
  page = 1,
  pageSize = 10,
): Promise<{ items: VehicleTransaction[]; total: number }> {
  return api
    .get(`/api/vehicles/${vehicleId}/transactions`, {
      searchParams: { page, page_size: pageSize },
    })
    .json<{ items: VehicleTransaction[]; total: number }>()
}

export type TransactionQueryParams = {
  plate?: string;
  context?: string;
  uf?: string;
  fromDate?: string;
  toDate?: string;
};

export async function getUserTransactions(
  userId: number,
  page = 1,
  pageSize = 10,
  filters?: TransactionQueryParams,
): Promise<{ items: VehicleTransaction[]; total: number }> {
  return api
    .get("/api/transactions/", {
      searchParams: {
        user_id: userId,
        page,
        page_size: pageSize,
        ...(filters?.plate && { plate: filters.plate }),
        ...(filters?.context && { context: filters.context }),
        ...(filters?.uf && { uf: filters.uf }),
        ...(filters?.fromDate && { from_date: filters.fromDate }),
        ...(filters?.toDate && { to_date: filters.toDate }),
      },
    })
    .json<{ items: VehicleTransaction[]; total: number }>()
}

export async function getVehicleTransactionsFiltered(
  vehicleId: number,
  page = 1,
  pageSize = 10,
  filters?: TransactionQueryParams,
): Promise<{ items: VehicleTransaction[]; total: number }> {
  return api
    .get("/api/transactions/", {
      searchParams: {
        vehicle_id: vehicleId,
        page,
        page_size: pageSize,
        ...(filters?.context && { context: filters.context }),
        ...(filters?.uf && { uf: filters.uf }),
        ...(filters?.fromDate && { from_date: filters.fromDate }),
        ...(filters?.toDate && { to_date: filters.toDate }),
      },
    })
    .json<{ items: VehicleTransaction[]; total: number }>()
}

export async function getOrganizationTransactionsFiltered(
  orgId: number,
  page = 1,
  pageSize = 10,
  filters?: TransactionQueryParams,
): Promise<{ items: VehicleTransaction[]; total: number }> {
  return api
    .get("/api/transactions/", {
      searchParams: {
        organization_id: orgId,
        page,
        page_size: pageSize,
        ...(filters?.context && { context: filters.context }),
        ...(filters?.uf && { uf: filters.uf }),
        ...(filters?.fromDate && { from_date: filters.fromDate }),
        ...(filters?.toDate && { to_date: filters.toDate }),
      },
    })
    .json<{ items: VehicleTransaction[]; total: number }>()
}
