import type { User } from "@/features/users/api/types";

const DEFAULT_NOTIFICATION_PREFS = {
  email_alerts: true,
  push_alerts: false,
  weekly_report: true,
} as const;

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "Ana Admin",
    email: "ana.admin@taggy.com.br",
    role: "admin",
    organization_id: 1,
    ...DEFAULT_NOTIFICATION_PREFS,
  },
  {
    id: 2,
    name: "Carlos Gestor",
    email: "carlos.gestor@taggy.com.br",
    role: "gestor_frota",
    organization_id: 1,
    ...DEFAULT_NOTIFICATION_PREFS,
  },
  {
    id: 3,
    name: "João Motorista",
    email: "joao.motorista@taggy.com.br",
    role: "motorista",
    organization_id: 1,
    ...DEFAULT_NOTIFICATION_PREFS,
  },
  {
    id: 4,
    name: "Maria Motorista",
    email: "maria.motorista@taggy.com.br",
    role: "motorista",
    organization_id: 1,
    ...DEFAULT_NOTIFICATION_PREFS,
  },
  {
    id: 5,
    name: "Pedro Motorista",
    email: "pedro.motorista@taggy.com.br",
    role: "motorista",
    organization_id: 1,
    ...DEFAULT_NOTIFICATION_PREFS,
  },
  {
    id: 6,
    name: "Lucia Operadora",
    email: "lucia.operadora@taggy.com.br",
    role: "gestor_frota",
    organization_id: 2,
    ...DEFAULT_NOTIFICATION_PREFS,
  },
];
