import { useAuthStore } from "../auth-store";

export const useCurrentUser = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return { user, isAuthenticated };
};
