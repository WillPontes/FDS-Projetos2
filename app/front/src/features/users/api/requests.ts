import { api } from "@/lib/http-client";
import { mockStore, resolveWithMock } from "@/mocks";
import type {
  ListUsersParams,
  ListUsersResponse,
  UpdateUserPayload,
  User,
} from "./types";

export async function getUsers(
  _params?: ListUsersParams,
): Promise<ListUsersResponse> {
  return resolveWithMock(
    () => api.get("/api/users/").json<ListUsersResponse>(),
    () => mockStore.getUsers(),
  );
}

export async function getUserById(id: number): Promise<User | undefined> {
  return resolveWithMock(
    async () => {
      const users = await api.get("/api/users/").json<ListUsersResponse>();
      return users.find((user) => user.id === id);
    },
    () => mockStore.getUserById(id),
  );
}

export async function updateUserMock(
  id: number,
  payload: UpdateUserPayload,
): Promise<User> {
  return resolveWithMock(
    async () => {
      const users = await api.get("/api/users/").json<ListUsersResponse>();
      const existing = users.find((user) => user.id === id);
      if (!existing) {
        throw new Error("Usuário não encontrado.");
      }
      return { ...existing, ...payload };
    },
    () => mockStore.updateUser(id, payload),
  );
}

export async function deleteUserMock(id: number): Promise<void> {
  return resolveWithMock(
    async () => {
      const users = await api.get("/api/users/").json<ListUsersResponse>();
      const existing = users.find((user) => user.id === id);
      if (!existing) {
        throw new Error("Usuário não encontrado.");
      }
    },
    () => {
      mockStore.deleteUser(id);
    },
  );
}
