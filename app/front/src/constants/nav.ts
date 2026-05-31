import {
  Building2,
  ChartLine,
  FileText,
  Home,
  LucideIcon,
  Landmark,
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
  { to: "/", label: "Dashboard", icon: ChartLine, exact: true, roles: ["admin", "gestor_frota"] },
  {
    to: "/frotas",
    label: "Frotas",
    icon: Building2,
    exact: true,
    roles: ["admin", "gestor_frota"],
  },
  {
    to: "/frota",
    label: "Veículos",
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
    to: "/organizacoes",
    label: "Organizações",
    icon: Landmark,
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
  { to: "/impacto", label: "Meu Impacto", icon: Home, exact: true, roles: ["motorista"] },
  { to: "/rota", label: "Calcular Rota", icon: Map, roles: ["motorista"] },
  { to: "/passagens", label: "Minhas Passagens", icon: Ticket, exact: true, roles: ["motorista"] },
];

export function filterNavItemsByRole(
  items: NavItem[],
  role: UserRole | undefined,
): NavItem[] {
  if (!role) return items.filter((item) => !item.roles);
  return items.filter((item) => !item.roles || item.roles.includes(role));
}
