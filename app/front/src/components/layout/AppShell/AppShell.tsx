import { Outlet } from "@tanstack/react-router"
import { AppLayout } from "../AppLayout"

export const AppShell = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
