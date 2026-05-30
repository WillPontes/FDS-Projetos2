import { useMemo } from "react";
import { useGetUsers } from "@/features/users/hooks/useGetUsers";
import { useGetRawVehicles } from "@/features/users/hooks/useGetRawVehicles";
import { joinUsersWithVehicles } from "@/features/users/lib/join-users-with-vehicles";
import type { UserWithVehicle } from "@/features/users/api/types";
import { filterBySearch, paginateItems, sortItems } from "@/lib/list-utils";

type UseGetDriversParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const useGetDrivers = ({
  page = 1,
  pageSize = 10,
  search,
  sortBy,
  sortOrder = "asc",
}: UseGetDriversParams = {}) => {
  const usersQuery = useGetUsers();
  const vehiclesQuery = useGetRawVehicles();

  const data = useMemo(() => {
    if (!usersQuery.data) return undefined;

    const withVehicles = joinUsersWithVehicles(
      usersQuery.data.filter((user) => user.role === "motorista"),
      vehiclesQuery.data ?? [],
    );

    const filtered = filterBySearch(withVehicles, search, (driver) => [
      driver.name,
      driver.email,
      driver.plate ?? "",
      driver.isFleetLinked ? `Frota ${driver.fleetOrganizationId ?? ""}` : "-",
    ]);

    const sorted = sortItems(filtered, sortBy, sortOrder, (driver, key) => {
      const record = driver as UserWithVehicle & Record<string, unknown>;
      const value = record[key];
      if (typeof value === "string" || typeof value === "number") return value;
      return "";
    });

    return paginateItems(sorted, page, pageSize);
  }, [
    usersQuery.data,
    vehiclesQuery.data,
    search,
    sortBy,
    sortOrder,
    page,
    pageSize,
  ]);

  return {
    data,
    isLoading: usersQuery.isLoading || vehiclesQuery.isLoading,
    isError: usersQuery.isError || vehiclesQuery.isError,
    error: usersQuery.error ?? vehiclesQuery.error,
  };
};
