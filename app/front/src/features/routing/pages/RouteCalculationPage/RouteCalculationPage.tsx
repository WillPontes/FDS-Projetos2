import { useState } from "react";
import { BRAZIL_CENTER, MapboxMap } from "@/components/map";
import { DestinationSearchPanel } from "../../components/DestinationSearchPanel";
import { RouteBottomPanel } from "../../components/RouteBottomPanel";
import { RouteEstimatePanel } from "../../components/RouteEstimatePanel";
import { useSuggestRoute } from "../../hooks/useSuggestRoute";
import type { RouteEstimate } from "../../api/types";

type RouteStep = "search" | "estimate";

export const RouteCalculationPage = () => {
  const [step, setStep] = useState<RouteStep>("search");
  const [destination, setDestination] = useState("");
  const [estimate, setEstimate] = useState<RouteEstimate | null>(null);
  const [validationError, setValidationError] = useState<string>();

  const suggestRoute = useSuggestRoute();

  const handleSearch = () => {
    const trimmed = destination.trim();
    if (!trimmed) {
      setValidationError("Informe um destino para continuar.");
      return;
    }

    setValidationError(undefined);
    suggestRoute.mutate(
      { destination: trimmed },
      {
        onSuccess: (data) => {
          setEstimate(data);
          setStep("estimate");
        },
      },
    );
  };

  const handleEditDestination = () => {
    setStep("search");
    setEstimate(null);
    suggestRoute.reset();
  };

  return (
    <div className="-m-4 flex min-h-[calc(100dvh-4rem)] flex-col md:-m-8">
      <MapboxMap className="min-h-0 flex-1" center={BRAZIL_CENTER} zoom={4} />

      <RouteBottomPanel>
        {step === "search" ? (
          <DestinationSearchPanel
            destination={destination}
            onDestinationChange={(value) => {
              setDestination(value);
              if (validationError) setValidationError(undefined);
            }}
            onSearch={handleSearch}
            isLoading={suggestRoute.isPending}
            errorMessage={validationError}
          />
        ) : estimate ? (
          <RouteEstimatePanel
            estimate={estimate}
            onEditDestination={handleEditDestination}
          />
        ) : null}
      </RouteBottomPanel>
    </div>
  );
};
