import { api } from "@/lib/http-client"
import type {
  GetPassagesParams,
  ImpactMetrics,
  PassagesList,
  PassagesSummary,
  WeeklyGoal,
} from "../schemas/sustainability-schema"

const MOCK_PASSAGES = [
  {
    id: 1,
    localName: "Praça do Pedágio A25",
    passageDatetime: "10/08/2024 às 10:21:03",
    carbon: "240g",
    waterSaved: "150ml",
    time: "8min",
  },
  {
    id: 2,
    localName: "Praça do Pedágio B12",
    passageDatetime: "08/08/2024 às 10:21:03",
    carbon: "240g",
    waterSaved: "150ml",
    time: "8min",
  },
  {
    id: 3,
    localName: "Praça do Pedágio A25",
    passageDatetime: "06/08/2024 às 10:21:03",
    carbon: "240g",
    waterSaved: "150ml",
    time: "8min",
  },
  {
    id: 4,
    localName: "Praça do Pedágio C04",
    passageDatetime: "03/08/2024 às 10:21:03",
    carbon: "240g",
    waterSaved: "150ml",
    time: "8min",
  },
  {
    id: 5,
    localName: "Praça do Pedágio B12",
    passageDatetime: "01/08/2024 às 10:21:03",
    carbon: "240g",
    waterSaved: "150ml",
    time: "8min",
  },
] as const

/** §1.1 — substituir path quando endpoint existir no back */
export const getImpactMetrics = async (): Promise<ImpactMetrics> => {
  try {
    return await api.get("impact/metrics").json<ImpactMetrics>()
  } catch {
    return {
      daysSavedWithoutQueues: 147,
      treeSaved: 15,
      totalCarbon: 342,
      totalWaterSaved: 8500,
      paperSaved: 650,
    }
  }
}

/** §1.2 */
export const getWeeklyGoal = async (): Promise<WeeklyGoal> => {
  try {
    return await api.get("goals/current").json<WeeklyGoal>()
  } catch {
    return { weeklyGoal: 10, weeklyPercentage: 70 }
  }
}

/** §2.1 */
export const getPassagesSummary = async (): Promise<PassagesSummary> => {
  try {
    return await api.get("passages/summary").json<PassagesSummary>()
  } catch {
    return {
      totalPassages: 147,
      totalCarbon: 342,
      hoursSaved: 18,
    }
  }
}

/** §2.2 */
export const getPassages = async (
  params: GetPassagesParams = {},
): Promise<PassagesList> => {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10

  try {
    return await api
      .get("passages", { searchParams: { page, page_size: pageSize } })
      .json<PassagesList>()
  } catch {
    return {
      totalResults: MOCK_PASSAGES.length,
      page,
      lastPassages: [...MOCK_PASSAGES],
    }
  }
}
