import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../auth-store";

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
    navigate({ to: "/" });
  };
};
