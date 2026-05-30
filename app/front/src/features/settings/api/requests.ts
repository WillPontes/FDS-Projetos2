import { api } from "@/lib/http-client";
import { mockStore, resolveWithMock } from "@/mocks";

export type TechnicalSpecs = {
  id: number;
  emission_factor_diesel_s10: number;
  emission_factor_gasolina_c: number;
  emission_factor_etanol: number;
  idle_rate_leve: number;
  idle_rate_pesado: number;
  paper_co2_per_ticket: number;
  paper_water_per_ticket: number;
  ludic_tree_year_absorption: number;
  ludic_phone_charge_factor: number;
  ludic_coffee_factor: number;
  baseline_pedagio_avg_wait_sec: number;
  baseline_estacionamento_avg_wait_sec: number;
  maint_cost_leve: number;
  maint_cost_pesado: number;
  accel_surge_leve: number;
  accel_surge_pesado: number;
  benchmark_kg_co2_per_km_car: number;
  benchmark_kg_co2_per_burger: number;
};

export type FuelPriceByUF = {
  uf: string;
  price_diesel_s10: number | null;
  price_gasolina_c: number | null;
  price_etanol: number | null;
  updated_at?: string;
};

export type TechnicalSpecsBundle = {
  specs: TechnicalSpecs;
  fuel_prices_by_uf: Record<string, FuelPriceByUF>;
};

export async function getTechnicalSpecsBundle(): Promise<TechnicalSpecsBundle> {
  return resolveWithMock(
    async () => {
      const response = await api
        .get("/api/technical-specs/")
        .json<{ data: TechnicalSpecsBundle }>();
      return response.data;
    },
    () => mockStore.getTechnicalSpecsBundle(),
  );
}

export async function updateTechnicalSpecs(
  payload: Partial<TechnicalSpecs>,
): Promise<TechnicalSpecs> {
  return resolveWithMock(
    () =>
      api
        .post("/api/technical-specs/update", { json: payload })
        .json<TechnicalSpecs>(),
    () => mockStore.updateTechnicalSpecs(payload),
  );
}

export async function getFuelPrices(): Promise<Record<string, FuelPriceByUF>> {
  return resolveWithMock(
    async () => {
      const response = await api
        .get("/api/fuel-prices/")
        .json<{ data: Record<string, FuelPriceByUF> }>();
      return response.data;
    },
    () => mockStore.getFuelPrices(),
  );
}

export async function syncFuelPrices(): Promise<Record<string, FuelPriceByUF>> {
  return resolveWithMock(
    async () => {
      const response = await api
        .post("/api/fuel-prices/sync")
        .json<{ data: Record<string, FuelPriceByUF> }>();
      return response.data;
    },
    () => mockStore.syncFuelPrices(),
  );
}

export async function updateFuelPriceMock(
  uf: string,
  payload: Partial<FuelPriceByUF>,
): Promise<FuelPriceByUF> {
  return resolveWithMock(
    async () => {
      const response = await api
        .post("/api/fuel-prices/sync")
        .json<{ data: Record<string, FuelPriceByUF> }>();
      const existing = response.data[uf];
      if (!existing) {
        throw new Error(`UF ${uf} não encontrada.`);
      }
      return { ...existing, ...payload, uf };
    },
    () => mockStore.updateFuelPrice(uf, payload),
  );
}

export type AdminAccountSettings = {
  email: string;
  twoFactorAuth: boolean;
};

const ADMIN_SETTINGS_KEY = "taggy-admin-settings";

export function loadAdminAccountSettings(
  fallbackEmail: string,
): AdminAccountSettings {
  try {
    const raw = localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (!raw) {
      return { email: fallbackEmail, twoFactorAuth: false };
    }
    return JSON.parse(raw) as AdminAccountSettings;
  } catch {
    return { email: fallbackEmail, twoFactorAuth: false };
  }
}

export function saveAdminAccountSettings(settings: AdminAccountSettings): void {
  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
}

export type NotificationSettings = {
  emailAlerts: boolean;
  pushAlerts: boolean;
  weeklyReport: boolean;
};

const NOTIFICATION_SETTINGS_KEY = "taggy-notification-settings";

export function loadNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (!raw) {
      return {
        emailAlerts: true,
        pushAlerts: false,
        weeklyReport: true,
      };
    }
    return JSON.parse(raw) as NotificationSettings;
  } catch {
    return {
      emailAlerts: true,
      pushAlerts: false,
      weeklyReport: true,
    };
  }
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
}
