import type { User } from "@/features/users/api/types";
import type { CurrentUser } from "../types";

export function mapUserToCurrentUser(user: User): CurrentUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    organization_id: user.organization_id,
    status: "active",
  };
}
