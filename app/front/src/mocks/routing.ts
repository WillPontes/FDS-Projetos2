const MOCK_DESTINATIONS: Record<
  string,
  { distanceKm: number; durationMin: number }
> = {
  "são paulo": { distanceKm: 45, durationMin: 55 },
  "rio de janeiro": { distanceKm: 430, durationMin: 360 },
  "belo horizonte": { distanceKm: 440, durationMin: 330 },
  "curitiba": { distanceKm: 410, durationMin: 300 },
  "brasília": { distanceKm: 15, durationMin: 25 },
  campinas: { distanceKm: 95, durationMin: 75 },
};

function hashDestination(destination: string): number {
  let hash = 0;
  for (let i = 0; i < destination.length; i++) {
    hash = (hash << 5) - hash + destination.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function resolveRouteMetrics(destination: string) {
  const normalized = destination.trim().toLowerCase();
  const known = MOCK_DESTINATIONS[normalized];

  if (known) return known;

  const hash = hashDestination(normalized);
  return {
    distanceKm: 20 + (hash % 180),
    durationMin: 15 + (hash % 240),
  };
}

import type { RouteEstimate } from "@/features/routing/api/types";

export async function mockSuggestRoute(
  destination: string,
): Promise<RouteEstimate> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const { distanceKm, durationMin } = resolveRouteMetrics(destination);
  const benchmarkCarbonKg = Number((distanceKm * 0.21).toFixed(1));
  const carbonEstimateKg = Number((distanceKm * 0.14).toFixed(1));
  const carbonSavedKg = Number(
    (benchmarkCarbonKg - carbonEstimateKg).toFixed(1),
  );
  const carbonSavedPct = Math.round((carbonSavedKg / benchmarkCarbonKg) * 100);
  const fuelSavedLiters = Number((distanceKm * 0.035).toFixed(1));

  return {
    destination: destination.trim(),
    distanceKm,
    durationMin,
    carbonEstimateKg,
    benchmarkCarbonKg,
    carbonSavedKg,
    carbonSavedPct,
    fuelSavedLiters,
  };
}
