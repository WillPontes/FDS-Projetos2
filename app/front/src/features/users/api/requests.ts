import { api } from "@/lib/http-client";
import { normalizePaginatedResponse } from "@/lib/paginated-response";
import type {
  ListUsersParams,
  ListUsersResponse,
  PaginatedUsersResponse,
  UpdateUserPayload,
  User,
} from "./types";

export async function getUsers(
  params?: ListUsersParams,
): Promise<ListUsersResponse> {
  const res = await api
    .get("/api/users/", {
      searchParams: {
        ...(params?.role && { role: params.role }),
        ...(params?.organization_id != null && {
          organization_id: params.organization_id,
        }),
        ...(params?.fleet_id != null && { fleet_id: params.fleet_id }),
        ...(params?.search && { search: params.search }),
        ...(params?.paginate && { paginate: "true" }),
        ...(params?.page != null && { page: params.page }),
        ...(params?.pageSize != null && { page_size: params.pageSize }),
      },
    })
    .json<ListUsersResponse | PaginatedUsersResponse>();

  if (Array.isArray(res)) return res;
  return res.items;
}

export async function getUsersPaginated(
  params?: ListUsersParams,
): Promise<PaginatedUsersResponse> {
  const res = await api
    .get("/api/users/", {
      searchParams: {
        ...(params?.role && { role: params.role }),
        ...(params?.organization_id != null && {
          organization_id: params.organization_id,
        }),
        ...(params?.fleet_id != null && { fleet_id: params.fleet_id }),
        ...(params?.linkable_to_organization_id != null && {
          linkable_to_organization_id: params.linkable_to_organization_id,
        }),
        ...(params?.search && { search: params.search }),
        paginate: "true",
        page: params?.page ?? 1,
        page_size: params?.pageSize ?? 20,
      },
    })
    .json();
  return normalizePaginatedResponse<User>(res);
}

export async function getUserById(id: number): Promise<User> {
  return api.get(`/api/users/${id}`).json<User>();
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
  organization_id?: number | null;
}): Promise<User> {
  return api
    .post("/api/users/", {
      searchParams: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role ?? "motorista",
        ...(data.organization_id != null && { organization_id: data.organization_id }),
      },
    })
    .json<User>();
}

export async function updateUser(
  id: number,
  payload: UpdateUserPayload,
): Promise<User> {
  return api
    .patch(`/api/users/${id}`, { json: payload })
    .json<User>();
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/api/users/${id}`);
}

export async function updateUserVehicles(
  userId: number,
  vehicleIds: number[],
): Promise<void> {
  await api.patch(`/api/users/${userId}/vehicles`, { json: { vehicle_ids: vehicleIds } });
}
