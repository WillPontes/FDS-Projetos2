import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getToastErrorMessage } from "@/lib/api-error";
import { login, type LoginCredentials } from "../api/requests";
import { useAuthStore } from "../auth-store";
import { mapUserToCurrentUser } from "../utils/map-user";
import type { UserRole } from "../types";

const ROLE_HOME: Record<UserRole, string> = {
  admin: "/",
  gestor_frota: "/",
  motorista: "/impacto",
};

type LoginOptions = {
  redirectTo?: string;
};

export const useLogin = (options?: LoginOptions) => {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (user) => {
      loginStore(mapUserToCurrentUser(user));
      const destination =
        options?.redirectTo && options.redirectTo !== "/login"
          ? options.redirectTo
          : ROLE_HOME[user.role];
      navigate({ to: destination });
      toast.success(`Bem-vindo, ${user.name}!`);
    },
    onError: (error) => {
      toast.error(
        getToastErrorMessage(error, {
          fallback: "E-mail ou senha inválidos.",
        }),
      );
    },
  });
};
