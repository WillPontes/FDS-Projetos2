import type {
  ImpactMetrics,
  Passage,
  PassagesSummary,
  WeeklyGoal,
} from "@/features/sustainability/schemas/sustainability-schema";

export const MOCK_IMPACT_METRICS: ImpactMetrics = {
  daysSavedWithoutQueues: 147,
  treeSaved: 15,
  totalCarbon: 342,
  totalWaterSaved: 8500,
  paperSaved: 650,
};

export const MOCK_WEEKLY_GOAL: WeeklyGoal = {
  weeklyGoal: 15,
  weeklyPercentage: 70,
};

export const MOCK_PASSAGES_SUMMARY: PassagesSummary = {
  totalPassages: 147,
  totalCarbon: 342,
  hoursSaved: 18,
};

export const MOCK_PASSAGES: Passage[] = [
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
];
