import type { SelectOption } from "@/components/form/ControlledSelect";

export const REGION_OPTIONS: SelectOption[] = [
  { label: "Norte", value: "norte" },
  { label: "Nordeste", value: "nordeste" },
  { label: "Centro-Oeste", value: "centro-oeste" },
  { label: "Sudeste", value: "sudeste" },
  { label: "Sul", value: "sul" },
];

export const DEFAULT_REGION = "sudeste";
