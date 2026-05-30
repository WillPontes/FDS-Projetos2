import { Clock, Fuel, Leaf, MapPin, Route } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  KpiCard,
  MetricCard,
  sectionCardLabelClass,
} from "@/features/sustainability/components/MetricCard";
import type { RouteEstimate } from "../../api/types";

type RouteEstimatePanelProps = {
  estimate: RouteEstimate;
  onEditDestination: () => void;
};

export const RouteEstimatePanel = ({
  estimate,
  onEditDestination,
}: RouteEstimatePanelProps) => {
  const handleStartRoute = () => {
    toast.success("Navegação iniciada");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">Estimativa da rota</h2>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="font-medium text-foreground">{estimate.destination}</span>
        </div>
      </div>

      <KpiCard
        title="ECONOMIA ESTIMADA"
        value={`${estimate.carbonSavedKg} kg CO₂`}
        icon={<Leaf className="text-[#72C215]" size={30} />}
      />

      <p className="text-sm text-muted-foreground">
        {estimate.carbonSavedPct}% menos emissões que rota padrão
      </p>

      <div className="grid grid-cols-3 gap-4">
        <KpiCard
          title="DISTÂNCIA"
          value={`${estimate.distanceKm} km`}
          icon={<Route className="text-[#72C215]" size={30} />}
        />
        <KpiCard
          title="DURAÇÃO"
          value={`${estimate.durationMin} min`}
          icon={<Clock className="text-[#72C215]" size={30} />}
        />
        <KpiCard
          title="COMBUSTÍVEL"
          value={`${estimate.fuelSavedLiters} L`}
          icon={<Fuel className="text-[#72C215]" size={30} />}
        />
      </div>

      <MetricCard className="p-4">
        <p className={sectionCardLabelClass}>Comparativo de emissões</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-taggy-brand-accent">
            <Leaf className="h-4 w-4 text-taggy-brand" />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-foreground">
              Seu veículo: {estimate.carbonEstimateKg} kg CO₂
            </p>
            <p className="text-muted-foreground">
              Rota padrão: {estimate.benchmarkCarbonKg} kg CO₂
            </p>
          </div>
        </div>
      </MetricCard>

      <Button type="button" className="w-full" onClick={handleStartRoute}>
        Iniciar rota
      </Button>

      <button
        type="button"
        onClick={onEditDestination}
        className="w-full text-center text-sm font-medium text-primary hover:underline"
      >
        Alterar destino
      </button>
    </div>
  );
};
