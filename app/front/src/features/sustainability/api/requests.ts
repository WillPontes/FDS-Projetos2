import { api } from "@/lib/http-client"
import {
  MOCK_IMPACT_METRICS,
  MOCK_PASSAGES,
  MOCK_PASSAGES_SUMMARY,
  MOCK_WEEKLY_GOAL,
  resolveWithMock,
} from "@/mocks"
import type {
  GetPassagesParams,
  ImpactMetrics,
  PassagesList,
  PassagesSummary,
  WeeklyGoal,
} from "../schemas/sustainability-schema"
import { paginateItems } from "@/lib/list-utils"

/** §1.1 — substituir path quando endpoint existir no back */
export const getImpactMetrics = async (): Promise<ImpactMetrics> => {
  return resolveWithMock(
    () => api.get("impact/metrics").json<ImpactMetrics>(),
    () => MOCK_IMPACT_METRICS,
  )
}

/** §1.2 */
export const getWeeklyGoal = async (): Promise<WeeklyGoal> => {
  return resolveWithMock(
    () => api.get("goals/current").json<WeeklyGoal>(),
    () => MOCK_WEEKLY_GOAL,
  )
}

/** §2.1 */
export const getPassagesSummary = async (): Promise<PassagesSummary> => {
  return resolveWithMock(
    () => api.get("passages/summary").json<PassagesSummary>(),
    () => MOCK_PASSAGES_SUMMARY,
  )
}

/** §2.2 */
export const getPassages = async (
  params: GetPassagesParams = {},
): Promise<PassagesList> => {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10

  return resolveWithMock(
    () =>
      api
        .get("passages", { searchParams: { page, page_size: pageSize } })
        .json<PassagesList>(),
    () => {
      const { items, total } = paginateItems(MOCK_PASSAGES, page, pageSize)
      return {
        totalResults: total,
        page,
        lastPassages: items,
      }
    },
  )
}
