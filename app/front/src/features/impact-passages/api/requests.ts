import type { ImpactPassage, ImpactSummary } from "../schemas/impact-schema";

export const getImpactSummary = async (): Promise<ImpactSummary> => {
  // Simula o fetch do backend
  return {
    totalDaysWithoutLines: 147,
    weeklyPassesCurrent: 7,
    weeklyPassesGoal: 10,
    metaPercentage: 70,
  };
};

export const getImpactPassages = async (): Promise<ImpactPassage[]> => {
  return [
    { id: 1, name: "Praça do Pedágio A25", date: "10/08/2024 às 10:21:03", co2: "240g", water: "150ml", time: "8min" },
    { id: 2, name: "Praça do Pedágio B12", date: "08/08/2024 às 10:21:03", co2: "240g", water: "150ml", time: "8min" },
    { id: 3, name: "Praça do Pedágio A25", date: "06/08/2024 às 10:21:03", co2: "240g", water: "150ml", time: "8min" },
    { id: 4, name: "Praça do Pedágio C04", date: "03/08/2024 às 10:21:03", co2: "240g", water: "150ml", time: "8min" },
    { id: 5, name: "Praça do Pedágio B12", date: "01/08/2024 às 10:21:03", co2: "240g", water: "150ml", time: "8min" },
  ];
};