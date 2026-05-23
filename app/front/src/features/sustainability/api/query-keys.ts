import type { GetPassagesParams } from "../schemas/sustainability-schema"

export const sustainabilityKeys = {
  all: () => ["sustainability"] as const,
  metrics: () => [...sustainabilityKeys.all(), "metrics"] as const,
  weeklyGoal: () => [...sustainabilityKeys.all(), "weekly-goal"] as const,
  passagesSummary: () =>
    [...sustainabilityKeys.all(), "passages-summary"] as const,
  passages: (params: GetPassagesParams) =>
    [...sustainabilityKeys.all(), "passages", params] as const,
}
