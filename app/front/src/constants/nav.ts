import { Dashboard } from "@/components/icons/Dashboard";
import { Frotas } from "@/components/icons/Frotas";
import { Motoristas } from "@/components/icons/Motoristas";
import { Relatorios } from "@/components/icons/Relatorios";
import { Veiculos } from "@/components/icons/Veiculos";

export type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType;
  exact?: boolean;
};

export const APP_NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: Dashboard },
  { to: "/frota", label: "Frota", icon: Frotas, exact: true },
  { to: "/relatorios", label: "Relatórios", icon: Relatorios, exact: true },
  { to: "/veiculos", label: "Veículos", icon: Veiculos },
  { to: "/impacto", label: "Meu impacto", icon: Motoristas },
  { to: "/passagens", label: "Minhas passagens", icon: Motoristas },
  { to: "/motoristas", label: "Motoristas", icon: Motoristas },
];
