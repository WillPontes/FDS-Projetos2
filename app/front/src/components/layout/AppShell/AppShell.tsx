import { Outlet } from "@tanstack/react-router";
import { useCurrentUser } from "@/features/auth";
import { AppLayout } from "../AppLayout";

export const AppShell = () => {
  const { user } = useCurrentUser();

  return (
    <AppLayout userId={user?.id ?? null}>
      <Outlet />
    </AppLayout>
  );
};
