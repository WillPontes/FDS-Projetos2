import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getFuelPrices,
  getTechnicalSpecsBundle,
  syncFuelPrices,
  updateFuelPriceMock,
  updateTechnicalSpecs,
  type FuelPriceByUF,
  type TechnicalSpecs,
} from "../../api/requests";
import { settingsQueryKeys } from "../../api/query-keys";

export const useGetTechnicalSpecs = () =>
  useQuery({
    queryKey: settingsQueryKeys.technicalSpecs(),
    queryFn: getTechnicalSpecsBundle,
  });

export const useGetFuelPrices = () =>
  useQuery({
    queryKey: settingsQueryKeys.fuelPrices(),
    queryFn: getFuelPrices,
  });

export const useUpdateTechnicalSpecs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<TechnicalSpecs>) =>
      updateTechnicalSpecs(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: settingsQueryKeys.technicalSpecs(),
      });
      toast.success("Especificações técnicas atualizadas!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao salvar especificações.");
    },
  });
};

export const useSyncFuelPrices = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncFuelPrices,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.fuelPrices(), data);
      queryClient.invalidateQueries({
        queryKey: settingsQueryKeys.technicalSpecs(),
      });
      toast.success("Preços sincronizados com a ANP!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao sincronizar preços.");
    },
  });
};

export const useUpdateFuelPriceMock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      uf,
      payload,
    }: {
      uf: string;
      payload: Partial<FuelPriceByUF>;
    }) => updateFuelPriceMock(uf, payload),
    onSuccess: (_, { uf }) => {
      queryClient.invalidateQueries({
        queryKey: settingsQueryKeys.fuelPrices(),
      });
      queryClient.invalidateQueries({
        queryKey: settingsQueryKeys.technicalSpecs(),
      });
      toast.success(`Preços de ${uf} atualizados localmente (mock).`);
    },
  });
};
