import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DestinationSearchPanelProps = {
  destination: string;
  onDestinationChange: (value: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
  errorMessage?: string;
};

export const DestinationSearchPanel = ({
  destination,
  onDestinationChange,
  onSearch,
  isLoading = false,
  errorMessage,
}: DestinationSearchPanelProps) => {
  const trimmed = destination.trim();
  const isEmpty = trimmed.length === 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isEmpty && !isLoading) onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">Insira seu destino</h2>
        <p className="text-sm text-muted-foreground">
          Calcule quanto você economiza nesta rota
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={destination}
          onChange={(event) => onDestinationChange(event.target.value)}
          placeholder="Para onde você vai?"
          className="pl-9"
          aria-invalid={Boolean(errorMessage)}
        />
      </div>

      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        disabled={isEmpty || isLoading}
      >
        {isLoading ? "Calculando..." : "Pesquisar destino"}
      </Button>
    </form>
  );
};
