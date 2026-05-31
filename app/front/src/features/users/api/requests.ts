import { api } from "@/lib/http-client";
import type {
  ListUsersParams,
  ListUsersResponse,
  UpdateUserPayload,
  User,
} from "./types";

export async function getUsers(
  params?: ListUsersParams,
): Promise<ListUsersResponse> {
  return api
    .get("/api/users/", {
      searchParams: {
        ...(params?.role && { role: params.role }),
        ...(params?.organization_id != null && { organization_id: params.organization_id }),
      },
    })
    .json<ListUsersResponse>();
}

export async function getUserById(id: number): Promise<User | undefined> {
  const users = await api.get("/api/users/").json<ListUsersResponse>();
  return users.find((user) => user.id === id);
}

export async function createUser(data: {
  name: string;
  email: string;
  role?: string;
  organization_id?: number | null;
}): Promise<User> {
  return api
    .post("/api/users/", {
      searchParams: {
        name: data.name,
        email: data.email,
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
