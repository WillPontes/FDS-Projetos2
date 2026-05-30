export type RouteSuggestRequest = {
  destination: string;
};

export type RouteEstimate = {
  destination: string;
  distanceKm: number;
  durationMin: number;
  carbonEstimateKg: number;
  benchmarkCarbonKg: number;
  carbonSavedKg: number;
  carbonSavedPct: number;
  fuelSavedLiters: number;
};
