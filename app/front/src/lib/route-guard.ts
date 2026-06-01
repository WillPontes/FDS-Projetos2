import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/auth-store";
import type { UserRole } from "@/features/auth/types";

const ROLE_FALLBACK: Record<UserRole, string> = {
  admin: "/",
  gestor_frota: "/",
  motorista: "/impacto",
};

export function requireAuth() {
  return () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || !user) {
      throw redirect({ to: "/login" });
    }
  };
}

export function requireRoles(roles: UserRole[], fallback?: string) {
  return () => {
    const user = useAuthStore.getState().user;
    if (!user || !roles.includes(user.role)) {
      throw redirect({ to: fallback ?? ROLE_FALLBACK[user?.role ?? "motorista"] });
    }
  };
}

export function requireMotoristaOnly() {
  return requireRoles(["motorista"]);
}

export function requireManagerOrAdmin() {
  return requireRoles(["admin", "gestor_frota"], "/impacto");
}
