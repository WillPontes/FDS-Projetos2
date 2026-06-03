import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthStore } from "../auth-store";
import type { CurrentUser, UserRole } from "../types";

const ROLE_HOME: Record<UserRole, string> = {
  admin: "/",
  gestor_frota: "/",
  motorista: "/impacto",
};

type DevPersonaLoginOptions = {
  redirectTo?: string;
};

export function useDevPersonaLogin(options?: DevPersonaLoginOptions) {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  return (persona: CurrentUser) => {
    loginStore(persona);
    const destination =
      options?.redirectTo && options.redirectTo !== "/login"
        ? options.redirectTo
        : ROLE_HOME[persona.role];
    navigate({ to: destination });
    toast.success(`Bem-vindo, ${persona.name}! (dev)`);
  };
}
