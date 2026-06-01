import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getUsersPaginated } from "@/features/users/api/requests";
import { useGetRawVehicles } from "@/features/users/hooks/useGetRawVehicles";
import { joinUsersWithVehicles } from "@/features/users/lib/join-users-with-vehicles";
import type { UserWithVehicle } from "@/features/users/api/types";
import { sortItems } from "@/lib/list-utils";

type UseGetDriversParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  organizationId?: number;
  fleetId?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const useGetDrivers = ({
  page = 1,
  pageSize = 10,
  search,
  organizationId,
  fleetId,
  sortBy,
  sortOrder = "asc",
}: UseGetDriversParams = {}) => {
  const usersQuery = useQuery({
    queryKey: [
      "drivers",
      page,
      pageSize,
      search,
      organizationId,
      fleetId,
    ],
    queryFn: () =>
      getUsersPaginated({
        role: "motorista",
        page,
        pageSize,
        search,
        organization_id: organizationId,
        fleet_id: fleetId,
      }),
  });
  const vehiclesQuery = useGetRawVehicles();

  const data = useMemo(() => {
    if (!usersQuery.data) return undefined;

    let items = joinUsersWithVehicles(
      usersQuery.data.items,
      vehiclesQuery.data ?? [],
    );

    if (sortBy) {
      items = sortItems(items, sortBy, sortOrder, (driver, key) => {
        const record = driver as UserWithVehicle & Record<string, unknown>;
        const value = record[key];
        if (typeof value === "string" || typeof value === "number") return value;
        return "";
      });
    }

    return {
      items,
      total: usersQuery.data.total,
    };
  }, [
    usersQuery.data,
    vehiclesQuery.data,
    sortBy,
    sortOrder,
  ]);

  return {
    data,
    isLoading: usersQuery.isLoading || vehiclesQuery.isLoading,
    isError: usersQuery.isError || vehiclesQuery.isError,
    error: usersQuery.error ?? vehiclesQuery.error,
  };
};
