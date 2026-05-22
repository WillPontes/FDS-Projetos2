import { api } from "@/lib/http-client";
import type { ListUsersParams, ListUsersResponse } from "./types";

export async function getUsers(
  _params?: ListUsersParams,
): Promise<ListUsersResponse> {
  return api.get("/api/users/").json<ListUsersResponse>();
}
