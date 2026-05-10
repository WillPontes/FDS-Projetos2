import type { SelectOption } from "@/components/ControlledSelect"

export const STATUS_LABELS: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  maintenance: "Em Manutenção",
}

export const STATUS_OPTIONS: SelectOption[] = [
  { label: "Ativo", value: "active" },
  { label: "Inativo", value: "inactive" },
  { label: "Em Manutenção", value: "maintenance" },
]
