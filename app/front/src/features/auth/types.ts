export type UserRole = "motorista" | "gestor_frota" | "admin";

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  status?: "active" | "inactive";
};
