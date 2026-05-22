// src/routes/passages-impact.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ImpactPage } from "@/features/impact-passages"; // Importando da pasta correta

export const Route = createFileRoute("/passages-impact")({
  component: ImpactPage,
});