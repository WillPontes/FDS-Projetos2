import type { UserRole } from "@/constants/current-user";

export type { UserRole };

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  organization_id: number | null;
  email_alerts: boolean;
  push_alerts: boolean;
  weekly_report: boolean;
};

export type UserWithVehicle = User & {
  plate?: string | null;
  vehicleId?: number | null;
  vehicleTag?: string | null;
  /** Veículo cadastrado na frota da organização (não motorista individual). */
  isFleetLinked?: boolean;
  fleetOrganizationId?: number | null;
};

export type ListUsersParams = {
  role?: UserRole;
  organization_id?: number;
  fleet_id?: number;
  search?: string;
  page?: number;
  pageSize?: number;
  paginate?: boolean;
  linkable_to_organization_id?: number;
};

export type PaginatedUsersResponse = {
  items: User[];
  total: number;
};

export type ListUsersResponse = User[];

export type UpdateUserPayload = Partial<
  Pick<
    User,
    | "name"
    | "email"
    | "role"
    | "organization_id"
    | "email_alerts"
    | "push_alerts"
    | "weekly_report"
  >
>;

export type NotificationSettings = {
  emailAlerts: boolean;
  pushAlerts: boolean;
  weeklyReport: boolean;
};

export function userToNotificationSettings(user: User): NotificationSettings {
  return {
    emailAlerts: user.email_alerts,
    pushAlerts: user.push_alerts,
    weeklyReport: user.weekly_report,
  };
}

export function notificationSettingsToPayload(
  settings: NotificationSettings,
): Pick<User, "email_alerts" | "push_alerts" | "weekly_report"> {
  return {
    email_alerts: settings.emailAlerts,
    push_alerts: settings.pushAlerts,
    weekly_report: settings.weeklyReport,
  };
}
