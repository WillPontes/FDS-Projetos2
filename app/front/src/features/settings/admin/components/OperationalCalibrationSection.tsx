import { useEffect, useMemo, useState } from "react";
import { Lock, LockOpen, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetFuelPrices,
  useGetTechnicalSpecs,
  useSyncEmissionFactors,
  useSyncFuelPrices,
  useUpdateFuelPriceMock,
  useUpdateTechnicalSpecs,
} from "../../hooks/useSettings";
import type { FuelPriceByUF } from "../../api/requests";

const SPEC_FIELDS: {
  key: keyof import("../../api/requests").TechnicalSpecs;
  label: string;
}[] = [
  { key: "emission_factor_diesel_s10", label: "Fator emissão Diesel S10" },
  { key: "emission_factor_gasolina_c", label: "Fator emissão Gasolina C" },
  { key: "emission_factor_etanol", label: "Fator emissão Etanol" },
  { key: "idle_rate_leve", label: "Taxa ociosidade leve" },
  { key: "idle_rate_pesado", label: "Taxa ociosidade pesado" },
  { key: "paper_co2_per_ticket", label: "CO₂ por ticket (papel)" },
  { key: "paper_water_per_ticket", label: "Água por ticket (papel)" },
  {
    key: "ludic_tree_year_absorption",
    label: "Absorção anual árvore (lúdico)",
  },
  { key: "ludic_phone_charge_factor", label: "Fator carga celular (lúdico)" },
  { key: "ludic_coffee_factor", label: "Fator café (lúdico)" },
  { key: "baseline_pedagio_avg_wait_sec", label: "Espera média pedágio (s)" },
  {
    key: "baseline_estacionamento_avg_wait_sec",
    label: "Espera média estacionamento (s)",
  },
  { key: "maint_cost_leve", label: "Custo manutenção leve" },
  { key: "maint_cost_pesado", label: "Custo manutenção pesado" },
  { key: "accel_surge_leve", label: "Surto aceleração leve" },
  { key: "accel_surge_pesado", label: "Surto aceleração pesado" },
  { key: "benchmark_kg_co2_per_km_car", label: "Benchmark kg CO₂/km carro" },
  { key: "benchmark_kg_co2_per_burger", label: "Benchmark kg CO₂/hambúrguer" },
];

export const OperationalCalibrationSection = () => {
  const { data: bundle, isLoading, isError } = useGetTechnicalSpecs();
  const {
    data: fuelPrices = {},
    isFetching: isFuelFetching,
  } = useGetFuelPrices();
  const { mutate: updateSpecs, isPending: isSavingSpecs } =
    useUpdateTechnicalSpecs();
  const { mutateAsync: syncPricesAsync, isPending: isSyncing } =
    useSyncFuelPrices();
  const { mutateAsync: syncMctiAsync, isPending: isSyncingMcti } =
    useSyncEmissionFactors();
  const { mutate: updateFuelPrice } = useUpdateFuelPriceMock();

  const [specValues, setSpecValues] = useState<Record<string, string>>({});
  const [unlockedSpecs, setUnlockedSpecs] = useState<Set<string>>(new Set());
  const [unlockedFuelRows, setUnlockedFuelRows] = useState<Set<string>>(
    new Set(),
  );
  const [localFuelPrices, setLocalFuelPrices] = useState<
    Record<string, FuelPriceByUF>
  >({});

  const toggleSpecLock = (key: string) => {
    setUnlockedSpecs((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleFuelRowLock = (uf: string) => {
    setUnlockedFuelRows((prev) => {
      const next = new Set(prev);
      if (next.has(uf)) {
        next.delete(uf);
      } else {
        next.add(uf);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!bundle?.specs) return;
    const next: Record<string, string> = {};
    for (const field of SPEC_FIELDS) {
      next[field.key] = String(bundle.specs[field.key]);
    }
    setSpecValues(next);
  }, [bundle]);

  useEffect(() => {
    if (Object.keys(fuelPrices).length) {
      setLocalFuelPrices(fuelPrices);
    }
  }, [fuelPrices]);

  const ufs = useMemo(
    () => Object.keys(localFuelPrices).sort(),
    [localFuelPrices],
  );

  const handleSyncPrices = () => {
    toast.promise(syncPricesAsync(), {
      loading: "Sincronizando preços com a ANP...",
      success: "Preços sincronizados com a ANP!",
      error: (err) =>
        err instanceof Error ? err.message : "Erro ao sincronizar preços.",
    });
  };

  const handleSyncMcti = () => {
    toast.promise(syncMctiAsync(), {
      loading: "Sincronizando fatores MCTI...",
      success: "Fatores MCTI atualizados!",
      error: (err) =>
        err instanceof Error ? err.message : "Erro ao sincronizar fatores MCTI.",
    });
  };

  const handleSaveSpecs = () => {
    if (!bundle?.specs) return;
    const payload: Record<string, number> = {};
    for (const field of SPEC_FIELDS) {
      const raw = specValues[field.key];
      const num = Number(raw);
      if (Number.isNaN(num)) {
        toast.error(`Valor inválido para ${field.label}`);
        return;
      }
      payload[field.key] = num;
    }
    updateSpecs(payload);
  };

  const handleFuelChange = (
    uf: string,
    field: keyof Pick<
      FuelPriceByUF,
      "price_diesel_s10" | "price_gasolina_c" | "price_etanol"
    >,
    value: string,
  ) => {
    setLocalFuelPrices((prev) => ({
      ...prev,
      [uf]: {
        ...prev[uf],
        uf,
        [field]: value === "" ? null : Number(value),
      },
    }));
  };

  const handleSaveFuelRow = (uf: string) => {
    const row = localFuelPrices[uf];
    if (!row) return;
    updateFuelPrice({
      uf,
      payload: {
        price_diesel_s10: row.price_diesel_s10,
        price_gasolina_c: row.price_gasolina_c,
        price_etanol: row.price_etanol,
      },
    });
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando calibração...</p>;
  }

  if (isError || !bundle) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-destructive">
            Não foi possível carregar as especificações técnicas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Especificações Técnicas</CardTitle>
            <CardDescription>
              Fatores de emissão, baselines e parâmetros da CalcEngine.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={isSyncingMcti}
            onClick={handleSyncMcti}
          >
            <RefreshCw className={cn("h-4 w-4", isSyncingMcti && "animate-spin")} />
            Sincronizar MCTI
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {SPEC_FIELDS.map((field) => {
              const isUnlocked = unlockedSpecs.has(field.key);

              return (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <div className="flex gap-2">
                    <Input
                      id={field.key}
                      type="number"
                      step="any"
                      readOnly={!isUnlocked}
                      disabled={!isUnlocked}
                      className={!isUnlocked ? "bg-muted" : undefined}
                      value={specValues[field.key] ?? ""}
                      onChange={(e) =>
                        setSpecValues((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => toggleSpecLock(field.key)}
                      aria-label={
                        isUnlocked ? "Bloquear campo" : "Desbloquear campo"
                      }
                      title={isUnlocked ? "Bloquear" : "Clique para editar"}
                    >
                      {isUnlocked ? (
                        <LockOpen className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            type="button"
            onClick={handleSaveSpecs}
            disabled={isSavingSpecs}
          >
            Salvar especificações técnicas
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Preços de Combustível por UF</CardTitle>
            <CardDescription>
              Sincronize com a ANP ou ajuste manualmente (mock local).
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={isSyncing}
            onClick={handleSyncPrices}
          >
            <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
            Sincronizar ANP
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="relative">
            {(isSyncing || isFuelFetching) && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded bg-background/60">
                <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-2" aria-label="Editar" />
                <th className="py-2 pr-4">UF</th>
                <th className="py-2 pr-4">Diesel S10</th>
                <th className="py-2 pr-4">Gasolina C</th>
                <th className="py-2 pr-4">Etanol</th>
                <th className="py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {ufs.map((uf) => {
                const row = localFuelPrices[uf];
                const isRowUnlocked = unlockedFuelRows.has(uf);

                return (
                  <tr key={uf} className="border-b">
                    <td className="py-2 pr-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFuelRowLock(uf)}
                        aria-label={
                          isRowUnlocked ? "Bloquear linha" : "Desbloquear linha"
                        }
                        title={isRowUnlocked ? "Bloquear" : "Clique para editar"}
                      >
                        {isRowUnlocked ? (
                          <LockOpen className="h-4 w-4" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </Button>
                    </td>
                    <td className="py-2 pr-4 font-medium">{uf}</td>
                    <td className="py-2 pr-4">
                      <Input
                        type="number"
                        step="any"
                        className="h-8"
                        readOnly={!isRowUnlocked}
                        disabled={!isRowUnlocked}
                        value={row.price_diesel_s10 ?? ""}
                        onChange={(e) =>
                          handleFuelChange(
                            uf,
                            "price_diesel_s10",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td className="py-2 pr-4">
                      <Input
                        type="number"
                        step="any"
                        className="h-8"
                        readOnly={!isRowUnlocked}
                        disabled={!isRowUnlocked}
                        value={row.price_gasolina_c ?? ""}
                        onChange={(e) =>
                          handleFuelChange(
                            uf,
                            "price_gasolina_c",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td className="py-2 pr-4">
                      <Input
                        type="number"
                        step="any"
                        className="h-8"
                        readOnly={!isRowUnlocked}
                        disabled={!isRowUnlocked}
                        value={row.price_etanol ?? ""}
                        onChange={(e) =>
                          handleFuelChange(uf, "price_etanol", e.target.value)
                        }
                      />
                    </td>
                    <td className="py-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={!isRowUnlocked}
                        onClick={() => handleSaveFuelRow(uf)}
                      >
                        Salvar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
