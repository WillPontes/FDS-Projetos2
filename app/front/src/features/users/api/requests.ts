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
