import { z } from "zod"

export const impactPassageSchema = z.object({
  id: z.number(),
  name: z.string(),
  date: z.string(),
  co2: z.string(),
  water: z.string(),
  time: z.string(),
})

export const impactSummarySchema = z.object({
  totalDaysWithoutLines: z.number(),
  totalCo2: z.string(),
  totalHours: z.number(),
  weeklyPassesCurrent: z.number(),
  weeklyPassesGoal: z.number(),
  metaPercentage: z.number(),
})

export type ImpactPassage = z.infer<typeof impactPassageSchema>
export type ImpactSummary = z.infer<typeof impactSummarySchema>