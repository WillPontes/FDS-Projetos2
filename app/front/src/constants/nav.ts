import {
  ChartLine,
  FileText,
  Home,
  LucideIcon,
  Map,
  Settings,
  Ticket,
  Truck,
  UserCog,
  Users,
} from "lucide-react";
import type { UserRole } from "@/constants/current-user";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  roles?: UserRole[];
};

export const APP_NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: ChartLine },
  {
    to: "/frota",
    label: "Frota",
    icon: Truck,
    exact: true,
    roles: ["admin", "gestor_frota"],
  },
  {
    to: "/relatorios",
    label: "Relatórios",
    icon: FileText,
    exact: true,
    roles: ["admin", "gestor_frota"],
  },
  {
    to: "/motoristas",
    label: "Motoristas",
    icon: Users,
    exact: true,
    roles: ["admin", "gestor_frota"],
  },
  {
    to: "/usuarios",
    label: "Usuários",
    icon: UserCog,
    exact: true,
    roles: ["admin"],
  },
  {
    to: "/configuracoes",
    label: "Configurações",
    icon: Settings,
    exact: true,
    roles: ["admin"],
  },
  { to: "/impacto", label: "Meu Impacto", icon: Home },
  { to: "/rota", label: "Calcular Rota", icon: Map },
  { to: "/passagens", label: "Minhas Passagens", icon: Ticket },
];

export function filterNavItemsByRole(
  items: NavItem[],
  role: UserRole | undefined,
): NavItem[] {
  if (!role) return items.filter((item) => !item.roles);
  return items.filter((item) => !item.roles || item.roles.includes(role));
}
