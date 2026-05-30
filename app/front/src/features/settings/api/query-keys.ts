export const settingsQueryKeys = {
  all: ["settings"] as const,
  technicalSpecs: () => [...settingsQueryKeys.all, "technical-specs"] as const,
  fuelPrices: () => [...settingsQueryKeys.all, "fuel-prices"] as const,
};
