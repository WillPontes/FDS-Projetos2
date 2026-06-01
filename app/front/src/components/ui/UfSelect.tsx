import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UF_OPTIONS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

type UfSelectProps = {
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
  placeholder?: string;
};

export const UfSelect = ({
  value,
  onValueChange,
  placeholder = "UF",
}: UfSelectProps) => (
  <Select
    value={value ?? "all"}
    onValueChange={(v) => onValueChange(v === "all" ? undefined : v)}
  >
    <SelectTrigger
      className="w-20"
      clearable
      hasValue={value != null}
      onClear={() => onValueChange(undefined)}
    >
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="max-h-48 [&>div:nth-child(2)]:!h-auto [&>div:nth-child(2)]:max-h-40">
      <SelectItem value="all">Todas</SelectItem>
      {UF_OPTIONS.map((uf) => (
        <SelectItem key={uf} value={uf}>
          {uf}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
