export const KPI_ICON_SIZE = 30;

export const KPI_TITLES = {
  co2Avoided: "EMISSÃO DE CO₂ EVITADAS",
  fuelSaved: "COMBUSTÍVEL ECONOMIZADO",
  paperSaved: "PAPEL ECONOMIZADO",
  financialSavings: "ECONOMIA ACUMULADA (ROI)",
  passages: "TOTAL DE PASSAGENS",
  vehicles: "VEÍCULOS CADASTRADOS",
  drivers: "MOTORISTAS CADASTRADOS",
  people: "PESSOAS VINCULADAS",
  tagsActive: "TAGS ATIVOS",
  hoursSaved: "TEMPO ECONOMIZADO",
  distance: "DISTÂNCIA ESTIMADA",
  duration: "DURAÇÃO ESTIMADA",
} as const;

const ptNumber = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

function formatOrDash(
  value: number | null | undefined,
  formatter: (n: number) => string,
): string {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  return formatter(value);
}

export function formatKpiCount(value: number | null | undefined): string {
  return formatOrDash(value, (n) => ptNumber.format(n));
}

export function formatKpiCo2(kg: number | null | undefined): string {
  return formatOrDash(kg, (n) => `${ptNumber.format(n)}kg`);
}

export function formatKpiFuel(liters: number | null | undefined): string {
  return formatOrDash(liters, (n) => `${ptNumber.format(n)}L`);
}

export function formatKpiPaper(meters: number | null | undefined): string {
  return formatOrDash(meters, (n) => `${ptNumber.format(n)}m`);
}

export function formatKpiCurrency(brl: number | null | undefined): string {
  return formatOrDash(brl, (n) => `R$ ${ptNumber.format(n)}`);
}

export function formatKpiHours(hours: number | null | undefined): string {
  return formatOrDash(hours, (n) => `${ptNumber.format(n)}h`);
}

export function formatKpiDistance(km: number | null | undefined): string {
  return formatOrDash(km, (n) => `${ptNumber.format(n)}km`);
}

export function formatKpiDuration(min: number | null | undefined): string {
  return formatOrDash(min, (n) => `${ptNumber.format(n)}min`);
}

export type EnvironmentalSummary = {
  co2_total_kg?: number | null;
  fuel_total_liters?: number | null;
  paper_saved_meters?: number | null;
  financial_total_brl?: number | null;
  total_savings_brl?: number | null;
};

export function formatEnvironmentalFinancial(
  summary: EnvironmentalSummary,
): string {
  const value = summary.financial_total_brl ?? summary.total_savings_brl;
  return formatKpiCurrency(value);
}
