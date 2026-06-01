import { api } from "@/lib/http-client";
import type { User } from "@/features/users/api/types";

export type LoginCredentials = {
  email: string;
  password: string;
};

export async function login(credentials: LoginCredentials): Promise<User> {
  return api
    .post("/api/auth/login", {
      json: {
        email: credentials.email.trim(),
        password: credentials.password,
      },
    })
    .json<User>();
}
