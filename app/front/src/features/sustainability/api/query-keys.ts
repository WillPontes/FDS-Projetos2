import type { GetPassagesParams } from "../schemas/sustainability-schema"

export const sustainabilityKeys = {
  all: () => ["sustainability"] as const,
  metrics: (userId?: number) => [...sustainabilityKeys.all(), "metrics", userId] as const,
  weeklyGoal: (userId?: number) => [...sustainabilityKeys.all(), "weekly-goal", userId] as const,
  passagesSummary: (userId?: number, params?: Pick<GetPassagesParams, "fromDate" | "toDate">) =>
    [...sustainabilityKeys.all(), "passages-summary", userId, params] as const,
  passages: (userId?: number, params: GetPassagesParams = {}) =>
    [...sustainabilityKeys.all(), "passages", userId, params] as const,
}
