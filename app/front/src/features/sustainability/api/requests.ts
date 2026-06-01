import { api } from "@/lib/http-client"
import type {
  GetPassagesParams,
  ImpactMetrics,
  PassagesList,
  PassagesSummary,
  WeeklyGoal,
} from "../schemas/sustainability-schema"

export const getImpactMetrics = async (userId: number): Promise<ImpactMetrics> => {
  const raw = await api
    .get("/api/sustainability/impact", { searchParams: { user_id: userId } })
    .json<{
      days_saved_without_queues: number
      tree_saved: number
      total_carbon: number
      total_water_saved: number
      paper_saved: number
    }>()

  return {
    daysSavedWithoutQueues: raw.days_saved_without_queues,
    treeSaved: raw.tree_saved,
    totalCarbon: raw.total_carbon,
    totalWaterSaved: raw.total_water_saved,
    paperSaved: raw.paper_saved,
  }
}

export const getWeeklyGoal = async (userId: number): Promise<WeeklyGoal> => {
  const raw = await api
    .get("/api/sustainability/goal", { searchParams: { user_id: userId } })
    .json<{
      weekly_goal: number
      weekly_percentage: number
    }>()

  return {
    weeklyGoal: raw.weekly_goal,
    weeklyPercentage: raw.weekly_percentage,
  }
}

export const getPassagesSummary = async (
  userId: number,
  params?: Pick<GetPassagesParams, "fromDate" | "toDate">,
): Promise<PassagesSummary> => {
  const raw = await api
    .get("/api/sustainability/passages/summary", {
      searchParams: {
        user_id: userId,
        ...(params?.fromDate && { from_date: params.fromDate }),
        ...(params?.toDate && { to_date: params.toDate }),
      },
    })
    .json<{
      total_passages: number
      total_carbon: number
      hours_saved: number
    }>()

  return {
    totalPassages: raw.total_passages,
    totalCarbon: raw.total_carbon,
    hoursSaved: raw.hours_saved,
  }
}

export const getPassages = async (
  userId: number,
  params: GetPassagesParams = {},
): Promise<PassagesList> => {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10

  const raw = await api
    .get("/api/sustainability/passages", {
      searchParams: {
        user_id: userId,
        page,
        page_size: pageSize,
        ...(params.fromDate && { from_date: params.fromDate }),
        ...(params.toDate && { to_date: params.toDate }),
      },
    })
    .json<{
      total_results: number
      page: number
      last_passages: Array<{
        id: number
        local_name: string
        passage_datetime: string
        carbon: string
        water_saved: string
        time: string
      }>
    }>()

  return {
    totalResults: raw.total_results,
    page: raw.page,
    lastPassages: raw.last_passages.map((p) => ({
      id: p.id,
      localName: p.local_name,
      passageDatetime: p.passage_datetime,
      carbon: p.carbon,
      waterSaved: p.water_saved,
      time: p.time,
    })),
  }
}
