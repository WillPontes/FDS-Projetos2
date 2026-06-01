export type UserRole = "motorista" | "gestor_frota" | "admin";

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  organization_id?: number | null;
  avatarUrl?: string;
  status?: "active" | "inactive";
};
