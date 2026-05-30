import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrentUser, UserRole } from "./types";

const DEFAULT_USER: CurrentUser = {
  id: 1,
  name: "Admin",
  email: "admin@taggy.com",
  role: "admin",
  status: "active",
};

type AuthState = {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: (user?: CurrentUser) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  updateUser: (partial: Partial<CurrentUser>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEFAULT_USER,
      isAuthenticated: true,
      login: (user = DEFAULT_USER) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setRole: (role) =>
        set((state) => ({
          user: state.user ? { ...state.user, role } : null,
        })),
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: "taggy-auth",
    },
  ),
);
