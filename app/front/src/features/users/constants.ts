import type { UserRole } from "@/constants/current-user";
import { USER_ROLE_LABELS } from "@/constants/current-user";

export { USER_ROLE_LABELS };

export const USER_ROLE_OPTIONS: { value: UserRole | "all"; label: string }[] = [
  { value: "all", label: "Todos os perfis" },
  { value: "motorista", label: USER_ROLE_LABELS.motorista },
  { value: "gestor_frota", label: USER_ROLE_LABELS.gestor_frota },
  { value: "admin", label: USER_ROLE_LABELS.admin },
];

/** Senha inicial para usuários criados pelo painel (desenvolvimento). */
export const DEFAULT_USER_PASSWORD = "taggy123";
