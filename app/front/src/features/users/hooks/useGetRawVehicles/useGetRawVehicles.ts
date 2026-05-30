import { useQuery } from "@tanstack/react-query";
import { getRawVehicles } from "../../api/raw-vehicles";

export const rawVehicleKeys = {
  all: ["raw-vehicles"] as const,
  list: () => [...rawVehicleKeys.all, "list"] as const,
};

export const useGetRawVehicles = () => {
  return useQuery({
    queryKey: rawVehicleKeys.list(),
    queryFn: getRawVehicles,
  });
};
