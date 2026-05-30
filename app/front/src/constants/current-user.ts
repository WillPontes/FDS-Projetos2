export type UserRole = "motorista" | "gestor_frota" | "admin";

export const CURRENT_USER = {
  name: "Ana Silva",
  role: "gestor_frota" as UserRole,
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  motorista: "Motorista",
  gestor_frota: "Gestor de Frota",
  admin: "Administrador",
};
