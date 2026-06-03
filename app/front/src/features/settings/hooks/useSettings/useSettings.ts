import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFuelPrices,
  getTechnicalSpecsBundle,
  syncEmissionFactors,
  syncFuelPrices,
  updateFuelPrice,
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: settingsQueryKeys.technicalSpecs(),
      });
    },
  });
};

export const useSyncEmissionFactors = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncEmissionFactors,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: settingsQueryKeys.technicalSpecs(),
      });
    },
  });
};

export const useSyncFuelPrices = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncFuelPrices,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: settingsQueryKeys.fuelPrices(),
      });
    },
  });
};

export const useUpdateFuelPrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      uf,
      payload,
    }: {
      uf: string;
      payload: Partial<FuelPriceByUF>;
    }) => updateFuelPrice(uf, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: settingsQueryKeys.fuelPrices(),
      });
    },
  });
};
