import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { filterBySearch, paginateItems, sortItems } from "@/lib/list-utils";
import { getFleets } from "../../api/requests";
import type { Fleet } from "../../api/types";

type UseGetFleetsFilteredParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  organizationId?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const useGetFleetsFiltered = ({
  page = 1,
  pageSize = 10,
  search,
  organizationId,
  sortBy,
  sortOrder = "asc",
}: UseGetFleetsFilteredParams = {}) => {
  const query = useQuery({
    queryKey: ["fleets", "list", organizationId, search],
    queryFn: () => getFleets({ organizationId, search: search || undefined }),
  });

  const data = useMemo(() => {
    if (!query.data) return undefined;

    let items = query.data;

    items = filterBySearch(items, search, (fleet) => [
      fleet.name,
      String(fleet.id),
    ]);

    items = sortItems(items, sortBy, sortOrder, (fleet, key) => {
      const record = fleet as Fleet & Record<string, unknown>;
      const value = record[key];
      if (typeof value === "string" || typeof value === "number") return value;
      return "";
    });

    return paginateItems(items, page, pageSize);
  }, [
    query.data,
    search,
    sortBy,
    sortOrder,
    page,
    pageSize,
  ]);

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
