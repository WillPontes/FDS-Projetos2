import type { LucideIcon } from "lucide-react"
import {
  Home,
  LayoutDashboard,
  Truck,
  Users,
  Leaf,
  History,
  Plus,
} from "lucide-react"

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

export const APP_NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Início", icon: Home, exact: true },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/frota", label: "Frota", icon: Truck, exact: true },
  { to: "/users", label: "Usuários", icon: Users },
  { to: "/impact", label: "Meu impacto", icon: Leaf },
  { to: "/passagens", label: "Minhas passagens", icon: History },
  { to: "/frota/adicionar", label: "Novo veículo", icon: Plus },
]
