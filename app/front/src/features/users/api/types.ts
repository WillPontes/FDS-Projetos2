import type { UserRole } from "@/constants/current-user";

export type { UserRole };

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  organization_id: number | null;
};

export type UserWithVehicle = User & {
  plate?: string | null;
  vehicleId?: number | null;
  vehicleTag?: string | null;
  /** Veículo cadastrado na frota da organização (não motorista individual). */
  isFleetLinked?: boolean;
  fleetOrganizationId?: number | null;
};

export type ListUsersParams = Record<string, never>;

export type ListUsersResponse = User[];

export type UpdateUserPayload = Partial<
  Pick<User, "name" | "email" | "role" | "organization_id">
>;
