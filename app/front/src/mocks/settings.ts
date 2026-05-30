import type {
  FuelPriceByUF,
  TechnicalSpecs,
} from "@/features/settings/api/requests";

export const MOCK_TECHNICAL_SPECS: TechnicalSpecs = {
  id: 1,
  emission_factor_diesel_s10: 2.68,
  emission_factor_gasolina_c: 2.31,
  emission_factor_etanol: 1.52,
  idle_rate_leve: 0.8,
  idle_rate_pesado: 1.2,
  paper_co2_per_ticket: 0.005,
  paper_water_per_ticket: 10,
  ludic_tree_year_absorption: 22,
  ludic_phone_charge_factor: 0.008,
  ludic_coffee_factor: 0.05,
  baseline_pedagio_avg_wait_sec: 45,
  baseline_estacionamento_avg_wait_sec: 120,
  maint_cost_leve: 0.35,
  maint_cost_pesado: 0.55,
  accel_surge_leve: 1.15,
  accel_surge_pesado: 1.25,
  benchmark_kg_co2_per_km_car: 0.12,
  benchmark_kg_co2_per_burger: 3.5,
};

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

const BASE_DIESEL = 6.12;
const BASE_GASOLINA = 5.89;
const BASE_ETANOL = 3.95;

function priceOffset(index: number): number {
  return (index % 5) * 0.08 - 0.16;
}

export const MOCK_FUEL_PRICES: Record<string, FuelPriceByUF> = Object.fromEntries(
  UFS.map((uf, index) => [
    uf,
    {
      uf,
      price_diesel_s10: Number((BASE_DIESEL + priceOffset(index)).toFixed(2)),
      price_gasolina_c: Number((BASE_GASOLINA + priceOffset(index)).toFixed(2)),
      price_etanol: Number((BASE_ETANOL + priceOffset(index) * 0.5).toFixed(2)),
      updated_at: "2024-08-01T12:00:00Z",
    },
  ]),
);
