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

export const UfSelect = ({ value, onValueChange, placeholder = "UF" }: UfSelectProps) => (
  <Select
    value={value ?? "all"}
    onValueChange={(v) => onValueChange(v === "all" ? undefined : v)}
  >
    <SelectTrigger className="h-9 w-28">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Todas</SelectItem>
      {UF_OPTIONS.map((uf) => (
        <SelectItem key={uf} value={uf}>{uf}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);
