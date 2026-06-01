import type { SelectOption } from "@/components/form/ControlledSelect";

export const VEHICLE_FUEL_OPTIONS: SelectOption[] = [
  { label: "Diesel S10", value: "diesel_s10" },
  { label: "Gasolina C", value: "gasolina_c" },
  { label: "Etanol", value: "etanol" },
];

export const VEHICLE_CATEGORY_OPTIONS: SelectOption[] = [
  { label: "Leve", value: "leve" },
  { label: "Pesado", value: "pesado" },
];

export const VEHICLE_CATEGORY_LABELS: Record<string, string> = {
  leve: "Leve",
  pesado: "Pesado",
};

export const STATUS_LABELS: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  maintenance: "Em Manutenção",
};

export const STATUS_OPTIONS: SelectOption[] = [
  { label: "Ativo", value: "active" },
  { label: "Inativo", value: "inactive" },
  { label: "Em Manutenção", value: "maintenance" },
];
